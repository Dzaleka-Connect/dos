import { describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { feedbackPayload, initPageFeedback } from '../src/utils/pageFeedback';

function setup(send: typeof fetch, rating = 'yes') {
  const { document, window } = parseHTML(`<section><form action="https://formspree.io/f/xqaaajae"><input type="radio" name="useful" value="${rating}" checked><textarea name="details">Keep this comment</textarea><button type="submit">Send feedback</button></form><p data-feedback-error hidden></p><p data-feedback-status hidden></p></section>`);
  const root = document.querySelector<HTMLElement>('section')!;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const button = root.querySelector<HTMLButtonElement>('button')!;
  initPageFeedback(root, new URL('https://services.dzaleka.com/services?email=private@example.com#section'), send);
  return { root, form, button, submit: () => form.dispatchEvent(new window.Event('submit', { cancelable: true })) };
}

describe('page feedback', () => {
  it('excludes queries, fragments and origins from submitted page context', () => {
    expect(feedbackPayload('yes', '  helpful  ', new URL('https://example.org/services/refan?token=private#contact'))).toEqual({ subject: 'Website page feedback', useful: 'yes', page_path: '/services/refan', details: 'helpful' });
  });
  it.each(['yes', 'no'])('sends a %s rating and only acknowledges after acceptance', async rating => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 200 }));
    const ui = setup(send, rating);
    ui.submit();
    expect(ui.button.disabled).toBe(true);
    await vi.waitFor(() => expect(ui.form.hidden).toBe(true));
    expect(ui.root.querySelector<HTMLElement>('[data-feedback-status]')?.hidden).toBe(false);
    expect(JSON.parse(String(send.mock.calls[0][1]?.body))).toMatchObject({ useful: rating, page_path: '/services', details: 'Keep this comment' });
    ui.submit();
    expect(send).toHaveBeenCalledOnce();
  });
  it('retains answers after a server error and permits retry', async () => {
    const send = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 500 })).mockResolvedValueOnce(new Response(null, { status: 200 }));
    const ui = setup(send, 'no');
    ui.submit();
    await vi.waitFor(() => expect(ui.root.querySelector<HTMLElement>('[data-feedback-error]')?.hidden).toBe(false));
    expect(ui.form.hidden).toBe(false);
    expect(ui.button.disabled).toBe(false);
    expect(ui.form.querySelector('textarea')?.value).toBe('Keep this comment');
    ui.submit();
    await vi.waitFor(() => expect(ui.form.hidden).toBe(true));
    expect(send).toHaveBeenCalledTimes(2);
  });
  it('prevents duplicate pending sends and handles network failures', async () => {
    let rejectRequest: (reason: Error) => void = () => {};
    const send = vi.fn<typeof fetch>().mockImplementation(() => new Promise<Response>((_, reject) => { rejectRequest = reject; }));
    const ui = setup(send);
    ui.submit(); ui.submit();
    expect(send).toHaveBeenCalledOnce();
    rejectRequest(new Error('Offline'));
    await vi.waitFor(() => expect(ui.button.disabled).toBe(false));
    expect(ui.root.querySelector<HTMLElement>('[data-feedback-status]')?.hidden).toBe(true);
  });
});
