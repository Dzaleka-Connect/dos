import { publicOrigin } from '../lib/insights/contract';

// No visitor IDs, cookies, form values or full outbound URLs are stored in the browser.
if (location.origin === publicOrigin && !new URLSearchParams(location.search).has('preview') && !document.querySelector('[data-cms-preview], [aria-label="Preview status"]')) {
  let lastPage = '';
  const started = new WeakSet<HTMLFormElement>();
  const optedOut = () => navigator.doNotTrack === '1' || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true || localStorage.getItem('dos_statistics_optout') === '1';
  const send = (name: string, target = '', id = crypto.randomUUID()) => {
    try {
      if (optedOut()) return;
      const params = new URLSearchParams(location.search);
      const campaign = (key: string) => { const value = params.get(`utm_${key}`) || ''; return /^[a-zA-Z0-9 _.-]{0,80}$/.test(value) ? value : ''; };
      const body = JSON.stringify({ id, name, path: location.pathname, referrer: document.referrer, target, source: campaign('source'), medium: campaign('medium'), campaign: campaign('campaign') });
      fetch('/api/analytics/collect', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body, keepalive: true }).catch(() => {});
    } catch { /* Statistics must never prevent navigation or form submission. */ }
  };
  const page = () => { if (lastPage === location.pathname) return; lastPage = location.pathname; send('pageview'); };
  page(); document.addEventListener('astro:page-load', page); window.addEventListener('popstate', page);
  document.addEventListener('input', event => {
    const form = (event.target as HTMLElement)?.closest('form');
    if (!form || started.has(form) || !form.action.includes('/api/submissions?form=')) return;
    started.add(form); send('form_start');
  });
  document.addEventListener('click', event => {
    const link = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href]'); if (!link) return;
    try {
      const url = new URL(link.href), section = location.pathname.split('/')[1];
      if (url.origin === location.origin && url.pathname.startsWith('/go/')) return;
      if (['application', 'registration'].includes(link.dataset.insightsEvent || '')) send(link.dataset.insightsEvent!, ['http:', 'https:'].includes(url.protocol) ? url.hostname : '');
      else if (url.protocol === 'tel:') send('phone');
      else if (url.protocol === 'mailto:') send('email');
      else if (['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) send('whatsapp', 'whatsapp');
      else if (link.hasAttribute('download') || /\.(pdf|docx?|xlsx?|zip)$/i.test(url.pathname)) send('download', url.hostname);
      else if (['http:', 'https:'].includes(url.protocol) && url.origin !== location.origin) {
        const name = link.dataset.insightsEvent || (section === 'jobs' && /apply/i.test(link.textContent || '') ? 'application' : section === 'events' && /register|registration|ticket/i.test(link.textContent || '') ? 'registration' : 'outbound');
        send(name, url.hostname);
      }
    } catch { /* Ignore links that are not valid URLs. */ }
  });
}
