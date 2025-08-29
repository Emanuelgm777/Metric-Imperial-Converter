'use strict';
const Mocha = require('mocha');

let state = {
  started: false,
  finished: false,
  stats: null,
  tests: [],
  passes: [],
  failures: [],
};

function run() {
  if (state.started) return;
  state.started = true;

  const mocha = new Mocha({ ui: 'tdd', timeout: 5000 });
  mocha.addFile('./tests/1_unit-tests.js');
  mocha.addFile('./tests/2_functional-tests.js');

  const runner = mocha.run();

  runner
    .on('pass', (test) => {
      const context = (test.parent && test.parent.title) || '';
      const item = {
        title: test.title,
        fullTitle: test.fullTitle && test.fullTitle(),
        duration: test.duration,
        state: 'passed',
        context
      };
      state.tests.push(item);
      state.passes.push(item);
    })
    .on('fail', (test, err) => {
      const context = (test.parent && test.parent.title) || '';
      const item = {
        title: test.title,
        fullTitle: test.fullTitle && test.fullTitle(),
        duration: test.duration,
        state: 'failed',
        context,
        error: err && (err.message || String(err))
      };
      state.tests.push(item);
      state.failures.push(item);
    })
    .on('end', function () {
      state.finished = true;
      state.stats = this.stats;
    });
}

function getTestsArray() { return state.tests; }
function getStatus() {
  return {
    started: state.started,
    finished: state.finished,
    stats: state.stats,
    passes: state.passes,
    failures: state.failures
  };
}

module.exports = { run, getTestsArray, getStatus };
