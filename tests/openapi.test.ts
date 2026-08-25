import { describe, it, expect } from 'vitest';
import { buildOpenApiDocument } from '../src/data/agentDiscovery';
import { errorCatalog } from '../src/utils/api-errors';
import { API_VERSION, MAX_REQUESTS_PER_WINDOW } from '../src/utils/api-headers';

const doc: any = buildOpenApiDocument();

const operations = Object.entries(doc.paths).flatMap(([path, item]: [string, any]) =>
  Object.entries(item)
    .filter(([method]) => ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'].includes(method))
    .map(([method, op]) => ({ path, method, op: op as any }))
);

describe('OpenAPI document', () => {
  it('is OpenAPI 3.1 and carries the current API version', () => {
    expect(doc.openapi).toMatch(/^3\.1/);
    expect(doc.info.version).toBe(API_VERSION);
    expect(doc['x-api-version']).toBe(API_VERSION);
  });

  it('describes at least one operation', () => {
    expect(operations.length).toBeGreaterThan(0);
  });

  it('gives every operation an operationId', () => {
    const missing = operations.filter(({ op }) => !op.operationId);
    expect(missing.map((m) => `${m.method} ${m.path}`)).toEqual([]);
  });

  it('keeps every operationId unique', () => {
    const ids = operations.map(({ op }) => op.operationId);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect([...new Set(duplicates)]).toEqual([]);
  });

  it('uses camelCase operationIds safe for function calling', () => {
    for (const { op } of operations) {
      // Function-calling schemas reject anything outside [A-Za-z0-9_].
      expect(op.operationId).toMatch(/^[a-z][A-Za-z0-9]*$/);
    }
  });

  it('encodes path parameters into the operationId', () => {
    const byPath = operations.find(({ path }) => path.includes('{'));
    if (byPath) {
      expect(byPath.op.operationId).toMatch(/By[A-Z]/);
    }
  });

  it('defines the Problem schema once and references it from errors', () => {
    expect(doc.components.schemas.Problem).toBeDefined();
    expect(doc.components.schemas.Problem.properties.code.enum).toEqual(Object.keys(errorCatalog));
  });

  it('documents typed error responses on every operation', () => {
    for (const { path, method, op } of operations) {
      for (const status of ['400', '429', '500']) {
        expect(
          op.responses[status],
          `${method.toUpperCase()} ${path} is missing a ${status} response`
        ).toBeDefined();
        expect(op.responses[status].content['application/problem+json'].schema.$ref).toBe(
          '#/components/schemas/Problem'
        );
      }
    }
  });

  it('offers an API-Version header parameter on every operation', () => {
    for (const { path, method, op } of operations) {
      const names = (op.parameters ?? []).map((p: any) => p.name);
      expect(names, `${method.toUpperCase()} ${path}`).toContain('API-Version');
    }
  });

  it('publishes the versioning and rate-limit policy for agents', () => {
    expect(doc['x-version-policy'].strategy).toBe('header');
    expect(doc['x-version-policy'].header).toBe('API-Version');
    expect(doc['x-version-policy'].deprecation.minimumNoticePeriod).toBe('P6M');
    expect(doc['x-rate-limit'].limit).toBe(MAX_REQUESTS_PER_WINDOW);
    expect(doc['x-rate-limit'].retryHeader).toBe('Retry-After');
    expect(doc['x-rate-limit'].headers).toContain('RateLimit-Remaining');
  });

  it('publishes a deprecation policy agents can read before integrating', () => {
    const dep = doc['x-version-policy'].deprecation;
    expect(dep.policyUrl).toContain('/api/deprecation-policy');
    expect(dep.minimumNoticePeriod).toMatch(/^P\d+[MY]$/);
    expect(dep.policy).toContain('RFC 9745');
    expect(dep.policy).toContain('RFC 8594');
    expect(Array.isArray(dep.currentlyDeprecated)).toBe(true);
  });

  it('documents the deprecation policy endpoint itself', () => {
    const op = operations.find(({ path }) => path === '/api/deprecation-policy');
    expect(op).toBeDefined();
    expect(op!.op.operationId).toBeTruthy();
  });

  it('carries contact and licence metadata', () => {
    expect(doc.info.contact?.url).toBeTruthy();
    expect(doc.info.license?.name).toBeTruthy();
  });

  it('advertises rate-limit headers on success responses', () => {
    const ok = operations.find(({ op }) => op.responses['200']);
    expect(Object.keys(ok!.op.responses['200'].headers ?? {})).toEqual(
      expect.arrayContaining(['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'])
    );
  });
});
