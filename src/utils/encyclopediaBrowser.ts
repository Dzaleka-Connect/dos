/** Progressive enhancement: all entries remain readable without JavaScript. */
export function initEncyclopediaBrowser(doc: Document, win: Window) {
  const search = doc.querySelector<HTMLInputElement>('#encyclopedia-search');
  const category = doc.querySelector<HTMLSelectElement>('#encyclopedia-category');
  const type = doc.querySelector<HTMLSelectElement>('#encyclopedia-type');
  const letter = doc.querySelector<HTMLSelectElement>('#encyclopedia-letter');
  if (!search || !category || !type || !letter) return;
  const entries = Array.from(doc.querySelectorAll<HTMLElement>('.encyclopedia-entry'));
  const previous = doc.querySelector<HTMLButtonElement>('#pagination-prev');
  const next = doc.querySelector<HTMLButtonElement>('#pagination-next');
  const pageSize = 12;
  const params = new URLSearchParams(win.location.search);
  search.value = params.get('q') || '';
  for (const [key, select] of [['category', category], ['type', type], ['letter', letter]] as const) {
    const value = params.get(key);
    if (value && Array.from(select.options).some((option) => option.value === value)) select.value = value;
  }
  let page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const setVisible = (id: string, visible: boolean) => {
    const element = doc.getElementById(id);
    if (element) { element.hidden = !visible; element.classList.toggle('hidden', !visible); }
  };
  const update = () => {
    const query = search.value.trim().toLowerCase();
    const matches = entries.filter((entry) => (!query || entry.dataset.search?.includes(query))
      && (category.value === 'all' || entry.dataset.category === category.value)
      && (type.value === 'all' || entry.dataset.type === type.value)
      && (letter.value === 'all' || entry.dataset.letter === letter.value));
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, pages);
    const start = (page - 1) * pageSize;
    const visible = new Set(matches.slice(start, start + pageSize));
    for (const entry of entries) { entry.hidden = !visible.has(entry); entry.classList.toggle('hidden', entry.hidden); }
    const count = doc.getElementById('result-count');
    if (count) count.textContent = `${matches.length} ${matches.length === 1 ? 'entry' : 'entries'}${matches.length ? ` · Showing ${start + 1}–${Math.min(start + pageSize, matches.length)}` : ''}`;
    setVisible('no-results', !matches.length);
    setVisible('pagination', pages > 1);
    doc.getElementById('pagination')?.classList.toggle('flex', pages > 1);
    const status = doc.getElementById('page-status');
    if (status) status.textContent = `Page ${page} of ${pages}`;
    if (previous) previous.disabled = page === 1;
    if (next) next.disabled = page === pages;
    const url = new URL(win.location.href);
    for (const [key, value] of [['q', search.value.trim()], ['category', category.value], ['type', type.value], ['letter', letter.value], ['page', page > 1 ? String(page) : '']]) {
      if (value && value !== 'all') url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    win.history.replaceState(null, '', url);
  };
  const filter = () => { page = 1; update(); };
  search.addEventListener('input', filter);
  [category, type, letter].forEach((select) => select.addEventListener('change', filter));
  doc.getElementById('encyclopedia-search-form')?.addEventListener('submit', (event) => { event.preventDefault(); filter(); doc.getElementById('entries-heading')?.focus(); });
  doc.getElementById('clear-filters')?.addEventListener('click', () => { search.value = ''; category.value = type.value = letter.value = 'all'; filter(); search.focus(); });
  const navigate = (offset: number) => { page += offset; update(); doc.getElementById('entries-heading')?.focus(); doc.getElementById('all-entries')?.scrollIntoView({ block: 'start' }); };
  previous?.addEventListener('click', () => navigate(-1));
  next?.addEventListener('click', () => navigate(1));
  update();
}
