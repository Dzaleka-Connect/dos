import { essentials, guideSite, guideVersion, sectionsFor, unhcrContact, type GuideLanguage } from '../data/essentials';

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character] || character));
}

export function renderEssentialsDownload(language: GuideLanguage) {
  const copy = essentials[language];
  const e = escapeHtml;
  const link = (href: string, label: string) => `<a href="${e(href)}">${e(label)}</a>`;
  return `<!doctype html>
<html lang="${language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(copy.title)} · ${e(copy.download)}</title><meta name="description" content="${e(copy.intro)}"><meta name="robots" content="noindex, follow"><link rel="canonical" href="${guideSite}/essentials/${language}">
<style>
*{box-sizing:border-box}body{margin:0;background:#f1f5f9;color:#172b40;font:17px/1.6 system-ui,sans-serif}main{max-width:780px;margin:2rem auto;padding:2rem;background:#fff;border-top:6px solid #075985}h1{font-size:2rem;line-height:1.2;margin:1rem 0}h2{font-size:1.2rem;line-height:1.4;margin:0 0 .5rem}p{margin:.5rem 0 1rem}a{color:#075985;text-underline-offset:3px;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #075985;outline-offset:4px}.brand,footer{font-size:.85rem}section{margin:1.5rem 0;break-inside:avoid}.contact{padding:1rem;border:1px solid #cbd5e1;background:#f8fafc}dl{margin:0}dt{font-weight:600}dd{margin:0 0 .5rem}footer{border-top:1px solid #cbd5e1;padding-top:1rem}@media(max-width:600px){main{margin:0;padding:1.25rem}}@media print{@page{margin:15mm}body{background:#fff;font-size:11pt}main{margin:0;padding:0;max-width:none}h1{font-size:23pt}section{margin:1rem 0}.online-link{display:none}}
</style></head><body><main>
<p class="brand" lang="en">Dzaleka Online Services · ${e(copy.name)}</p><h1>${e(copy.title)}</h1><p>${e(copy.intro)}</p>
${sectionsFor(language).map((section, index) => `<section><h2>${index + 1}. ${e(section.title)}</h2><p>${e(section.body)}</p>${link(guideSite + section.href, section.link)}</section>`).join('')}
<section class="contact"><h2>${e(copy.officeTitle)}</h2><p>${e(copy.officeNote)}</p><dl><dt>${e(copy.phone)}</dt><dd>${link(unhcrContact.phoneHref, unhcrContact.phone)}</dd><dt>${e(copy.email)}</dt><dd>${link('mailto:' + unhcrContact.email, unhcrContact.email)}</dd></dl><p>${link(unhcrContact.source, copy.source)}<br>${e(copy.checked)}</p></section>
<p>${link(guideSite + '/services?category=Health', copy.health)} · ${link(guideSite + '/services?category=Education', copy.education)}</p>
<footer><p>${e(copy.linksNote)}</p><p class="online-link">${link(guideSite + '/essentials/' + language, copy.online)}</p><p>${link('mailto:dzalekaconnect@gmail.com?subject=' + encodeURIComponent('Newcomer guide (' + language + ')'), copy.correction)}</p><p>Dzaleka Online Services · ${guideVersion}</p></footer>
</main></body></html>`;
}
