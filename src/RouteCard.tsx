import type { LineRoute } from '../shared/types.ts';

interface Props {
  route: LineRoute;
  selected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ route, selected, onSelect }: Props) {
  return (
    <li
      className={selected ? 'route selected' : 'route'}
      aria-selected={selected}
      onClick={onSelect}
    >
      <div className="row">
        <span className="num">{route.number}</span>
        <span className="company" dir="auto">
          {route.company ?? 'unknown company'}
        </span>
      </div>

      {/* Explicit labels rather than an arrow: place names are Hebrew, so the
          row renders right-to-left and a "->" would point the wrong way. */}
      <div className="ends">
        <span className="label">from</span>
        <bdi>{route.start ?? '?'}</bdi>
        <span className="label">to</span>
        <bdi>{route.end ?? '?'}</bdi>
      </div>

      {selected && (
        <div className="id">
          API line id: <code>{route.lineRef}</code>
        </div>
      )}
    </li>
  );
}
