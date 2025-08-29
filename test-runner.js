'use strict';
const Mocha = require('mocha');

/**
 * Estado interno del runner
 */
let state = {
  started: false,
  finished: false,
  stats: null,
  tests: [],    // <- FCC lee un ARRAY desde /_api/get-tests
  passes: [],
  failures: [],
};

/**
 * Ejecuta Mocha una sola vez (idempotente)
 */
function run() {
  if (state.started) return;
  state.started = true;

  const mocha = new Mocha({ ui: 'tdd', timeout: 5000 });

  // Archivos de test del proyecto FCC
  mocha.addFile('./tests/1_unit-tests.js');
  mocha.addFile('./tests/2_functional-tests.js');

  const runner = mocha.run();

  runner
    .on('test end', (test) => {
      // FCC filtra por "context": 'Unit Tests' o 'Functional Tests'
      const context = (test.parent && test.parent.title) || '';
      state.tests.push({
        title: test.title,
        fullTitle: test.fullTitle && test.fullTitle(),
        duration: test.duration,
        state: test.state, // 'passed' / 'failed' (si aplica)
        context,           // <- CLAVE para que FCC cuente 16 y 5
      });
    })
    .on('pass', (test) => {
      state.passes.push({
        title: test.title,
        fullTitle: test.fullTitle && test.fullTitle(),
        duration: test.duration,
      });
    })
    .on('fail', (test, err) => {
      state.failures.push({
        title: test.title,
        fullTitle: test.fullTitle && test.fullTitle(),
        error: err && (err.message || String(err)),
      });
    })
    .on('end', function () {
      state.finished = true;
      state.stats = this.stats; // { tests, passes, failures, duration }
    });
}

/**
 * Lo que FCC consume en /_api/get-tests
 */
function getTestsArray() {
  return state.tests;
}

/**
 * Estado general opcional (/_api/get-status)
 */
function getStatus() {
  return {
    started: state.started,
    finished: state.finished,
    stats: state.stats,
    passes: state.passes,
    failures: state.failures,
  };
}

module.exports = { run, getTestsArray, getStatus };
