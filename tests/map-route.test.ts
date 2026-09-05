import { describe, expect, it } from 'vitest';
import { parseMapRoute } from '../src/utils/mapRoute';

const response = () => ({ code: 'Ok', routes: [{ distance: 2400, duration: 400, geometry: { coordinates: [[33.8, -13.6], [33.9, -13.7]] }, legs: [{ steps: [{ name: 'M7', distance: 2400, maneuver: { type: 'depart' } }] }] }] });
describe('road route previews', () => {
  it('keeps provider distances and converts GeoJSON coordinates for Leaflet', () => {
    const route = parseMapRoute(response());
    expect(route?.coordinates).toEqual([[-13.6, 33.8], [-13.7, 33.9]]);
    expect(route?.distance).toBe(2400);
    expect(route?.steps[0].name).toBe('M7');
  });
  it('does not manufacture routes for missing or failed responses', () => {
    for (const data of [null, {}, { code: 'NoRoute', routes: [] }, { code: 'Ok', routes: [] }]) expect(parseMapRoute(data)).toBeNull();
  });
  it('rejects invalid geometry and missing route statistics', () => {
    const data = response(); data.routes[0].geometry.coordinates[0] = [181, -13];
    expect(parseMapRoute(data)).toBeNull();
    data.routes[0].geometry.coordinates = [[33, -13]];
    expect(parseMapRoute(data)).toBeNull();
    const invalid = response(); invalid.routes[0].duration = NaN;
    expect(parseMapRoute(invalid)).toBeNull();
  });
});
