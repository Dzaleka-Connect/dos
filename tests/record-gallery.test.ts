import { describe, it, expect, vi } from 'vitest';
import { parseHTML } from 'linkedom';
import { initRecordGallery } from '../src/utils/recordGallery';

function setup() {
  const { document, window } = parseHTML(`<div data-record-gallery>
    <a data-gallery-open href="/one.jpg"><img data-gallery-image src="/one.jpg" alt="Dzaleka" /></a>
    <a data-gallery-original href="/one.jpg">Original</a><p data-gallery-error hidden></p>
    <p data-gallery-counter>Image 1 of 3</p>
    <div data-gallery-controls hidden><button data-gallery-previous>Previous</button><button data-gallery-next>Next</button></div>
    <a data-gallery-thumbnail href="/one.jpg" aria-current="true">One</a><a data-gallery-thumbnail href="/two.jpg">Two</a><a data-gallery-thumbnail href="/three.jpg">Three</a>
    <dialog data-gallery-dialog><img data-gallery-full alt="Dzaleka" /><p data-gallery-full-error hidden></p><p data-gallery-dialog-counter></p><button data-gallery-close>Close</button></dialog>
  </div>`);
  const root = document.querySelector<HTMLElement>('[data-record-gallery]')!;
  const dialog = root.querySelector<HTMLDialogElement>('dialog')!;
  dialog.showModal = vi.fn(() => { dialog.open = true; });
  dialog.close = vi.fn(() => { dialog.open = false; dialog.dispatchEvent(new window.Event('close')); });
  root.querySelector<HTMLElement>('[data-gallery-open]')!.focus = vi.fn();
  initRecordGallery(root);
  const click = (selector: string) => root.querySelector<HTMLElement>(selector)!.click();
  const source = () => root.querySelector('img')!.getAttribute('src');
  return { root, window, dialog, click, source };
}

describe('record gallery navigation', () => {
  it('moves through an album, updates the original link and wraps at either end', () => {
    const { root, click, source } = setup();
    click('[data-gallery-previous]');
    expect(source()).toBe('/three.jpg');
    expect(root.querySelector('[data-gallery-original]')!.getAttribute('href')).toBe('/three.jpg');
    expect(root.querySelector('[aria-current]')!.textContent).toBe('Three');
    click('[data-gallery-next]');
    expect(source()).toBe('/one.jpg');
    click('[href="/two.jpg"]');
    expect(source()).toBe('/two.jpg');
    expect(root.querySelector('[data-gallery-counter]')!.textContent).toBe('Image 2 of 3');
  });
  it('opens the selected image and returns focus when the viewer closes', () => {
    const { root, click, dialog } = setup();
    click('[data-gallery-next]'); click('[data-gallery-open]');
    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(root.querySelector('[data-gallery-full]')!.getAttribute('src')).toBe('/two.jpg');
    click('[data-gallery-next]');
    expect(root.querySelector('[data-gallery-full]')!.getAttribute('src')).toBe('/three.jpg');
    click('[data-gallery-close]');
    expect(root.querySelector<HTMLElement>('[data-gallery-open]')!.focus).toHaveBeenCalledOnce();
  });
  it('keeps multiple galleries independent and avoids duplicate click handlers', () => {
    const first = setup(), second = setup();
    initRecordGallery(first.root);
    first.click('[data-gallery-next]');
    expect(first.source()).toBe('/two.jpg');
    expect(second.source()).toBe('/one.jpg');
  });
  it('announces a failed image and clears the message after a successful load', () => {
    const { root, window } = setup();
    const image = root.querySelector('img')!;
    image.dispatchEvent(new window.Event('error'));
    expect(root.querySelector('[data-gallery-error]')!.hasAttribute('hidden')).toBe(false);
    image.dispatchEvent(new window.Event('load'));
    expect(root.querySelector('[data-gallery-error]')!.hasAttribute('hidden')).toBe(true);
  });
});
