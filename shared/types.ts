/** One route under a line number: a single direction run by one company. */
export interface LineRoute {
  /** The id the ministry's APIs key on (GTFS route_id === SIRI LineRef). */
  lineRef: number;
  /** The number painted on the bus. Not unique across the country. */
  number: string;
  company: string | null;
  start: string | null;
  end: string | null;
  direction: string | null;
}

export interface LineSearchResult {
  number: string;
  /** Schedule day the results came from; null when nothing was found. */
  date: string | null;
  routes: LineRoute[];
}

export interface ApiError {
  error: string;
}
