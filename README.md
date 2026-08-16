# bus-tracker

> follow the bus you want!

Real-time bus tracking — pick a line, see where its buses are right now, and know when the next one reaches your stop.

**Status:** early planning. Nothing is implemented yet; everything below describes the intended shape of the project.

## Planned features

- **Live vehicle positions** — poll a transit agency's real-time feed and show buses on a map.
- **Follow a line** — subscribe to a specific route and watch only its vehicles.
- **Stop ETAs** — estimated arrival time for a chosen stop, based on the latest positions.
- **Favourites** — save the routes and stops you check every day.
- **Arrival alerts** — optional notification when a followed bus is a few minutes out.

## Planned stack

- **Runtime:** Node.js (LTS)
- **Server:** Express — REST endpoints plus a websocket channel for live updates
- **Data source:** GTFS static (routes, stops, schedules) + GTFS-Realtime (vehicle positions)
- **Frontend:** a small web client with a map view
- **Storage:** to be decided — likely SQLite or Postgres for the static GTFS tables

## Getting started

Once there's code to run:

```bash
git clone https://github.com/niroosh1997/bus-tracker.git
cd bus-tracker
npm install
npm start
```

Configuration will live in a `.env` file (transit feed URL and API key, server port). An `.env.example` will be committed once the settings are settled.

## Project layout

To be filled in as the project takes shape.

## Contributing

Ideas and issues are welcome — open an issue describing the transit agency or feature you care about.

## License

Not yet chosen.
