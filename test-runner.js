'use strict';
const Mocha = require('mocha');

let state = {
  started: false,
  finished: false,
  stats: null,
  passes: [],
  failures: [],
  tests: [],
};

function run() {
  if (state.started) return;
  state.started = true;

  const mocha = new Mocha({ ui: 'tdd', timeout: 5000 });
  mocha.addFile('./tests/1_unit-tests.js');
  mocha.addFile('./tests/2_functional-tests.js');

  const runner = mocha.run();

  runner
    .on('test end', test => {
      state.tests.push({
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration,
      });
    })
    .on('pass', test => {
      state.passes.push({
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration,
      });
    })
    .on('fail', (test, err) => {
      state.failures.push({
        title: test.title,
        fullTitle: test.fullTitle(),
        error: err && (err.message || String(err)),
      });
    })
    .on('end', function () {
      state.finished = true;
      state.stats = this.stats;
    });
}

function getResults() {
  return {
    started: state.started,
    finished: state.finished,
    stats: state.stats,
    passes: state.passes,
    failures: state.failures,
    tests: state.tests,
  };
}

module.exports = { run, getResults };
