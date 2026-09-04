import { describe, it, expect } from 'vitest';
import {
  DEPRECATIONS,
  DEPRECATION_POLICY_PATH,
  MINIMUM_NOTICE_MONTHS,
  MINIMUM_NOTICE_PERIOD,
  deprecationHeaders,
  deprecationPolicyDocument,
  findDeprecation,
  toHttpDate,
  type DeprecationRecord,
} from '../src/utils/api-deprecation';

const POLICY_URL = `https://services.dzaleka.com${DEPRECATION_POLICY_PATH}`;

/** RFC 9745 and RFC 8594 both require an IMF-fixdate. */
const IMF_FIXDATE = /^[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT$/;

describe('date formatting', () => {
  it('formats dates as IMF-fixdate', () => {
    expect(toHttpDate('2026-11-11T00:00:00Z')).toMatch(IMF_FIXDATE);
    expect(toHttpDate('2026-11-11T00:00:00Z')).toBe('Wed, 11 Nov 2026 00:00:00 GMT');
  });
});

describe('deprecation headers', () => {
  it('emits nothing for a path that is not deprecated', () => {
    expect(deprecationHeaders('/api/services', POLICY_URL)).toEqual({});
  });

  /**
   * Run `fn` with a temporary entry added, then restore the shipped list.
   * Restores rather than empties: the list is no longer empty, and emptying it
   * here would silently delete real entries for every test that follows.
   */
  function withDeprecation(entry: DeprecationRecord, fn: () => void) {
    const original = [...DEPRECATIONS];
    DEPRECATIONS.length = 0;
    DEPRECATIONS.push(entry);
    try {
      fn();
    } finally {
      DEPRECATIONS.length = 0;
      DEPRECATIONS.push(...original);
    }
  }

  const legacy: DeprecationRecord = {
    path: '/api/legacy-thing',
    deprecatedAt: '2026-01-15T00:00:00Z',
    sunsetAt: '2026-07-15T00:00:00Z',
    replacement: 'https://services.dzaleka.com/api/services',
    reason: 'Replaced by /api/services.',
  };

  it('emits Deprecation, Sunset and Link for a deprecated path', () => {
    withDeprecation(legacy, () => {
      const headers = deprecationHeaders('/api/legacy-thing', POLICY_URL);
      expect(headers.Deprecation).toBe('Thu, 15 Jan 2026 00:00:00 GMT');
      expect(headers.Sunset).toBe('Wed, 15 Jul 2026 00:00:00 GMT');
      expect(headers.Deprecation).toMatch(IMF_FIXDATE);
      expect(headers.Sunset).toMatch(IMF_FIXDATE);
      expect(headers.Link).toContain(`<${POLICY_URL}>; rel="deprecation"`);
      expect(headers.Link).toContain(`<${POLICY_URL}>; rel="sunset"`);
      expect(headers.Link).toContain('rel="successor-version"');
    });
  });

  it('leaves other paths untouched while one path is deprecated', () => {
    withDeprecation(legacy, () => {
      expect(deprecationHeaders('/api/services', POLICY_URL)).toEqual({});
    });
  });

  it('omits Sunset until a removal date is set', () => {
    withDeprecation({ ...legacy, sunsetAt: undefined, replacement: undefined }, () => {
      const headers = deprecationHeaders('/api/legacy-thing', POLICY_URL);
      expect(headers.Deprecation).toBeDefined();
      expect(headers.Sunset).toBeUndefined();
      expect(headers.Link).toContain('rel="deprecation"');
      expect(headers.Link).not.toContain('rel="sunset"');
      expect(headers.Link).not.toContain('successor-version');
    });
  });

  it('honours the minimum notice period in the policy document', () => {
    withDeprecation(legacy, () => {
      const doc = deprecationPolicyDocument('https://services.dzaleka.com');
      expect(doc.deprecated).toHaveLength(1);
      const months =
        (new Date(legacy.sunsetAt!).getTime() - new Date(legacy.deprecatedAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30.44);
      expect(months).toBeGreaterThanOrEqual(MINIMUM_NOTICE_MONTHS - 0.5);
    });
  });

  it('does not deprecate a path that is not deprecated', () => {
    expect(findDeprecation('/api/services')).toBeUndefined();
  });

  /**
   * The published policy promises at least six months of notice. A shipped
   * entry that breaks that promise is worse than no policy, so the list itself
   * is checked rather than only the helper functions.
   */
  it.each(DEPRECATIONS.map((d) => [d.path, d] as const))(
    'honours the published notice period for %s',
    (path, entry) => {
      expect(entry.reason.length, `${path} needs a reason`).toBeGreaterThan(20);
      if (!entry.sunsetAt) return; // no removal date set yet, so no notice to check
      const months =
        (new Date(entry.sunsetAt).getTime() - new Date(entry.deprecatedAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30.44);
      expect(months, `${path} gives only ${months.toFixed(1)} months notice`).toBeGreaterThanOrEqual(
        MINIMUM_NOTICE_MONTHS
      );
    }
  );

  it('marks every deprecated path as deprecated in the OpenAPI document', async () => {
    const { buildOpenApiDocument } = await import('../src/data/agentDiscovery');
    const doc: any = buildOpenApiDocument();
    for (const entry of DEPRECATIONS) {
      const item = doc.paths[entry.path];
      expect(item, `${entry.path} is deprecated but absent from the spec`).toBeDefined();
      const flagged = Object.values(item).some((op: any) => op.deprecated === true);
      expect(flagged, `${entry.path} is not flagged deprecated in the spec`).toBe(true);
    }
  });
});

describe('policy document', () => {
  const doc = deprecationPolicyDocument('https://services.dzaleka.com');

  it('states the versioning strategy and header', () => {
    expect(doc.versioning.strategy).toBe('header');
    expect(doc.versioning.header).toBe('API-Version');
  });

  it('states a minimum notice period agents can rely on', () => {
    expect(doc.notice.minimumPeriod).toBe(MINIMUM_NOTICE_PERIOD);
    expect(doc.notice.minimumMonths).toBe(MINIMUM_NOTICE_MONTHS);
    // ISO 8601 duration, so it is machine-readable.
    expect(doc.notice.minimumPeriod).toMatch(/^P\d+[MY]$/);
  });

  it('documents each removal signal against its specification', () => {
    const byHeader = Object.fromEntries(doc.signals.map((s) => [s.header, s]));
    expect(byHeader.Deprecation.specification).toBe('RFC 9745');
    expect(byHeader.Sunset.specification).toBe('RFC 8594');
    expect(byHeader.Link.specification).toBe('RFC 8288');
  });

  it('gives agents actionable guidance', () => {
    expect(doc.guidance.length).toBeGreaterThan(2);
    for (const line of doc.guidance) {
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(20);
    }
  });

  it('lists every currently deprecated endpoint', () => {
    expect(Array.isArray(doc.deprecated)).toBe(true);
    expect(doc.deprecated.map((d: any) => d.path)).toEqual(DEPRECATIONS.map((d) => d.path));
    for (const entry of doc.deprecated) {
      expect(entry.deprecationHeader, entry.path).toMatch(IMF_FIXDATE);
      if (entry.sunsetAt) expect(entry.sunsetHeader, entry.path).toMatch(IMF_FIXDATE);
    }
  });

  it('is self-describing via an absolute URL', () => {
    expect(doc.url).toBe(POLICY_URL);
  });
});
