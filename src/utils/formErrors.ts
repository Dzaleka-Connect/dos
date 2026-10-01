type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function formFields(form: HTMLFormElement): Field[] {
  return [...form.querySelectorAll<Field>('input, select, textarea')]
    .filter(field => !field.disabled && !['hidden', 'submit', 'button', 'reset'].includes(field.type));
}

export function fieldLabel(field: Field): string {
  // A radio button's own label is one answer; the question is the fieldset legend.
  const legend = field.type === 'radio' ? field.closest('fieldset')?.querySelector('legend') : null;
  if (legend?.textContent) return legend.textContent.replace(/\s+/g, ' ').replace(/\s*\(optional\)/g, '').trim();
  const label = field.labels?.[0] || field.closest('label') || [...field.ownerDocument.querySelectorAll('label')]
    .find(label => label.getAttribute('for') === field.id);
  return (label?.textContent || field.getAttribute('aria-label') || field.name)
    .replace(/\s+/g, ' ').replace(/\s*\(optional\)/g, '').trim();
}

export function focusField(field: Field) {
  let parent = field.parentElement;
  while (parent) {
    if (parent.tagName === 'DETAILS') parent.setAttribute('open', '');
    parent = parent.parentElement;
  }
  field.focus({ preventScroll: true });
  field.scrollIntoView?.({ block: 'center', behavior: 'instant' });
}

export function focusMessage(element: HTMLElement) {
  element.focus({ preventScroll: true });
  element.scrollIntoView?.({ block: 'start', behavior: 'instant' });
}

export function fieldError(field: Field): string {
  const { validity } = field;
  const label = fieldLabel(field);
  if (validity.customError) return field.validationMessage;
  if (validity.valueMissing) {
    if (field.dataset.errorRequired) return field.dataset.errorRequired;
    if (field.type === 'checkbox') return `Select “${label}”.`;
    if (field.type === 'radio' || field.tagName === 'SELECT') return `Select an answer for ${label}.`;
    if (field.type === 'file') return `Choose a file for “${label}”.`;
    return `Enter an answer for “${label}”.`;
  }
  if (validity.typeMismatch && field.type === 'email') return `Enter a valid email address for ${label}, for example name@example.com.`;
  if (validity.typeMismatch && field.type === 'url') return `Enter a full web address for ${label}, starting with https://.`;
  return `${label}: ${field.validationMessage}`;
}

const instances = new WeakMap<HTMLFormElement, ReturnType<typeof createErrors>>();

function createErrors(form: HTMLFormElement) {
  const document = form.ownerDocument;
  const prefix = form.id || `submission-${[...document.querySelectorAll('form')].indexOf(form)}`;
  const summary = document.createElement('div');
  summary.className = 'form-error-summary';
  summary.tabIndex = -1;
  summary.hidden = true;
  summary.setAttribute('role', 'region');
  const heading = document.createElement('h2');
  heading.id = `${prefix}-errors-title`;
  heading.textContent = 'There is a problem';
  summary.setAttribute('aria-labelledby', heading.id);
  const list = document.createElement('ul');
  summary.append(heading, list);
  form.prepend(summary);
  const errors = new Map<Field, { message: HTMLElement; item: HTMLElement; previousInvalid: string | null }>();
  const originalTitle = document.title;

  function clear(field: Field) {
    const error = errors.get(field);
    if (!error) return;
    const hints = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== error.message.id);
    if (hints.length) field.setAttribute('aria-describedby', hints.join(' '));
    else field.removeAttribute('aria-describedby');
    if (error.previousInvalid === null) field.removeAttribute('aria-invalid');
    else field.setAttribute('aria-invalid', error.previousInvalid);
    error.message.remove();
    error.item.remove();
    errors.delete(field);
    if (!errors.size) {
      summary.hidden = true;
      if (document.title === `Error: ${originalTitle}`) document.title = originalTitle;
    }
  }

  function validate() {
    [...errors.keys()].forEach(clear);
    const radioGroups = new Set<string>();
    formFields(form).forEach((field, index) => {
      if (!field.willValidate || field.validity.valid) return;
      if (field.type === 'radio' && radioGroups.has(field.name)) return;
      if (field.type === 'radio') radioGroups.add(field.name);
      if (!field.id) field.id = `${prefix}-field-${index}`;
      const message = document.createElement('p');
      message.id = `${field.id}-error`;
      message.className = 'form-field-error';
      message.textContent = fieldError(field);
      const previousInvalid = field.getAttribute('aria-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), message.id].filter(Boolean).join(' '));
      const label = field.closest('label');
      (label || field).insertAdjacentElement('afterend', message);
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${field.id}`;
      link.textContent = message.textContent;
      link.addEventListener('click', event => { event.preventDefault(); focusField(field); });
      item.append(link);
      list.append(item);
      errors.set(field, { message, item, previousInvalid });
    });
    summary.hidden = !errors.size;
    if (errors.size) {
      document.title = `Error: ${originalTitle}`;
      focusMessage(summary);
    }
    return errors.size === 0;
  }

  form.noValidate = true;
  form.addEventListener('submit', event => {
    if (!validate()) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  const clearResolved = () => queueMicrotask(() => {
    errors.forEach((_, field) => { if (field.validity.valid || field.disabled) clear(field); });
  });
  form.addEventListener('input', clearResolved);
  form.addEventListener('change', clearResolved);
  form.addEventListener('reset', () => [...errors.keys()].forEach(clear));
  return { validate, summary };
}

export function initFormErrors(form: HTMLFormElement) {
  let instance = instances.get(form);
  if (!instance) { instance = createErrors(form); instances.set(form, instance); }
  return instance;
}
