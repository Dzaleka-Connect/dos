import { dev } from 'astro';

const server = await dev({
  configFile: './astro.emdash.config.mjs',
  server: { host: 'localhost', port: 4322 },
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, async () => { await server.stop(); process.exit(0); });
}
