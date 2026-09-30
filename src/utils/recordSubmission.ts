import { initReviewedForm } from './reviewedForm';

export function initRecordSubmission(form: HTMLFormElement, kind: 'site' | 'artwork', send: typeof fetch = fetch) {
  const flow = initReviewedForm(form, {
    title: kind === 'site' ? 'Site submitted for review' : 'Artwork submitted for review',
    message: 'Your information has been submitted for review. It has not been published. If you need to correct anything, contact the help desk with the name of the site or artwork.',
    href: kind === 'site' ? '/site-register' : '/public-art-catalogue',
    linkText: kind === 'site' ? 'Return to the Site Register' : 'Return to the Public Art Catalogue',
  });
  const photos = form.querySelector<HTMLInputElement>('#photo-upload')!;
  const urls = form.querySelector<HTMLInputElement>('#photoUrlsInput')!;
  const status = form.querySelector<HTMLElement>('#photoUploadStatus')!;
  const button = form.querySelector<HTMLButtonElement>('#submitButton')!;
  let upload: AbortController | undefined;

  photos.addEventListener('change', async () => {
    upload?.abort();
    const controller = new AbortController();
    upload = controller;
    urls.value = '';
    const files = [...(photos.files || [])];
    photos.setCustomValidity('');
    if (!files.length) { status.textContent = ''; button.disabled = false; return; }
    photos.setCustomValidity('Wait for the photographs to finish uploading.');
    button.disabled = true;
    status.textContent = 'Uploading photographs…';
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        body.append('upload_preset', 'dzaleka_events');
        const response = await send('https://api.cloudinary.com/v1_1/dcvwslmow/upload', { method: 'POST', body, signal: controller.signal });
        const result = await response.json();
        if (!response.ok || typeof result.secure_url !== 'string' || !result.secure_url.startsWith('https://')) throw new Error('Upload failed');
        uploaded.push(result.secure_url);
      }
      if (controller.signal.aborted) return;
      urls.value = JSON.stringify(uploaded);
      photos.setCustomValidity('');
      status.textContent = `${uploaded.length} ${uploaded.length === 1 ? 'photograph uploaded' : 'photographs uploaded'}.`;
    } catch {
      if (controller.signal.aborted) return;
      photos.setCustomValidity('Choose your photographs again to retry the upload.');
      status.textContent = 'The upload did not finish. Choose your photographs again to retry. Your other answers are still here.';
    } finally {
      if (!controller.signal.aborted) button.disabled = false;
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const body = new FormData(form);
      // Cloudinary holds the images; submit their URLs rather than uploading each file twice.
      body.delete('photos');
      const response = await send(form.action, { method: 'POST', body, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Submission failed');
      flow.succeed();
    } catch {
      flow.fail('Your submission could not be sent. Your answers and uploaded photographs are still here. Check your connection and try again.');
    }
  });
}
