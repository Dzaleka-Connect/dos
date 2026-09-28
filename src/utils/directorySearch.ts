const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase().trim();

export function initDirectorySearch(root: HTMLElement) {
  if (root.dataset.searchReady) return;
  const form = root.querySelector<HTMLFormElement>('[data-directory-form]');
  const input = root.querySelector<HTMLInputElement>('input[type="search"]');
  const count = root.querySelector<HTMLElement>('[data-directory-count]');
  const empty = root.querySelector<HTMLElement>('[data-directory-empty]');
  const items = [...root.querySelectorAll<HTMLElement>('[data-search-item]')];
  const filters = [...root.querySelectorAll<HTMLSelectElement>('[data-directory-filter]')];
  if (!form || !input || !count || !empty) return;
  root.dataset.searchReady = 'true';
  const update = () => {
    const words = normalize(input.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    items.forEach(item => {
      const matchesWords = words.every(word => normalize(item.dataset.searchItem || '').includes(word));
      const matchesFilters = filters.every(filter => !filter.value || item.getAttribute(`data-${filter.dataset.directoryFilter}`) === filter.value);
      item.hidden = !matchesWords || !matchesFilters;
      if (!item.hidden) visible++;
    });
    count.textContent = `${visible} of ${items.length} ${root.dataset.directoryNoun || 'records'}`;
    empty.hidden = visible !== 0;
  };
  form.hidden = false;
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
  input.addEventListener('input', update);
  filters.forEach(filter => filter.addEventListener('change', update));
  root.querySelector('[data-directory-clear]')?.addEventListener('click', () => { input.value = ''; filters.forEach(filter => filter.value = ''); update(); input.focus(); });
}
