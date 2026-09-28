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

describe('course directory filters', () => {
  it('combines topic, subject and level and clears all three together', () => {
    const { document, Event } = parseHTML('<section data-directory-noun="courses"><form data-directory-form hidden><input type="search"><select data-directory-filter="category"><option value="">All</option><option value="business">Business</option></select><select data-directory-filter="level"><option value="">All</option><option value="beginner">Beginner</option></select><button data-directory-clear type="button">Clear</button></form><p data-directory-count></p><li data-search-item="Business planning" data-category="business" data-level="beginner"></li><li data-search-item="Business pitching" data-category="business" data-level="intermediate"></li><li data-search-item="Web development" data-category="technology" data-level="beginner"></li><p data-directory-empty hidden></p></section>');
    const root = document.querySelector<HTMLElement>('section')!;
    const input = root.querySelector('input')!;
    const filters = [...root.querySelectorAll('select')];
    // linkedom exposes select.value as read-only; model native selection changes.
    filters.forEach(filter => Object.defineProperty(filter, 'value', { value: '', writable: true }));
    initDirectorySearch(root);
    input.value = 'business';
    input.dispatchEvent(new Event('input'));
    filters[0].value = 'business';
    filters[1].value = 'beginner';
    filters[1].dispatchEvent(new Event('change'));
    expect(root.querySelector('[data-directory-count]')?.textContent).toBe('1 of 3 courses');
    expect(root.querySelector('[data-search-item]:not([hidden])')?.getAttribute('data-search-item')).toBe('Business planning');
    input.value = 'no match';
    input.dispatchEvent(new Event('input'));
    expect(root.querySelector('[data-directory-empty]')?.hasAttribute('hidden')).toBe(false);
    root.querySelector<HTMLButtonElement>('[data-directory-clear]')!.click();
    expect(filters.map(filter => filter.value)).toEqual(['', '']);
    expect(root.querySelector('[data-directory-count]')?.textContent).toBe('3 of 3 courses');
  });
});
