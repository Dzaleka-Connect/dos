import { describe, expect, it } from 'vitest';
import { getSeasonalFallbackWeather } from '../src/data/weather';
import { weatherView } from '../src/utils/weatherView';
describe('weather presentation', () => {
  it('never presents seasonal estimates as a current forecast', () => {
    expect(weatherView(getSeasonalFallbackWeather())).toEqual({ available: false, periods: [] });
    expect(weatherView(null).available).toBe(false);
  });
  it('shows actual district data including a valid zero temperature', () => {
    const data = getSeasonalFallbackWeather(); data.source = 'met-malawi-live'; data.stale = false;
    data.forecast.current.maxTemp = '0'; data.forecast.current.minTemperature = '';
    data.forecast.hourly = [data.forecast.current];
    expect(weatherView(data)).toEqual({ available: true, periods: data.forecast.hourly });
  });
  it('hides stale or unparseable forecast data', () => {
    const data = getSeasonalFallbackWeather(); data.source = 'met-malawi-live';
    expect(weatherView(data).available).toBe(false);
    data.stale = false; data.forecast.current.maxTemp = ''; data.forecast.current.minTemperature = 'unknown';
    expect(weatherView(data).available).toBe(false);
  });
});
