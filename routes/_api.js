'use strict';
const runner = require('../test-runner');

let started = false;

module.exports = function (app) {
  // Arranca los tests una sola vez y en el próximo tick;
  // así /api/convert ya está montado cuando inicien los funcionales.
  if (!started) {
    started = true;
    setImmediate(() => {
      try { runner.run(); } catch (e) { console.error('Runner error:', e?.message || e); }
    });
  }

  // ⚠️ FCC espera un ARRAY con cada test y su "context" (Unit/Functional)
  app.get('/_api/get-tests', (req, res) => {
    res.json(runner.getTestsArray());
  });

  // Estado general (útil para debug)
  app.get('/_api/get-status', (req, res) => {
    res.json(runner.getStatus());
  });

  // Healthcheck
  app.get('/_api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now(), node_env: process.env.NODE_ENV || null });
  });
};
