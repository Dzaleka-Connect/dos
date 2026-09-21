import { afterEach, describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initTalentUpload } from '../src/utils/talentUpload';

function setup() {
  const { document, Event } = parseHTML('<form data-cloud-name="example" data-upload-preset="public"><div data-photo-upload hidden><input id="profilePicInput" type="file"><input id="profilePicUrl" type="url" required><p id="uploadStatus"></p><figure id="imagePreview" hidden><img id="previewImage"></figure></div><button type="submit"></button></form>');
  vi.stubGlobal('document', document);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const form = document.querySelector('form') as HTMLFormElement;
  const input = form.querySelector<HTMLInputElement>('#profilePicInput')!;
  const url = form.querySelector<HTMLInputElement>('#profilePicUrl')!;
  const status = form.querySelector('#uploadStatus')!;
  initTalentUpload(form);
  return { form, input, url, status, Event, choose: (file: File) => {
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change'));
  } };
}
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('talent photograph upload', () => {
  it('rejects unsupported or oversized files before uploading', () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const { choose, status } = setup();
    choose(new File(['text'], 'profile.txt', { type: 'text/plain' }));
    expect(status.textContent).toContain('Choose a JPEG');
    choose(new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }));
    expect(fetch).not.toHaveBeenCalled();
  });
  it('fills the photo link only after a successful upload and unblocks submission', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ secure_url: 'https://example.org/photo.jpg' }) }));
    const { form, choose, url, status } = setup();
    choose(new File(['image'], 'profile.jpg', { type: 'image/jpeg' }));
    expect(form.querySelector('button')!.disabled).toBe(true);
    await vi.waitFor(() => expect(url.value).toBe('https://example.org/photo.jpg'));
    expect(status.textContent).toContain('Photograph uploaded');
    expect(form.querySelector('button')!.disabled).toBe(false);
  });
  it('does not replace a manually entered link with a late upload response', async () => {
    let finish!: (response: unknown) => void;
    const pending = new Promise(resolve => { finish = resolve; });
    const fetch = vi.fn().mockReturnValue(pending); vi.stubGlobal('fetch', fetch);
    const { form, choose, url, Event } = setup();
    choose(new File(['image'], 'profile.jpg', { type: 'image/jpeg' }));
    url.value = 'https://example.org/my-link.jpg'; url.dispatchEvent(new Event('input'));
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    finish({ ok: true, json: async () => ({ secure_url: 'https://example.org/stale.jpg' }) });
    await pending; await Promise.resolve(); await Promise.resolve();
    expect(url.value).toBe('https://example.org/my-link.jpg');
    expect(form.querySelector('button')!.disabled).toBe(false);
  });
  it('keeps the photo-link fallback available after a failed upload', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { form, choose, status, url } = setup();
    choose(new File(['image'], 'profile.jpg', { type: 'image/jpeg' }));
    await vi.waitFor(() => expect(status.textContent).toContain('could not be uploaded'));
    expect(url.value).toBe('');
    expect(form.querySelector('button')!.disabled).toBe(false);
  });
});
