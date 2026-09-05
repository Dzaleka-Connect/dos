import { describe, expect, it } from 'vitest';
import { recordImageUrl, recordImages, formatRecordDate, recordCoordinates, sameRecordValue } from '../src/utils/recordMedia';

describe('record media and metadata', () => {
  it('keeps remote image schemes and signed query parameters intact', () => {
    expect(recordImageUrl('https://example.org/photo.jpg?token=a%2Fb&w=1600')).toBe('https://example.org/photo.jpg?token=a%2Fb&w=1600');
  });
  it('encodes local filenames once and deduplicates an album without losing its cover', () => {
    expect(recordImages('/images/Camp photo.jpg', ['/images/Camp%20photo.jpg', '/images/second.jpg'], [])).toEqual(['/images/Camp%20photo.jpg', '/images/second.jpg']);
    expect(recordImages('/images/cover.jpg', [])).toEqual(['/images/cover.jpg']);
  });
  it('rejects empty and non-web image sources', () => {
    expect(recordImages(null, undefined, '', 'javascript:alert(1)', 'data:image/png;base64,abc')).toEqual([]);
  });
  it('preserves date precision and approximate or ongoing descriptions', () => {
    expect(formatRecordDate('2026-06')).toBe('June 2026');
    expect(formatRecordDate(2014)).toBe('2014');
    expect(formatRecordDate('Approximate, 2013')).toBe('Approximate, 2013');
    expect(formatRecordDate('Ongoing since 2014')).toBe('Ongoing since 2014');
    expect(formatRecordDate('2025-01-15')).toBe('15 January 2025');
    expect(formatRecordDate(undefined)).toBe('');
  });
  it('uses valid coordinates, including zero, and rejects missing or out-of-range values', () => {
    expect(recordCoordinates(0, '33.8')).toEqual({ lat: 0, lng: 33.8 });
    for (const [lat, lng] of [[null, 33], ['', 33], [91, 33], [-13, -181], ['unknown', 33]]) expect(recordCoordinates(lat, lng)).toBeNull();
  });
  it('does not treat two missing metadata values as a related-record match', () => {
    expect(sameRecordValue(undefined, undefined)).toBe(false);
    expect(sameRecordValue(' ', '')).toBe(false);
    expect(sameRecordValue(' Dzaleka ', 'dzaleka')).toBe(true);
  });
});
