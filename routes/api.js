'use strict';

const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  const convertHandler = new ConvertHandler();

  // GET /api/convert?input=10L
  app.get('/api/convert', (req, res) => {
    const input = (req.query.input || '').toString();

    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);

    const numInvalid = initNum === 'invalid number';
    const unitInvalid = initUnit === 'invalid unit';

    if (numInvalid && unitInvalid) {
      return res.status(200).type('text').send('invalid number and unit');
    }
    if (numInvalid) {
      return res.status(200).type('text').send('invalid number');
    }
    if (unitInvalid) {
      return res.status(200).type('text').send('invalid unit');
    }

    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const returnNum = convertHandler.convert(initNum, initUnit);
    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    return res.json({ initNum, initUnit, returnNum, returnUnit, string });
  });
};
