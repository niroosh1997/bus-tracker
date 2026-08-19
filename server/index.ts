import express from 'express';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { findLine } from './openbus.ts';

const here = dirname(fileURLToPath(import.meta.url));
const app = express();

app.get('/api/lines/:number', async (req, res) => {
  const number = String(req.params.number).trim();
  if (!/^[A-Za-z0-9֐-׿]{1,8}$/.test(number)) {
    res.status(400).json({ error: 'That does not look like a line number' });
    return;
  }

  try {
    res.json(await findLine(number));
  } catch (err) {
    // 502: we are fine, the upstream feed is not. Say so plainly -- the page
    // shows this text, so it has to be readable.
    res.status(502).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

// Serve the built client when it exists, so production is one process on one
// port. Absent in dev, where Vite serves the app and proxies /api here.
const dist = join(here, '..', 'dist');
if (existsSync(dist)) app.use(express.static(dist));

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`bus-tracker api on http://localhost:${port}`));
