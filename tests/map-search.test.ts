import { describe, it, expect } from 'vitest';
import { filterMapPoints, type MapPoint } from '../src/components/data/DzalekaInteractiveMap';
const points = [
  { id: '1', name: 'Health centre', type: 'health', categoryLabel: 'Healthcare', description: 'Clinic', zone: 'Katubiza' },
  { id: '2', name: 'Central school', type: 'education', categoryLabel: 'Education', description: 'Learning', zone: 'Katubiza' },
  { id: '3', name: 'Market', type: 'market', categoryLabel: 'Commerce', description: 'Trading stalls', zone: 'Central' },
] as MapPoint[];
describe('map directory search', () => {
  it('combines a case-insensitive area search with categories', () => {
    expect(filterMapPoints(points, ' KATUBIZA ', 'all').map((point) => point.id)).toEqual(['1', '2']);
    expect(filterMapPoints(points, ' KATUBIZA ', 'health').map((point) => point.id)).toEqual(['1']);
  });
  it('finds descriptions and preserves the complete directory when filters clear', () => {
    expect(filterMapPoints(points, 'stalls', 'all').map((point) => point.id)).toEqual(['3']);
    expect(filterMapPoints(points, 'missing place', 'all')).toEqual([]);
    expect(filterMapPoints(points, '', 'all')).toEqual(points);
  });
});
