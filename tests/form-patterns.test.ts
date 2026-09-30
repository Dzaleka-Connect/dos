import { describe, expect, it, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initFormErrors } from '../src/utils/formErrors';
import { initReviewedForm } from '../src/utils/reviewedForm';
import { submissionConfirmation } from '../src/data/submissionConfirmations';

function setup() {
  const { document, window } = parseHTML(`<!doctype html><html><head><title>Register</title></head><body>
    <form id="registration">
      <label for="name">Organization name</label><input id="name" name="name" required aria-describedby="name-hint"><p id="name-hint">Public name</p>
      <details><summary>Optional details</summary><label for="website">Website (optional)</label><input type="url" id="website" name="website"></details>
      <fieldset><legend>Days available</legend><label for="monday">Monday</label><input id="monday" type="checkbox" name="days" value="Monday"><label for="friday">Friday</label><input id="friday" type="checkbox" name="days" value="Friday"></fieldset>
      <button type="submit">Send</button>
    </form></body></html>`);
  const form = document.querySelector<HTMLFormElement>('form')!;
  // Linkedom has no constraint-validation engine. Supply its browser boundary for these flow tests.
  form.querySelectorAll<HTMLInputElement>('input').forEach(field => {
    let custom = '';
    field.setCustomValidity = message => { custom = message; };
    Object.defineProperties(field, {
      willValidate: { get: () => !field.disabled },
      validity: { get: () => ({ valid: !custom && !(field.hasAttribute('required') && !field.value), valueMissing: field.hasAttribute('required') && !field.value, customError: Boolean(custom) }) },
      validationMessage: { get: () => custom },
    });
    field.focus = vi.fn();
  });
  const submit = () => form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  return { document, window, form, submit, name: form.querySelector<HTMLInputElement>('#name')!, website: form.querySelector<HTMLInputElement>('#website')! };
}

const confirmation = { title: 'Registration submitted for review', message: 'It has not been published.', href: '/services', linkText: 'Return to services' };

describe('accessible form errors', () => {
  it('blocks invalid submissions, links matching inline errors and preserves hints', () => {
    const ui = setup();
    initFormErrors(ui.form);
    const send = vi.fn();
    ui.form.addEventListener('submit', send);
    ui.submit();
    expect(send).not.toHaveBeenCalled();
    expect(ui.document.title).toBe('Error: Register');
    const link = ui.form.querySelector<HTMLAnchorElement>('.form-error-summary a')!;
    expect(link.getAttribute('href')).toBe('#name');
    expect(link.textContent).toBe(ui.document.getElementById('name-error')!.textContent);
    expect(ui.name.getAttribute('aria-describedby')).toBe('name-hint name-error');
    link.click();
    expect(ui.name.focus).toHaveBeenCalledOnce();
  });

  it('clears resolved errors without removing existing hint associations', async () => {
    const ui = setup();
    initFormErrors(ui.form);
    ui.submit();
    ui.name.value = 'Example organization';
    ui.name.dispatchEvent(new ui.window.Event('input', { bubbles: true }));
    await Promise.resolve();
    expect(ui.name.hasAttribute('aria-invalid')).toBe(false);
    expect(ui.name.getAttribute('aria-describedby')).toBe('name-hint');
    expect(ui.document.title).toBe('Register');
    expect(ui.form.querySelector<HTMLElement>('.form-error-summary')!.hidden).toBe(true);
  });

  it('opens collapsed guidance when an error link targets a field inside it', () => {
    const ui = setup();
    ui.name.value = 'Example';
    ui.website.setCustomValidity('Enter a full web address.');
    initFormErrors(ui.form);
    ui.submit();
    ui.form.querySelector<HTMLAnchorElement>('.form-error-summary a')!.click();
    expect(ui.website.closest('details')!.hasAttribute('open')).toBe(true);
    expect(ui.website.focus).toHaveBeenCalledOnce();
  });

  it('does not install duplicate summaries or submit listeners', () => {
    const ui = setup();
    expect(initFormErrors(ui.form)).toBe(initFormErrors(ui.form));
    ui.submit();
    expect(ui.form.querySelectorAll('.form-error-summary').length).toBe(1);
  });
});

describe('check answers before submission', () => {
  it('requires review, shows grouped answers and safely renders user text', () => {
    const ui = setup();
    ui.name.value = '<img src=x onerror=alert(1)>';
    ui.form.querySelector<HTMLInputElement>('#friday')!.checked = true;
    initReviewedForm(ui.form, confirmation);
    const send = vi.fn();
    ui.form.addEventListener('submit', send);
    ui.submit();
    expect(send).not.toHaveBeenCalled();
    const review = ui.form.querySelector<HTMLElement>('.form-review')!;
    expect(review.hidden).toBe(false);
    expect(review.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(review.querySelector('img')).toBeNull();
    expect(review.textContent).toContain('Not provided');
    expect(review.textContent).toContain('Friday');
    expect([...review.querySelectorAll('dt')].map(node => node.textContent)).toEqual(['Organization name', 'Website', 'Days available']);
    ui.submit();
    ui.submit();
    expect(send).toHaveBeenCalledOnce();
  });

  it('returns to a specific field without losing other answers, and reviews the changed answer', () => {
    const ui = setup();
    ui.name.value = 'Example organization';
    initReviewedForm(ui.form, confirmation);
    ui.submit();
    ui.form.querySelector<HTMLButtonElement>('[aria-label="Change Website"]')!.click();
    expect(ui.name.value).toBe('Example organization');
    expect(ui.website.closest('details')!.hasAttribute('open')).toBe(true);
    expect(ui.website.focus).toHaveBeenCalledOnce();
    ui.website.value = 'https://example.com';
    ui.submit();
    expect(ui.form.querySelector('.form-review')!.textContent).toContain('https://example.com');
  });

  it('preserves answers on server failure, permits retry, and prevents duplicate successful submissions', () => {
    const ui = setup();
    ui.name.value = 'Example organization';
    const flow = initReviewedForm(ui.form, confirmation);
    const send = vi.fn();
    ui.form.addEventListener('submit', send);
    ui.submit();
    ui.submit();
    flow.fail('Could not send. Try again.');
    expect(ui.form.textContent).toContain('Could not send. Try again.');
    expect(ui.name.value).toBe('Example organization');
    expect(ui.form.querySelector<HTMLButtonElement>('.form-review button[type="submit"]')!.disabled).toBe(false);
    ui.submit();
    flow.succeed();
    ui.submit();
    expect(send).toHaveBeenCalledTimes(2);
    expect(ui.form.querySelector<HTMLElement>('.form-review')!.hidden).toBe(true);
    expect(ui.form.querySelector('.form-confirmation')!.textContent).toContain('It has not been published.');
  });
});

describe('submission confirmation routing', () => {
  it('supports profile updates, visit handoff and unknown query values', () => {
    expect(submissionConfirmation('profile-update').message).toContain('not changed yet');
    expect(submissionConfirmation('visit').cta.href).toBe('https://visit.dzaleka.com');
    expect(submissionConfirmation('__proto__')).toBe(submissionConfirmation(null));
    expect(submissionConfirmation('unknown')).toBe(submissionConfirmation(null));
  });
});
