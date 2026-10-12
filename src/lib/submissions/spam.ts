export function spamError(fields: Record<string, unknown>): string | null {
  if (['_gotcha', '_dos_honey', 'bot-field'].some(key => String(fields[key] || '').trim())) return 'Your submission could not be verified. Please reload and try again.';
  if (!Object.entries(fields).some(([key, raw]) => !key.startsWith('_') && key !== 'form-name' && typeof raw === 'string' && raw.trim())) return 'Complete the form before submitting.';
  for (const [key, raw] of Object.entries(fields)) {
    if (/email$/i.test(key) && typeof raw === 'string' && raw.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())) return 'Enter a valid email address.';
  }
  let randomFields = 0;
  for (const [key, raw] of Object.entries(fields)) {
    if (key.startsWith('_') || /email|url|image|photo|id$|token|signature/i.test(key) || typeof raw !== 'string') continue;
    const text = raw.trim();
    if (/^[a-zA-Z]{16,}$/.test(text)) {
      const transitions = [...text].slice(1).filter((char, i) => (char === char.toUpperCase()) !== (text[i] === text[i].toUpperCase())).length;
      if (transitions >= 7 && /[a-z]/.test(text) && /[A-Z]/.test(text)) randomFields++;
    }
  }
  if (randomFields >= 3) return 'Please use readable names and descriptions instead of random text.';
  return null;
}
export function correctionError(fields: Record<string, unknown>) {
  const raw = String(fields.listingUrl || '').trim();
  try {
    const url = new URL(raw);
    if (url.origin !== 'https://services.dzaleka.com' || url.username || url.password || url.search || url.hash || !/^\/services\/[^/]+\/?$/.test(url.pathname) || ['register', 'update-request'].includes(url.pathname.split('/')[2]) || /^\d+$/.test(url.pathname.split('/')[2])) throw new Error();
  } catch { return 'Choose a service listing from this directory and use its full website address.'; }
  if (!['description', 'address', 'contact', 'hours', 'notes', 'category', 'access_eligibility', 'access_fees', 'access_documents', 'access_appointment', 'access_languages', 'access_accessibility'].some(key => String(fields[key] || '').trim())) return 'Describe the correction you would like us to make.';
  return spamError(fields);
}
