import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initRecordSubmission } from '../src/utils/recordSubmission';

function setup(send: typeof fetch) {
  const { document, window } = parseHTML('<html><head><title>Submit a site</title></head><body><form id="submitForm" action="https://example.com/submission"><label for="siteName">Site name</label><input id="siteName" name="siteName" value="Example site"><label for="photo-upload">Photos</label><input id="photo-upload" name="photos" type="file"><input id="photoUrlsInput" name="photoUrls" type="hidden"><p id="photoUploadStatus"></p><button id="submitButton" type="submit">Submit site</button></form></body></html>');
  const form = document.querySelector<HTMLFormElement>('form')!;
  const photos = document.querySelector<HTMLInputElement>('#photo-upload')!;
  const urls = document.querySelector<HTMLInputElement>('#photoUrlsInput')!;
  let files = [new File(['test'], 'test.png', { type: 'image/png' })];
  Object.defineProperty(photos, 'files', { get: () => files });
  form.querySelectorAll<HTMLInputElement>('input').forEach(field => {
    let custom = '';
    field.setCustomValidity = message => { custom = message; };
    Object.defineProperties(field, {
      willValidate: { get: () => field.type !== 'hidden' },
      validity: { get: () => ({ valid: !custom, customError: Boolean(custom) }) },
      validationMessage: { get: () => custom },
    });
  });
  const NativeFormData = FormData;
  vi.stubGlobal('FormData', class extends NativeFormData {
    constructor(source?: HTMLFormElement) {
      super();
      source?.querySelectorAll<HTMLInputElement>('input').forEach(field => {
        if (field.type === 'file') files.forEach(file => this.append(field.name, file));
        else this.append(field.name, field.value);
      });
    }
  });
  initRecordSubmission(form, 'site', send);
  return {
    form, photos, urls,
    submit: () => form.dispatchEvent(new window.Event('submit', { cancelable: true })),
    choose: (name: string) => { files = [new File(['test'], name, { type: 'image/png' })]; photos.dispatchEvent(new window.Event('change', { bubbles: true })); },
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('record uploads and submission', () => {
  it('blocks review during upload, sends image URLs once, preserves answers on failure and permits retry', async () => {
    let finishUpload!: (response: Response) => void;
    const send = vi.fn<typeof fetch>()
      .mockImplementationOnce(() => new Promise(resolve => { finishUpload = resolve; }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const ui = setup(send);
    ui.choose('site.png');
    ui.submit();
    expect(send).toHaveBeenCalledOnce();
    expect(ui.form.querySelector<HTMLElement>('.form-review')!.hidden).toBe(true);
    finishUpload(Response.json({ secure_url: 'https://example.com/site.png' }));
    await vi.waitFor(() => expect(ui.urls.value).toContain('site.png'));
    ui.submit();
    expect(send).toHaveBeenCalledOnce();
    ui.submit();
    await vi.waitFor(() => expect(ui.form.getAttribute('aria-busy')).toBeNull());
    const payload = send.mock.calls[1][1]!.body as FormData;
    expect(payload.get('photoUrls')).toBe('["https://example.com/site.png"]');
    expect(payload.has('photos')).toBe(false);
    expect(payload.get('siteName')).toBe('Example site');
    expect(ui.urls.value).toContain('site.png');
    expect(ui.form.textContent).toContain('Your answers and uploaded photographs are still here');
    ui.submit();
    await vi.waitFor(() => expect(ui.form.querySelector('.form-confirmation')).not.toBeNull());
    ui.submit();
    expect(send).toHaveBeenCalledTimes(3);
  });

  it('keeps upload failure as a field error and ignores an older upload after a new selection', async () => {
    let oldUpload!: (response: Response) => void;
    const send = vi.fn<typeof fetch>()
      .mockImplementationOnce(() => new Promise(resolve => { oldUpload = resolve; }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    const ui = setup(send);
    ui.choose('old.png');
    ui.choose('new.png');
    await vi.waitFor(() => expect(ui.photos.validationMessage).toContain('retry'));
    oldUpload(Response.json({ secure_url: 'https://example.com/old.png' }));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(ui.urls.value).toBe('');
    ui.submit();
    expect(ui.form.querySelector('.form-error-summary a')!.textContent).toContain('retry');
    expect(send).toHaveBeenCalledTimes(2);
  });
});
