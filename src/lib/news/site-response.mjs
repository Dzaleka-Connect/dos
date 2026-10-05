const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function applySiteSettings(html, settings) {
  const marker = html.match(/<script[^>]*id="dos-page-seo"[^>]*>([\s\S]*?)<\/script>/);
  if (!marker) return html;
  let page;
  try { page = JSON.parse(marker[1]); } catch { return html; }
  let head = html.slice(0, html.indexOf('</head>'));
  const rest = html.slice(head.length);
  const meta = (attribute, name, value) => {
    if (!value) return;
    const tag = `<meta ${attribute}="${name}" content="${escape(value)}">`;
    const pattern = new RegExp(`<meta\\s+${attribute}="${name}"[^>]*>`, 'g');
    head = pattern.test(head) ? head.replace(pattern, () => tag) : head + tag;
  };
  if (!page.exactTitle && settings.title) {
    const title = page.title.includes(settings.title) ? page.title : `${page.title}${settings.titleSeparator || ' | '}${settings.title}`;
    head = head.replace(/<title[^>]*>[\s\S]*?<\/title>/, () => `<title>${escape(title)}</title>`);
  }
  meta('property', 'og:site_name', settings.title);
  meta('name', 'google-site-verification', settings.googleVerification);
  meta('name', 'msvalidate.01', settings.bingVerification);
  if (page.defaultImage && /^https?:\/\//.test(settings.defaultOgImage || '')) {
    meta('property', 'og:image', settings.defaultOgImage);
    meta('name', 'twitter:image', settings.defaultOgImage);
  }
  return head + rest;
}

export function redirectResponse(rule, requestUrl) {
  if (!rule) return null;
  if (rule.status === 410 || rule.status === 451) return new Response(null, { status: rule.status });
  if (![301, 302, 303, 307, 308].includes(rule.status) || typeof rule.location !== 'string') return null;
  if (!rule.location.startsWith('/') || rule.location.startsWith('//') || /[\\\r\n]/.test(rule.location)) return null;
  const target = new URL(rule.location, requestUrl);
  if (target.href === requestUrl.href) return null;
  return new Response(null, { status: rule.status, headers: { Location: target.href, 'Cache-Control': 'no-store' } });
}
