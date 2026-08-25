/**
 * Deprecation and sunset signalling for the public API.
 *
 * Implements RFC 9745 (`Deprecation` header) and RFC 8594 (`Sunset` header and
 * the `deprecation`/`sunset` link relations). Both headers carry HTTP-date
 * values; RFC 9745 additionally defines `Deprecation` as an IMF-fixdate.
 *
 * `DEPRECATIONS` is the single source of truth. It is intentionally empty:
 * nothing is deprecated today. Adding an entry is all that is required for the
 * endpoint to start advertising its retirement, and for the policy page and the
 * OpenAPI document to list it.
 */

export const DEPRECATION_POLICY_PATH = '/api/deprecation-policy';

/** Minimum notice between announcing a deprecation and removing the endpoint. */
export const MINIMUM_NOTICE_PERIOD = 'P6M';
export const MINIMUM_NOTICE_MONTHS = 6;

export type DeprecationRecord = {
  /** Path this applies to, matched exactly against the request pathname. */
  path: string;
  /** When the endpoint was announced as deprecated (ISO 8601). */
  deprecatedAt: string;
  /** When the endpoint will stop responding (ISO 8601). Omit if undecided. */
  sunsetAt?: string;
  /** What callers should use instead. */
  replacement?: string;
  /** Short human-readable reason, shown on the policy page. */
  reason: string;
};

/**
 * Currently deprecated endpoints. Empty means nothing is deprecated.
 * Keep entries here until the sunset date has passed and the route is removed.
 */
export const DEPRECATIONS: DeprecationRecord[] = [];

/**
 * Look up the deprecation record for a request path, if any.
 *
 * Scans the array rather than a Map built at module load, so the list stays the
 * single source of truth even if it is edited. The list is empty or tiny.
 */
export function findDeprecation(pathname: string): DeprecationRecord | undefined {
  return DEPRECATIONS.find((entry) => entry.path === pathname);
}

/**
 * Format a date as an IMF-fixdate, the format both RFC 9745 and RFC 8594
 * require (for example `Wed, 11 Nov 2026 00:00:00 GMT`).
 */
export function toHttpDate(iso: string): string {
  return new Date(iso).toUTCString();
}

/**
 * Headers announcing a path's deprecation, or an empty object when the path is
 * not deprecated. Merge these into the response headers.
 */
export function deprecationHeaders(
  pathname: string,
  policyUrl: string
): Record<string, string> {
  const entry = findDeprecation(pathname);
  if (!entry) return {};

  const links = [`<${policyUrl}>; rel="deprecation"; type="text/html"`];
  if (entry.sunsetAt) {
    links.push(`<${policyUrl}>; rel="sunset"; type="text/html"`);
  }
  if (entry.replacement) {
    links.push(`<${entry.replacement}>; rel="successor-version"`);
  }

  return {
    Deprecation: toHttpDate(entry.deprecatedAt),
    ...(entry.sunsetAt ? { Sunset: toHttpDate(entry.sunsetAt) } : {}),
    Link: links.join(', '),
  };
}

/** Machine-readable policy document, served at DEPRECATION_POLICY_PATH. */
export function deprecationPolicyDocument(siteUrl: string) {
  return {
    policy: 'Dzaleka Online Services API deprecation policy',
    url: `${siteUrl}${DEPRECATION_POLICY_PATH}`,
    versioning: {
      strategy: 'header',
      header: 'API-Version',
      description:
        'Send an optional API-Version request header to pin a version. The serving version is echoed on every response. Breaking changes ship under a new major version.',
    },
    notice: {
      minimumPeriod: MINIMUM_NOTICE_PERIOD,
      minimumMonths: MINIMUM_NOTICE_MONTHS,
      description:
        'An endpoint scheduled for removal is announced at least six months before it stops responding.',
    },
    signals: [
      {
        header: 'Deprecation',
        specification: 'RFC 9745',
        description:
          'Present on a deprecated endpoint. An IMF-fixdate giving the moment the endpoint became deprecated.',
      },
      {
        header: 'Sunset',
        specification: 'RFC 8594',
        description:
          'Present once a removal date is set. An IMF-fixdate giving the moment the endpoint stops responding.',
      },
      {
        header: 'Link',
        specification: 'RFC 8288',
        description:
          'Carries rel="deprecation" and rel="sunset" pointing at this policy, and rel="successor-version" pointing at the replacement endpoint when one exists.',
      },
    ],
    guidance: [
      'Check for a Deprecation header on every response. Its presence means the endpoint has a replacement or a removal date.',
      'If a Sunset header is present, migrate before that date. Requests after it will fail.',
      'Follow the successor-version link when one is offered.',
      'Nothing is removed without a Deprecation header and at least six months of notice.',
    ],
    deprecated: DEPRECATIONS.map((entry) => ({
      path: entry.path,
      deprecatedAt: entry.deprecatedAt,
      deprecationHeader: toHttpDate(entry.deprecatedAt),
      sunsetAt: entry.sunsetAt ?? null,
      sunsetHeader: entry.sunsetAt ? toHttpDate(entry.sunsetAt) : null,
      replacement: entry.replacement ?? null,
      reason: entry.reason,
    })),
    checkedAt: new Date().toISOString(),
  };
}
