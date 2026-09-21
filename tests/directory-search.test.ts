import { describe, it, expect } from 'vitest';
import { parseHTML } from 'linkedom';
import { initDirectorySearch } from '../src/utils/directorySearch';

function setup() {
  const { document, Event } = parseHTML('<section data-directory-noun="artists"><form data-directory-form hidden><input type="search"><button data-directory-clear type="button">Clear</button></form><p data-directory-count></p><div data-search-item="François Fine Art"></div><div data-search-item="Miriam Digital Art"></div><p data-directory-empty hidden></p></section>');
  const root = document.querySelector('section') as HTMLElement;
  const input = root.querySelector('input') as HTMLInputElement;
  initDirectorySearch(root);
  return { root, input, Event, query: (value: string) => { input.value = value; input.dispatchEvent(new Event('input')); } };
}

describe('artist directory search', () => {
  it('matches names without accents and all words across the name and practice', () => {
    const { root, query } = setup();
    query('  francois ART  ');
    expect(root.querySelector('[data-directory-count]')?.textContent).toBe('1 of 2 artists');
    expect(root.querySelectorAll('[data-search-item]:not([hidden])')).toHaveLength(1);
    expect(root.querySelector('[data-search-item]:not([hidden])')?.getAttribute('data-search-item')).toContain('François');
  });
  it('shows an empty result and restores all entries when cleared', () => {
    const { root, query, input } = setup();
    query('no-such-person');
    expect(root.querySelector('[data-directory-empty]')?.hasAttribute('hidden')).toBe(false);
    root.querySelector<HTMLButtonElement>('[data-directory-clear]')!.click();
    expect(input.value).toBe('');
    expect(root.querySelectorAll('[data-search-item]:not([hidden])')).toHaveLength(2);
    expect(root.querySelector('[data-directory-empty]')?.hasAttribute('hidden')).toBe(true);
  });
  it('keeps form submission on the directory and tolerates repeated initialization', () => {
    const { root, input, Event } = setup();
    initDirectorySearch(root);
    input.value = 'digital';
    const event = new Event('submit', { cancelable: true });
    root.querySelector('form')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(root.querySelector('[data-directory-count]')?.textContent).toBe('1 of 2 artists');
    expect(root.querySelector('form')?.hidden).toBe(false);
  });
});
