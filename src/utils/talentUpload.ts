export function initTalentUpload(form: HTMLFormElement) {
  if (form.dataset.uploadReady) return;
  const { cloudName, uploadPreset } = form.dataset;
  const panel = form.querySelector<HTMLElement>('[data-photo-upload]');
  const input = form.querySelector<HTMLInputElement>('#profilePicInput');
  const url = form.querySelector<HTMLInputElement>('#profilePicUrl');
  const status = form.querySelector<HTMLElement>('#uploadStatus');
  const preview = form.querySelector<HTMLElement>('#imagePreview');
  const image = form.querySelector<HTMLImageElement>('#previewImage');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  if (!cloudName || !uploadPreset || !panel || !input || !url || !status || !preview || !image || !submit) return;
  form.dataset.uploadReady = 'true';
  panel.hidden = false;
  let request: AbortController | undefined;
  let previewUrl: string | undefined;
  const reset = () => {
    request?.abort(); request = undefined;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = undefined;
    preview.hidden = true;
    image.removeAttribute('src');
    submit.disabled = false;
  };
  url.addEventListener('input', () => {
    reset(); input.value = ''; status.textContent = '';
  });
  input.addEventListener('change', async () => {
    reset(); url.value = ''; status.textContent = '';
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      status.textContent = 'Choose a JPEG, PNG or WebP image no larger than 10 MB, or enter a photo link.';
      input.value = ''; return;
    }
    const activeRequest = new AbortController(); request = activeRequest;
    previewUrl = URL.createObjectURL(file); image.src = previewUrl; preview.hidden = false;
    submit.disabled = true; status.textContent = 'Uploading your photograph…';
    const body = new FormData(); body.append('file', file); body.append('upload_preset', uploadPreset);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, { method: 'POST', body, signal: activeRequest.signal });
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      if (typeof data.secure_url !== 'string' || new URL(data.secure_url).protocol !== 'https:') throw new Error('Missing image URL');
      if (activeRequest.signal.aborted) return;
      url.value = data.secure_url;
      status.textContent = 'Photograph uploaded. You can now submit your profile.';
    } catch {
      if (activeRequest.signal.aborted) return;
      status.textContent = 'The photograph could not be uploaded. Try again or enter a photo link above.';
    } finally {
      if (request === activeRequest) { request = undefined; submit.disabled = false; }
    }
  });
  form.addEventListener('submit', event => { if (request) event.preventDefault(); });
  document.addEventListener('astro:before-swap', reset, { once: true });
}
