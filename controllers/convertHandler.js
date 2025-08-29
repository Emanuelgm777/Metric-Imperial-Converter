'use strict';

// controllers/convertHandler.js
function ConvertHandler() {
  // Unidades válidas EXACTAS que usaremos de salida desde getUnit()
  const normalizedUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];

  const returnUnits = {
    gal: 'L',
    L: 'gal',
    mi: 'km',
    km: 'mi',
    lbs: 'kg',
    kg: 'lbs',
  };

  const spellOut = {
    gal: 'gallons',
    L: 'liters',
    mi: 'miles',
    km: 'kilometers',
    lbs: 'pounds',
    kg: 'kilograms',
  };

  const convertRates = {
    gal: 3.78541,
    L: 1 / 3.78541,
    mi: 1.60934,
    km: 1 / 1.60934,
    lbs: 0.453592,
    kg: 1 / 0.453592,
  };

  // ---------------------------
  // Helpers
  // ---------------------------
  const isFiniteNumber = (n) => typeof n === 'number' && Number.isFinite(n);

  // Parseo seguro:
  // - vacío => 1
  // - "a/b" con un solo "/" => parsea como fracción (permitidos decimales en a o b)
  // - de lo contrario => parseFloat
  function parseSafeNumber(fragment) {
    if (!fragment || fragment.trim() === '') return 1;

    const pieces = fragment.split('/');
    if (pieces.length > 2) return 'invalid number';

    // Solo número simple
    if (pieces.length === 1) {
      const n = Number(pieces[0]);
      return isFiniteNumber(n) ? n : 'invalid number';
    }

    // Fracción a/b
    const num = Number(pieces[0]);
    const den = Number(pieces[1]);
    if (!isFiniteNumber(num) || !isFiniteNumber(den) || den === 0) {
      return 'invalid number';
    }
    return num / den;
  }

  // Extrae el prefijo numérico (todo lo que no sea letra al inicio)
  function extractNumericPrefix(input) {
    const m = (input || '').trim().match(/^[^a-zA-Z]+/);
    return m ? m[0].trim() : '';
  }

  // Extrae la unidad (letras al final)
  function extractUnitSuffix(input) {
    const m = (input || '').trim().match(/[a-zA-Z]+$/);
    return m ? m[0].trim() : '';
  }

  // Normaliza la unidad a nuestras 6 válidas exactas
  // - 'l' o variantes -> 'L'
  // - resto -> minúsculas
  function normalizeUnit(u) {
    if (!u) return null;
    const low = u.toLowerCase();
    if (low === 'l') return 'L';
    if (['gal', 'mi', 'km', 'lbs', 'kg'].includes(low)) return low;
    return null;
  }

  // ---------------------------
  // API pública
  // ---------------------------
  this.getNum = function (input) {
    const fragment = extractNumericPrefix(input);
    const parsed = parseSafeNumber(fragment);
    return parsed;
  };

  this.getUnit = function (input) {
    const raw = extractUnitSuffix(input);
    const unit = normalizeUnit(raw);
    if (!unit) return 'invalid unit';
    // Aseguramos que esté en nuestra lista de salida
    return normalizedUnits.includes(unit) ? unit : 'invalid unit';
  };

  this.getReturnUnit = function (initUnit) {
    return returnUnits[initUnit];
  };

  this.spellOutUnit = function (unit) {
    return spellOut[unit];
  };

  this.convert = function (initNum, initUnit) {
    const rate = convertRates[initUnit];
    if (!isFiniteNumber(initNum) || !isFiniteNumber(rate)) return NaN;
    const result = initNum * rate;
    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${spellOut[initUnit]} converts to ${returnNum} ${spellOut[returnUnit]}`;
  };
}

module.exports = ConvertHandler;
