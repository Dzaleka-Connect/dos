import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const serverSamples = {
  '/resources/[...page]': '/resources',
  '/events/[...slug]': '/events/refugees-media-narratives-zoom-session',
  '/events/organizer/[organizer]': '/events/organizer/inua-advocacy',
  '/events/past/[page]': '/events/past/1',
  '/events/upcoming/[page]': '/events/upcoming/1',
  '/grants-and-programs/[slug]': '/grants-and-programs/papita-khasu-virtual-artist-residency',
};
const templates = walk('src/pages').filter(file => file.endsWith('.astro')).map(file => {
  const source = fs.readFileSync(file, 'utf8');
  const route = file.replace('src/pages', '').replace(/\.astro$/, '').replace(/\/index$/, '') || '/';
  const parts = route.split('/').filter(Boolean);
  const pattern = parts.map(part => {
    if (/^\[\.\.\..+\]$/.test(part)) return part.includes('page') ? '(?:/\\d+)?' : '(?:/.+)?';
    if (/^\[(page|year)\]$/.test(part)) return '/\\d+';
    if (/^\[.+\]$/.test(part)) return '/[^/]+';
    return '/' + escape(part);
  }).join('');
  return { file, route, regex: new RegExp('^' + pattern + '/?$'), score: parts.reduce((sum, part) => sum + (part.startsWith('[...') ? (part.includes('page') ? 20 : 1) : /^\[(page|year)\]$/.test(part) ? 20 : part.startsWith('[') ? 10 : 100), 0), redirect: source.length < 600 && source.includes('Astro.redirect('), pages: [], issues: [] };
}).sort((a, b) => b.score - a.score);

for (const file of walk('dist/client').filter(file => file.endsWith('.html'))) {
  if (fs.existsSync(file.replace('dist/client', 'public'))) continue;
  const route = file.replace('dist/client', '').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  const template = templates.find(item => item.regex.test(route));
  if (!template) continue;
  const { document } = parseHTML(fs.readFileSync(file, 'utf8'));
  if (document.querySelector('meta[http-equiv="refresh"]')) continue;
  template.pages.push(route);
  const issue = message => template.issues.push({ route, message });
  if (document.querySelectorAll('main').length !== 1) issue('Expected one main landmark');
  if (document.querySelectorAll('h1').length !== 1) issue('Expected one page heading');
  const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
  for (const id of new Set(ids.filter((id, index) => ids.indexOf(id) !== index))) issue(`Duplicate id: ${id}`);
  for (const image of document.querySelectorAll('main img[src^="/"]')) {
    const src = decodeURI(image.getAttribute('src').split('?')[0]);
    if (!fs.existsSync('public' + src) && !fs.existsSync('dist/client' + src)) issue(`Missing local image: ${src}`);
  }
  for (const field of document.querySelectorAll('main input, main select, main textarea')) {
    if (['hidden', 'submit', 'button'].includes(field.getAttribute('type')) || field.getAttribute('name') === '_gotcha' || field.closest('[hidden], [style*="display:none"], [style*="display: none"]')) continue;
    const label = field.closest('label') || (field.id && [...document.querySelectorAll('label')].some(label => label.getAttribute('for') === field.id));
    if (!label && !field.getAttribute('aria-label') && !field.getAttribute('aria-labelledby')) issue(`Unlabelled field: ${field.id || field.getAttribute('name') || field.tagName}`);
  }
}

const report = templates.map(({ regex, score, ...item }) => ({ ...item, sample: item.pages[0] || (!item.route.includes('[') ? item.route : serverSamples[item.route]) })).sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync('/tmp/dos-ui-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ templates: report.length, generatedPages: report.reduce((sum, item) => sum + item.pages.length, 0), issues: report.flatMap(item => item.issues) }, null, 2));

if (process.argv.includes('--preview')) {
  const samples = report.filter(item => item.sample && !item.redirect);
  const html = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  fs.writeFileSync('public/__ui-review.html', `<!doctype html><html lang="en"><meta charset="utf-8"><title>Local page review</title>
<style>body{margin:0;background:#e2e8f0;font:14px system-ui}form{display:flex;gap:12px;padding:8px;align-items:center}select{max-width:70vw}iframe{display:block;border:0;margin:0 auto;height:860px;background:white;max-width:100%}</style>
<form><label>Page <select name="page">${samples.map((item, index) => `<option value="${index}">${html(item.file.replace('src/pages/', ''))}</option>`).join('')}</select></label><label>Width <select name="width"><option>390</option><option>1200</option></select></label><button>Review</button><a id="next">Next page</a></form><iframe title="Page preview"></iframe>
<script>const pages=${JSON.stringify(samples.map(item => item.sample)).replaceAll('<', '\\u003c')};const params=new URLSearchParams(location.search);const page=Number(params.get('page'))||0;const width=params.get('width')==='1200'?'1200':'390';document.querySelector('[name=page]').value=String(page);document.querySelector('[name=width]').value=width;document.querySelector('#next').href='?page='+((page+1)%pages.length)+'&width='+width;const frame=document.querySelector('iframe');frame.width=width;frame.src=pages[page]||pages[0];</script></html>`);
}
