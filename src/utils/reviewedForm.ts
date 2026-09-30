import { fieldLabel, focusField, focusMessage, formFields, initFormErrors } from './formErrors';

interface Confirmation {
  title: string;
  message: string;
  href: string;
  linkText: string;
}

export function initReviewedForm(form: HTMLFormElement, confirmation: Confirmation) {
  const document = form.ownerDocument;
  const errors = initFormErrors(form);
  const fields = document.createElement('div');
  fields.className = 'form-entry-fields';
  [...form.childNodes].filter(node => node !== errors.summary).forEach(node => fields.append(node));
  form.append(fields);
  const submit = fields.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submitLabel = submit.querySelector('#submitText') || submit;
  submitLabel.textContent = 'Check your answers';
  const review = document.createElement('section');
  review.className = 'form-review';
  review.hidden = true;
  const heading = document.createElement('h2');
  heading.textContent = 'Check your answers';
  heading.tabIndex = -1;
  const intro = document.createElement('p');
  intro.textContent = 'Your information has not been submitted yet. Check your answers, then confirm and submit.';
  const list = document.createElement('dl');
  list.className = 'answer-summary';
  const actions = document.createElement('div');
  actions.className = 'form-actions';
  const confirm = document.createElement('button');
  confirm.type = 'submit';
  confirm.textContent = 'Confirm and submit';
  const back = document.createElement('button');
  back.type = 'button';
  back.textContent = 'Back to form';
  back.className = 'form-change';
  actions.append(confirm, back);
  review.append(heading, intro, list, actions);
  const status = document.createElement('div');
  status.tabIndex = -1;
  status.hidden = true;
  form.append(status, review);
  let reviewing = false;
  let pending = false;
  let sent = false;

  function edit(field?: ReturnType<typeof formFields>[number]) {
    if (pending || sent) return;
    reviewing = false;
    review.hidden = true;
    fields.hidden = false;
    status.hidden = true;
    if (field) focusField(field);
    else submit.focus();
  }
  back.addEventListener('click', () => edit());

  function showReview() {
    list.replaceChildren();
    const inputs = formFields(form);
    const seen = new Set<string>();
    inputs.forEach(field => {
      if (!field.name || field.closest('[hidden]')) return;
      const grouped = ['radio', 'checkbox'].includes(field.type) && inputs.filter(item => item.name === field.name).length > 1;
      if (grouped && seen.has(field.name)) return;
      seen.add(field.name);
      const row = document.createElement('div');
      const label = document.createElement('dt');
      label.textContent = grouped ? field.closest('fieldset')?.querySelector('legend')?.textContent || fieldLabel(field) : fieldLabel(field);
      const value = document.createElement('dd');
      if (grouped) value.textContent = inputs.filter(item => item.name === field.name && (item as HTMLInputElement).checked).map(fieldLabel).join(', ') || 'Not provided';
      else if (field.type === 'checkbox') value.textContent = (field as HTMLInputElement).checked ? 'Confirmed' : 'Not selected';
      else if (field.type === 'file') value.textContent = [...((field as HTMLInputElement).files || [])].map(file => file.name).join(', ') || 'Not provided';
      else if (field.tagName === 'SELECT') value.textContent = field.value ? [...(field as HTMLSelectElement).selectedOptions].map(option => option.textContent).join(', ') : 'Not provided';
      else if (field.type === 'date' && field.value) value.textContent = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${field.value}T00:00:00Z`));
      else value.textContent = field.value.trim() || 'Not provided';
      const changeCell = document.createElement('dd');
      const change = document.createElement('button');
      change.type = 'button';
      change.className = 'form-change';
      change.textContent = 'Change';
      change.setAttribute('aria-label', `Change ${label.textContent}`);
      change.addEventListener('click', () => edit(field));
      changeCell.append(change);
      row.append(label, value, changeCell);
      list.append(row);
    });
    fields.hidden = true;
    review.hidden = false;
    status.hidden = true;
    reviewing = true;
    focusMessage(heading);
  }

  form.addEventListener('submit', event => {
    if (pending || sent) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    if (!reviewing) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showReview();
      return;
    }
    pending = true;
    form.setAttribute('aria-busy', 'true');
    review.querySelectorAll('button').forEach(button => { button.disabled = true; });
    confirm.textContent = 'Submitting…';
    status.hidden = true;
  }, true);

  return {
    fail(message: string) {
      pending = false;
      form.removeAttribute('aria-busy');
      review.querySelectorAll('button').forEach(button => { button.disabled = false; });
      confirm.textContent = 'Confirm and submit';
      status.className = 'form-error-summary';
      status.textContent = message;
      status.hidden = false;
      focusMessage(status);
    },
    succeed() {
      sent = true;
      pending = false;
      form.removeAttribute('aria-busy');
      review.hidden = true;
      fields.hidden = true;
      status.className = 'form-confirmation';
      const title = document.createElement('h2');
      title.textContent = confirmation.title;
      const message = document.createElement('p');
      message.textContent = confirmation.message;
      const link = document.createElement('a');
      link.href = confirmation.href;
      link.textContent = confirmation.linkText;
      const support = document.createElement('a');
      support.href = '/help-desk';
      support.textContent = 'Contact the help desk about your submission';
      status.replaceChildren(title, message, link, support);
      status.hidden = false;
      document.title = `${confirmation.title} | Dzaleka Online Services`;
      focusMessage(status);
    },
  };
}
