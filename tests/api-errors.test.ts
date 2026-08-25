import { describe, it, expect } from 'vitest';
import {
  buildProblem,
  problemResponse,
  problemSchema,
  errorCatalog,
  PROBLEM_CONTENT_TYPE,
  PROBLEM_TYPE_BASE,
  type ApiErrorCode,
} from '../src/utils/api-errors';

const codes = Object.keys(errorCatalog) as ApiErrorCode[];

describe('RFC 9457 problem details', () => {
  it('exposes a code for every catalogued error', () => {
    expect(codes.length).toBeGreaterThan(0);
    expect(problemSchema.properties.code.enum).toEqual(codes);
  });

  it.each(codes)('builds a complete problem document for %s', (code) => {
    const problem = buildProblem(code);
    expect(problem.type).toBe(`${PROBLEM_TYPE_BASE}${code}`);
    expect(problem.code).toBe(code);
    expect(problem.status).toBe(errorCatalog[code].status);
    expect(problem.title).toBe(errorCatalog[code].title);
    // `resolution` is what makes the error actionable for an agent.
    expect(problem.resolution.length).toBeGreaterThan(0);
    for (const field of problemSchema.required) {
      expect(problem).toHaveProperty(field);
    }
  });

  it('uses the supplied detail and instance', () => {
    const problem = buildProblem('not_found', 'No entry with slug "x".', '/api/encyclopedia/x');
    expect(problem.detail).toBe('No entry with slug "x".');
    expect(problem.instance).toBe('/api/encyclopedia/x');
  });

  it('falls back to the title when no detail is given', () => {
    expect(buildProblem('internal_error').detail).toBe(errorCatalog.internal_error.title);
  });

  it('omits instance when not supplied', () => {
    expect(buildProblem('bad_request')).not.toHaveProperty('instance');
  });

  it('serves problem+json with the catalogued status', async () => {
    const response = problemResponse('rate_limited', 'Slow down.', { 'Retry-After': '30' });
    expect(response.status).toBe(429);
    expect(response.headers.get('Content-Type')).toBe(PROBLEM_CONTENT_TYPE);
    expect(response.headers.get('Retry-After')).toBe('30');
    const body = await response.json();
    expect(body.code).toBe('rate_limited');
    expect(body.detail).toBe('Slow down.');
  });

  it('never lets an extra header override the problem content type', async () => {
    const response = problemResponse('not_found', 'gone', {
      'Content-Type': 'application/json',
    });
    expect(response.headers.get('Content-Type')).toBe(PROBLEM_CONTENT_TYPE);
  });
});
