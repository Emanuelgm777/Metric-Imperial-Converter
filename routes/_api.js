'use strict';
const runner = require('../test-runner');

let scheduled = false;
let started = false;

function scheduleRunner() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    try { runner.run(); started = true; } catch (e) {
      console.error('Runner error:', e?.message || e);
    }
  }, 1000); // 1s de margen para que /api/convert esté montado
}

function waitForTests(timeoutMs = 5000, intervalMs = 120) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const tick = () => {
      const arr = runner.getTestsArray();
      if (arr && arr.length > 0) return resolve(arr);
      if (Date.now() - t0 >= timeoutMs) return resolve(arr || []);
      setTimeout(tick, intervalMs);
    };
    tick();
  });
}

module.exports = function (app) {
  scheduleRunner();

  // FCC espera un ARRAY con "context" ('Unit Tests' / 'Functional Tests')
  app.get('/_api/get-tests', async (req, res) => {
    scheduleRunner();
    const arr = await waitForTests(5000, 120);
    res.json(arr);
  });

  // Estado (debug)
  app.get('/_api/get-status', (req, res) => {
    res.json({ started, scheduled, status: runner.getStatus() });
  });

  // Healthcheck (debug)
  app.get('/_api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now(), node_env: process.env.NODE_ENV || null });
  });
};
