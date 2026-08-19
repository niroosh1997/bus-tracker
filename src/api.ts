import type { ApiError, LineSearchResult } from '../shared/types.ts';

export async function searchLine(number: string): Promise<LineSearchResult> {
  const res = await fetch(`/api/lines/${encodeURIComponent(number)}`);
  const body: unknown = await res.json();

  if (!res.ok) {
    // The server sends a readable sentence for upstream failures; show it as-is
    // rather than a generic "request failed".
    throw new Error((body as ApiError)?.error ?? `Request failed (${res.status})`);
  }
  return body as LineSearchResult;
}
