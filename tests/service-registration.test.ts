import { describe, expect, it } from 'vitest';
import { logoValidationError, registrationPayload } from '../src/utils/serviceRegistration';
describe('service registration submission', () => {
  it('retains all selected days, public contact details and the uploaded logo URL', () => {
    const data = new FormData();
    data.set('orgName', 'Community service'); data.set('email', 'contact@example.org');
    data.append('availability', 'Monday'); data.append('availability', 'Saturday');
    data.set('logoUrl', 'https://example.org/logo.png');
    data.set('orgLogo', new Blob(['image'], { type: 'image/png' }), 'logo.png');
    expect(registrationPayload(data)).toEqual({ orgName: 'Community service', email: 'contact@example.org', availability: ['Monday', 'Saturday'], logoUrl: 'https://example.org/logo.png' });
  });
  it('allows registration without an optional logo', () => {
    const data = new FormData(); data.set('logoUrl', '');
    expect(registrationPayload(data)).toEqual({ logoUrl: '', availability: [] });
  });
  it('enforces the advertised upload formats and size limit', () => {
    expect(logoValidationError({ type: 'image/png', size: 2 * 1024 * 1024 })).toBe('');
    expect(logoValidationError({ type: 'image/webp', size: 512 })).toBe('');
    expect(logoValidationError({ type: 'application/pdf', size: 512 })).toContain('JPG');
    expect(logoValidationError({ type: 'image/png', size: 2 * 1024 * 1024 + 1 })).toContain('2 MB');
  });
});
