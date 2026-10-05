import { expect, it } from 'vitest';
import { waitUntil, withDeferredTasks } from '../src/lib/news/netlify-deferred.mjs';

it('finishes deferred CMS cache work, including nested tasks, before releasing a response', async () => {
  const events: string[] = [];
  const result = await withDeferredTasks(async () => {
    waitUntil(new Promise<void>(resolve => setTimeout(() => {
      events.push('refresh');
      waitUntil(Promise.resolve().then(() => { events.push('nested'); }));
      resolve();
    }, 10)));
    return 'response';
  });
  expect(result).toBe('response');
  expect(events).toEqual(['refresh', 'nested']);
});

it('keeps concurrent requests separate and drains on errors', async () => {
  let release: () => void = () => {};
  const blocked = withDeferredTasks(async () => { waitUntil(new Promise<void>(resolve => { release = resolve; })); return 'first'; });
  expect(await withDeferredTasks(async () => 'second')).toBe('second');
  release();
  expect(await blocked).toBe('first');
  let settled = false;
  await expect(withDeferredTasks(async () => {
    waitUntil(Promise.resolve().then(() => { settled = true; }));
    throw new Error('failed request');
  })).rejects.toThrow('failed request');
  expect(settled).toBe(true);
});
