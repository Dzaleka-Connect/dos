export function initRecordGallery(root: HTMLElement) {
  if (root.dataset.galleryReady) return;
  const image = root.querySelector<HTMLImageElement>('[data-gallery-image]');
  const openLink = root.querySelector<HTMLAnchorElement>('[data-gallery-open]');
  const originalLink = root.querySelector<HTMLAnchorElement>('[data-gallery-original]');
  const thumbnails = [...root.querySelectorAll<HTMLAnchorElement>('[data-gallery-thumbnail]')];
  const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  const fullImage = root.querySelector<HTMLImageElement>('[data-gallery-full]');
  if (!image || !openLink || !originalLink || !dialog || !fullImage) return;
  root.dataset.galleryReady = 'true';
  const sources = thumbnails.length ? thumbnails.map(link => link.getAttribute('href')!) : [openLink.getAttribute('href')!];
  const label = image.alt;
  let current = 0;
  let trigger: HTMLElement | null = null;
  const error = root.querySelector<HTMLElement>('[data-gallery-error]');
  const fullError = root.querySelector<HTMLElement>('[data-gallery-full-error]');
  const select = (index: number) => {
    current = (index + sources.length) % sources.length;
    const src = sources[current];
    image.src = src; image.alt = sources.length > 1 ? `${label} — image ${current + 1}` : label;
    openLink.href = src; originalLink.href = src;
    if (dialog.open) { fullImage.src = src; fullImage.alt = image.alt; }
    if (error) error.hidden = true;
    if (fullError) fullError.hidden = true;
    thumbnails.forEach((link, index) => index === current ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current'));
    root.querySelectorAll('[data-gallery-counter], [data-gallery-dialog-counter]').forEach(counter => { counter.textContent = `Image ${current + 1} of ${sources.length}`; });
  };
  root.querySelectorAll<HTMLElement>('[data-gallery-controls]').forEach(controls => { controls.hidden = false; });
  root.querySelectorAll('[data-gallery-previous]').forEach(button => button.addEventListener('click', () => select(current - 1)));
  root.querySelectorAll('[data-gallery-next]').forEach(button => button.addEventListener('click', () => select(current + 1)));
  thumbnails.forEach((link, index) => link.addEventListener('click', event => {
    if ((event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey || (event as MouseEvent).shiftKey || (event as MouseEvent).altKey) return;
    event.preventDefault(); select(index);
  }));
  image.addEventListener('error', () => { if (error) error.hidden = false; });
  image.addEventListener('load', () => { if (error) error.hidden = true; });
  fullImage.addEventListener('error', () => { if (fullError) fullError.hidden = false; });
  fullImage.addEventListener('load', () => { if (fullError) fullError.hidden = true; });
  if (image.complete && image.naturalWidth === 0 && error) error.hidden = false;
  openLink.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function' || (event as MouseEvent).metaKey || (event as MouseEvent).ctrlKey || (event as MouseEvent).shiftKey || (event as MouseEvent).altKey) return;
    event.preventDefault(); trigger = openLink; fullImage.src = sources[current]; fullImage.alt = image.alt;
    root.querySelector('[data-gallery-dialog-counter]')!.textContent = `Image ${current + 1} of ${sources.length}`;
    dialog.showModal();
  });
  root.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger?.focus());
  root.addEventListener('keydown', event => {
    if (sources.length < 2 || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault(); select(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
}
