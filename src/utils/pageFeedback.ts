export type PageRating = 'yes' | 'no';

export function feedbackPayload(rating: PageRating, details: string, page: URL) {
  return {
    subject: 'Website page feedback',
    useful: rating,
    page_path: page.pathname,
    details: details.trim().slice(0, 2000),
  };
}

export function initPageFeedback(root: HTMLElement, page: URL, send: typeof fetch = fetch) {
  const form = root.querySelector<HTMLFormElement>('form');
  const button = root.querySelector<HTMLButtonElement>('[type="submit"]');
  const status = root.querySelector<HTMLElement>('[data-feedback-status]');
  const error = root.querySelector<HTMLElement>('[data-feedback-error]');
  if (!form || !button || !status || !error) return;
  let pending = false;
  let sent = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || sent) return;
    const rating = form.querySelector<HTMLInputElement>('[name="useful"]:checked')?.value;
    if (rating !== 'yes' && rating !== 'no') return;
    const details = form.querySelector<HTMLTextAreaElement>('[name="details"]')?.value || '';
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true;
    try {
      const response = await send(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(feedbackPayload(rating, details, page)),
      });
      if (!response.ok) throw new Error('Feedback could not be sent');
      sent = true;
      form.hidden = true;
      status.hidden = false;
      status.focus();
    } catch {
      error.textContent = 'Your feedback could not be sent. Your answer is still here. Please try again.';
      error.hidden = false;
      error.focus();
    } finally {
      pending = false;
      button.disabled = sent;
      button.textContent = 'Send feedback';
      form.removeAttribute('aria-busy');
    }
  });
}
