import { useState, type FormEvent } from 'react';
import type { LineSearchResult } from '../shared/types.ts';
import { searchLine } from './api.ts';
import RouteCard from './RouteCard.tsx';

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LineSearchResult | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const number = query.trim();
    if (!number) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);
    try {
      setResult(await searchLine(number));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Find a bus line</h1>
      <p className="sub">
        Type the number painted on the bus. One number can belong to several different routes
        and companies — pick the one you mean.
      </p>

      <form onSubmit={onSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Line number, e.g. 56"
          aria-label="Line number"
          inputMode="numeric"
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p className="note">Searching…</p>}
      {error && <p className="err">{error}</p>}

      {result && !loading && <Summary result={result} />}

      <ul className="results">
        {result?.routes.map((route) => (
          <RouteCard
            key={route.lineRef}
            route={route}
            selected={selected === route.lineRef}
            onSelect={() => setSelected(route.lineRef)}
          />
        ))}
      </ul>
    </main>
  );
}

/** States which schedule day the answer came from — the upstream feed is often
 *  a day or more behind, and silently showing old data would be misleading. */
function Summary({ result }: { result: LineSearchResult }) {
  if (result.routes.length === 0) {
    return <p className="note">No route uses the number {result.number}.</p>;
  }
  const plural = result.routes.length === 1 ? '' : 's';
  return (
    <p className="note">
      {result.routes.length} route{plural} use the number {result.number} · schedule of{' '}
      {result.date}
    </p>
  );
}
