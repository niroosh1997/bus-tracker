// Looks a bus line number up in the national schedule.
//
// The number painted on the bus (route_short_name, e.g. "56") is NOT unique:
// it can cover a couple of dozen unrelated routes run by different companies in
// different cities. Each of those has its own id (line_ref) -- and confusingly,
// a line_ref is itself just a number, so "979" is both a valid line number
// (Ramat Gan -> Safed) and a valid line_ref (line 56, Tel Aviv -> Yehud).
// Resolving one to the other is exactly what this module is for.

const API = 'https://open-bus-stride-api.hasadna.org.il';

// The upstream feed sometimes has no rows for today (its import runs a day or
// more in arrears, and occasionally stalls). Walking back a few days keeps the
// search working instead of showing an empty screen.
const MAX_DAYS_BACK = 7;

function isoDate(daysAgo) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** Split "origin<->destination-city-<dir><alt>" into its two ends. */
export function splitRouteName(longName, direction, alternative) {
  const name = longName || '';
  if (!name.includes('<->')) return { start: name.trim() || null, end: null };

  const [start, ...rest] = name.split('<->');
  let end = rest.join('<->');

  // The name repeats the direction/alternative as a suffix; drop it.
  const suffix = `-${direction ?? ''}${alternative ?? ''}`;
  if (suffix.length > 1 && end.endsWith(suffix)) {
    end = end.slice(0, -suffix.length);
  }
  return { start: start.trim() || null, end: end.trim() || null };
}

async function fetchRoutesForDate(number, date) {
  const url =
    `${API}/gtfs_routes/list?date_from=${date}&date_to=${date}` +
    `&route_short_name=${encodeURIComponent(number)}&limit=300`;

  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`Open Bus returned ${res.status}`);

  const body = await res.json();
  // The API reports its own errors as a 200 with an object body.
  if (!Array.isArray(body)) {
    throw new Error(`Open Bus error: ${body?.message ?? 'unexpected response'}`);
  }
  return body;
}

/**
 * Every route sharing a line number, newest schedule day available.
 * Returns { number, date, routes: [{ lineRef, number, company, start, end, direction }] }
 */
export async function findLine(number) {
  for (let daysAgo = 0; daysAgo <= MAX_DAYS_BACK; daysAgo++) {
    const date = isoDate(daysAgo);
    const rows = await fetchRoutesForDate(number, date);
    if (rows.length === 0) continue;

    const routes = rows.map((r) => {
      const { start, end } = splitRouteName(
        r.route_long_name,
        r.route_direction,
        r.route_alternative,
      );
      return {
        lineRef: r.line_ref,
        number: r.route_short_name,
        company: r.agency_name || null,
        start,
        end,
        direction: r.route_direction ?? null,
      };
    });
    return { number, date, routes };
  }
  return { number, date: null, routes: [] };
}
