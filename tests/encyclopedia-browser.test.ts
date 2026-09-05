import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initEncyclopediaBrowser } from '../src/utils/encyclopediaBrowser';

function setup(query = '') {
  const records = Array.from({ length: 27 }, (_, i) => `<article class="encyclopedia-entry" data-search="${i === 0 ? 'rémy technology school' : `history record ${i}`}" data-category="${i < 4 ? 'people' : 'history'}" data-type="${i < 4 ? 'person' : 'topic'}" data-letter="${i === 0 ? 'R' : 'H'}"></article>`).join('');
  const { document, window } = parseHTML(`<section id="all-entries"><h2 id="entries-heading" tabindex="-1">Entries</h2><form id="encyclopedia-search-form"><input id="encyclopedia-search" /></form><select id="encyclopedia-category"><option value="all" selected>All</option><option value="people">People</option><option value="history">History</option></select><select id="encyclopedia-type"><option value="all" selected>All</option><option value="person">Person</option><option value="topic">Topic</option></select><select id="encyclopedia-letter"><option value="all" selected>All</option><option value="R">R</option><option value="H">H</option></select><p id="result-count"></p><button id="clear-filters">Clear</button>${records}<div id="no-results" hidden></div><nav id="pagination" hidden><p id="page-status"></p><button id="pagination-prev">Previous</button><button id="pagination-next">Next</button></nav></section>`);
  // Linkedom lacks the browser's select.value setter and scrolling layout.
  document.querySelectorAll('select').forEach((select) => {
    let value = 'all';
    Object.defineProperty(select, 'value', { get: () => value, set: (next) => { value = next; } });
  });
  document.getElementById('all-entries')!.scrollIntoView = vi.fn();
  const history = { replaceState: vi.fn() };
  const location = { search: query, href: `https://example.test/encyclopedia${query}` };
  initEncyclopediaBrowser(document as unknown as Document, { location, history } as unknown as Window);
  const visible = () => [...document.querySelectorAll('.encyclopedia-entry')].filter((entry) => !entry.hasAttribute('hidden'));
  const change = (id: string, value: string, event = 'change') => { const input = document.getElementById(id) as HTMLInputElement; input.value = value; input.dispatchEvent(new window.Event(event)); };
  return { document, history, visible, change };
}

describe('encyclopedia browsing', () => {
  it('paginates the full collection and returns to the first page after filtering', () => {
    const { document, visible, change } = setup();
    expect(visible()).toHaveLength(12);
    document.getElementById('pagination-next')!.click();
    expect(document.getElementById('page-status')!.textContent).toBe('Page 2 of 3');
    change('encyclopedia-category', 'people');
    expect(visible()).toHaveLength(4);
    expect(document.getElementById('pagination')!.hasAttribute('hidden')).toBe(true);
  });
  it('combines search, type and initial filters and clears an empty result', () => {
    const { document, visible, change } = setup();
    change('encyclopedia-search', '  RÉMY  ', 'input');
    change('encyclopedia-type', 'person');
    change('encyclopedia-letter', 'R');
    expect(visible()).toHaveLength(1);
    change('encyclopedia-category', 'history');
    expect(visible()).toHaveLength(0);
    expect(document.getElementById('no-results')!.hasAttribute('hidden')).toBe(false);
    document.getElementById('clear-filters')!.click();
    expect(visible()).toHaveLength(12);
    expect(document.getElementById('result-count')!.textContent).toContain('27 entries');
  });
  it('restores shared filters, rejects unavailable options and clamps stale pages', () => {
    const { visible, document, history } = setup('?category=people&type=invalid&page=99');
    expect(visible()).toHaveLength(4);
    expect(document.getElementById('page-status')!.textContent).toBe('Page 1 of 1');
    const url = history.replaceState.mock.calls.at(-1)![2] as URL;
    expect(url.searchParams.get('category')).toBe('people');
    expect(url.searchParams.has('type')).toBe(false);
    expect(url.searchParams.has('page')).toBe(false);
  });
});
