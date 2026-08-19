import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { findLine } from './openbus.js';

const here = dirname(fileURLToPath(import.meta.url));
const app = express();

app.get('/api/lines/:number', async (req, res) => {
  const number = String(req.params.number).trim();
  if (!/^[A-Za-z0-9֐-׿]{1,8}$/.test(number)) {
    return res.status(400).json({ error: 'That does not look like a line number' });
  }

  try {
    res.json(await findLine(number));
  } catch (err) {
    // 502: we are fine, the upstream feed is not. Say so plainly -- the page
    // shows this text, so it has to be readable.
    res.status(502).json({ error: err.message });
  }
});

app.use(express.static(join(here, '..', 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`bus-tracker listening on http://localhost:${port}`));
