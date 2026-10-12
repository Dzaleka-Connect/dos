// This allowlist controls delivery; submitted URLs can never select a recipient.
export const relayForms: Record<string, 'formspree' | 'formcarry'> = {
  "contactform": "formspree",
  "helpdeskform": "formcarry",
  "ui-pagefeedback": "formspree",
  "applications-internal-advocacy": "formspree",
  "applications-internal-emergency": "formspree",
  "applications-internal-leadership": "formspree",
  "applications-internal-legal": "formspree",
  "dancers-submit": "formspree",
  "encyclopedia-submit-correction": "formspree",
  "grants-and-programs-submit": "formspree",
  "marketplace-stores-register": "formspree",
  "marketplace-submit": "formspree",
  "photos-submit": "formspree",
  "poets-submit": "formspree",
  "public-art-catalogue-report-issue": "formspree",
  "public-art-catalogue-submit-update": "formspree",
  "public-art-catalogue-submit": "formspree",
  "resources-submit": "formspree",
  "rights-navigator-report": "formspree",
  "site-register-report-issue": "formspree",
  "site-register-submit-update": "formspree",
  "site-register-submit": "formspree",
  "skills-exchange-list-profile": "formspree",
  "skills-exchange-request": "formspree",
  "skills-exchange-update-profile": "formspree",
  "submit-voice": "formspree",
  "support": "formspree",
  "talents-submit": "formspree",
  "visit-become-guide": "formspree"
};
export const submissionPaths = new Set([
  '/api/submissions', '/api/form-relay', '/api/map-submission', '/api/submit-voice', '/api/send-booking-confirmation',
  ...['submit-course', 'submit-store', 'submit-marketplace', 'submit-voice', 'send-booking-confirmation', 'send-feedback-confirmation'].map(name => '/.netlify/functions/' + name),
]);
export function submissionTarget(url: URL) {
  if (!submissionPaths.has(url.pathname)) return null;
  if (url.pathname === '/api/form-relay' && !Object.hasOwn(relayForms, url.searchParams.get('form') || '')) return null;
  return url.pathname + (['/api/submissions', '/api/form-relay'].includes(url.pathname) ? '?form=' + encodeURIComponent(url.searchParams.get('form') || '') : '');
}
