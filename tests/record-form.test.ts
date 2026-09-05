import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { prefillRecordForm } from '../src/utils/recordForm';

function setup() {
  const { document } = parseHTML('<form><select name="siteName"><option value="">Choose</option><option value="Health centre">Health centre</option></select><input type="text" name="location" /><input type="email" name="email" /><input type="text" name="description" value="My draft" /></form>');
  const form = document.querySelector('form') as HTMLFormElement;
  const select = form.querySelector('select')!;
  let value = '';
  // Linkedom exposes only the getter for select.value.
  Object.defineProperty(select, 'value', { get: () => value, set: next => { value = next; } });
  return { form, select };
}

describe('record correction form context', () => {
  it('selects a known record and preserves the more specific location from its link', () => {
    const { form, select } = setup();
    const onChange = vi.fn(() => { form.querySelector<HTMLInputElement>('[name="location"]')!.value = 'Central area'; });
    select.addEventListener('change', onChange);
    prefillRecordForm(form, new URLSearchParams({ siteName: 'Health centre', location: 'Main gate' }), ['siteName', 'location']);
    expect(select.value).toBe('Health centre');
    expect(onChange).toHaveBeenCalledOnce();
    expect(form.querySelector<HTMLInputElement>('[name="location"]')!.value).toBe('Main gate');
  });
  it('does not overwrite a draft or prefill unrelated personal fields', () => {
    const { form } = setup();
    prefillRecordForm(form, new URLSearchParams({ description: 'Replace draft', email: 'someone@example.org', location: '<script>text</script>' }), ['description', 'location']);
    expect(form.querySelector<HTMLInputElement>('[name="description"]')!.value).toBe('My draft');
    expect(form.querySelector<HTMLInputElement>('[name="email"]')!.value).toBe('');
    expect(form.querySelector<HTMLInputElement>('[name="location"]')!.value).toBe('<script>text</script>');
    expect(form.querySelector('script')).toBeNull();
  });
  it('ignores a record that is not offered in the site selector', () => {
    const { form, select } = setup();
    prefillRecordForm(form, new URLSearchParams({ siteName: 'Missing record' }), ['siteName']);
    expect(select.value).toBe('');
  });
});
