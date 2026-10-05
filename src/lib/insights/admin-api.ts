import { apiFetch, parseApiResponse } from 'emdash/plugin-utils';
import { pluginPath } from './contract';
export async function api<T>(route: string, body?: unknown): Promise<T> {
  const response = await apiFetch(pluginPath + route, body === undefined ? undefined : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const result = await parseApiResponse<T & { ok?: boolean; error?: string }>(response, 'Request failed');
  if (result.ok === false) throw new Error(result.error || 'Request failed.');
  return result;
}
export function download(value: string, filename: string, mime = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([value], { type: mime })), link = document.createElement('a');
  link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export const message = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong. Please try again.';
