/** Only prefill record-identification fields; never overwrite an existing draft. */
export function prefillRecordForm(form: HTMLFormElement, params: URLSearchParams, names: string[]) {
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')]
    .filter(field => names.includes(field.name) && !field.value && (field.tagName === 'SELECT' || field.type === 'text'));
  for (const name of names) {
    const field = fields.find(field => field.name === name);
    const value = params.get(name)?.trim().slice(0, 500);
    if (!field || !value) continue;
    if (field.tagName === 'SELECT' && ![...(field as HTMLSelectElement).options].some(option => option.value === value)) continue;
    field.value = value;
    const EventType = form.ownerDocument.defaultView!.Event;
    field.dispatchEvent(new EventType('change', { bubbles: true }));
  }
}
