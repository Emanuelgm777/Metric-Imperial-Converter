'use strict';
const runner = require('../test-runner');

module.exports = function (app) {
  runner.run();

  app.get('/_api/get-tests', (req, res) => {
    res.json(runner.getResults());
  });

  app.get('/_api/health', (req, res) => {
    res.json({ ok: true, ts: Date.now() });
  });
};
