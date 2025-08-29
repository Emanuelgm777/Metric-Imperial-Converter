'use strict';
const runner = require('../test-runner');

let scheduled = false;
function scheduleRunnerIfTestEnv() {
  if (scheduled) return;
  if ((process.env.NODE_ENV || '').toLowerCase() !== 'test') return;
  scheduled = true;
  // pequeño margen para que /api/convert esté montado
  setTimeout(() => {
    try { runner.run(); } catch (e) { console.error('Runner error:', e?.message || e); }
  }, 800);
}

module.exports = function (app) {
  // Igual que el boilerplate oficial:
  app.get('/_api/app-info', (req, res) => {
    res.json({ server: 'express', version: '1.0.0' });
  });

  app.get('/_api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now(), node_env: process.env.NODE_ENV || null });
  });

  // FCC espera un ARRAY aquí y solo lo sirve si NODE_ENV === 'test'
  app.get('/_api/get-tests', (req, res) => {
    if ((process.env.NODE_ENV || '').toLowerCase() !== 'test') {
      return res.json({ status: 'unavailable' });
    }
    scheduleRunnerIfTestEnv();
    // no-cache para evitar respuestas vacías cacheadas
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.json(runner.getTestsArray());
  });

  // opcional: estado del runner (debug)
  app.get('/_api/get-status', (req, res) => {
    res.json(runner.getStatus());
  });
};
