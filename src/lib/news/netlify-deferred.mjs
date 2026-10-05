import { AsyncLocalStorage } from 'node:async_hooks';

const requests = new AsyncLocalStorage();

// EmDash's Node adapter assumes a persistent process. Netlify can freeze it as
// soon as the response finishes, so retain deferred work for this request.
export function waitUntil(promise) {
  const tasks = requests.getStore();
  if (tasks) tasks.add(promise);
}

export function withDeferredTasks(run) {
  return requests.run(new Set(), async () => {
    try { return await run(); }
    finally {
      const tasks = requests.getStore();
      while (tasks.size) {
        const batch = [...tasks];
        tasks.clear();
        await Promise.allSettled(batch);
      }
    }
  });
}
