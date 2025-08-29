'use strict';
const runner = require('../test-runner');

let started = false;

module.exports = function (app) {
  if (!started) {
    started = true;
    // ⏱️ Ejecuta el runner en el próximo tick del event loop
    setImmediate(() => {
      try {
        runner.run();
      } catch (e) {
        console.error('Runner error:', e && e.message);
      }
    });
  }

  app.get('/_api/get-tests', (req, res) => {
    res.json(runner.getResults());
  });

  app.get('/_api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });
};
