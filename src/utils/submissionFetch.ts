import { submissionTarget } from '../lib/submissions/targets';
export function solveChallenge(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./submission-worker.ts', import.meta.url), { type: 'module' });
    const finish = (value?: string) => {
      clearTimeout(timer); worker.terminate();
      if (value) resolve(value); else reject(new Error('Verification took too long. Please try again.'));
    };
    const timer = setTimeout(() => finish(), 45000);
    worker.onmessage = event => finish(event.data);
    worker.onerror = () => finish();
    worker.postMessage(token);
  });
}
export async function submissionProof(target: string) {
  const response = await fetch('/api/form-challenge?target=' + encodeURIComponent(target), { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) throw new Error('Verification is temporarily unavailable. Please try again.');
  const challenge = await response.json();
  return { token: challenge.token as string, work: await solveChallenge(challenge.token) };
}
export const submissionFetch: typeof fetch = async (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input), location.origin);
  const target = submissionTarget(url);
  if (url.origin !== location.origin || !target || (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase() !== 'POST') return fetch(input, init);
  const proof = await submissionProof(target);
  const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
  headers.set('x-dos-proof', proof.token); headers.set('x-dos-work', proof.work);
  const response = await fetch(input, { ...init, headers });
  if (!response.ok) {
    const result = await response.clone().json().catch(() => null);
    throw new Error(result?.error || 'Your submission could not be sent. Please try again.');
  }
  return response;
};
declare global { interface Window { dosSubmissionFetch: typeof fetch } }
export function initSubmissionProtection() {
  window.dosSubmissionFetch = submissionFetch;
  for (const form of document.querySelectorAll<HTMLFormElement>('form')) {
    if (form.method.toLowerCase() !== 'post' && !form.classList.contains('submission-form')) continue;
    if (!form.querySelector('[name="_gotcha"], [name="_dos_honey"]')) {
      const trap = document.createElement('input');
      trap.name = '_dos_honey'; trap.tabIndex = -1; trap.autocomplete = 'off'; trap.setAttribute('aria-hidden', 'true');
      trap.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;';
      form.append(trap);
    }
  }
  // Existing form handlers run first. Only forms using ordinary browser POST need this fallback.
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (event.defaultPrevented || !(form instanceof HTMLFormElement) || form.method.toLowerCase() !== 'post') return;
    const target = submissionTarget(new URL(form.action));
    if (!target) return;
    event.preventDefault();
    if (form.dataset.verifying) return;
    form.dataset.verifying = 'true'; form.setAttribute('aria-busy', 'true');
    let status = form.querySelector<HTMLElement>('[data-verification-status]');
    if (!status) { status = document.createElement('p'); status.dataset.verificationStatus = ''; status.setAttribute('role', 'status'); form.append(status); }
    status.textContent = 'Verifying your submission…';
    try {
      const response = await submissionFetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const result = await response.json();
      const destination = new URL(result.redirect || '/submissions/received', location.origin);
      if (destination.origin !== location.origin) throw new Error('Invalid confirmation address.');
      location.assign(destination.href);
    } catch (error) { status.textContent = error instanceof Error ? error.message : 'Please try again.'; }
    finally { delete form.dataset.verifying; form.removeAttribute('aria-busy'); }
  });
}
