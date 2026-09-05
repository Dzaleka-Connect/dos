import type { WeatherApiResponse } from '../data/weather';

/** Seasonal reference data must never appear as today's measured or forecast weather. */
export function weatherView(data: WeatherApiResponse | null | undefined) {
  const available = data?.source === 'met-malawi-live' && !data.stale && Boolean(data.forecast?.current)
    && [data.forecast.current.maxTemp, data.forecast.current.minTemperature].some(value => value !== '' && value != null && Number.isFinite(Number(value)));
  return { available, periods: available && Array.isArray(data?.forecast?.hourly) ? data.forecast.hourly.slice(0, 6) : [] };
}
