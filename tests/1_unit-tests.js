const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
  
  test('whole number input', function(done) {
    let input = '32L';
    assert.equal(convertHandler.getNum(input), 32);
    done();
  });
  
  test('decimal input', function(done) {
    let input = '32.5L';
    assert.equal(convertHandler.getNum(input), 32.5);
    done();
  });
  
  test('fractional input', function(done) {
    let input = '1/2km';
    assert.equal(convertHandler.getNum(input), 0.5);
    done();
  });
  
  test('fractional input with decimal', function(done) {
    let input = '5.4/3lbs';
    assert.approximately(convertHandler.getNum(input), 1.8, 0.1);
    done();
  });
  
  test('error on double-fraction', function(done) {
    let input = '3/2/3kg';
    assert.equal(convertHandler.getNum(input), 'invalid number');
    done();
  });
  
  test('default to 1 when no numerical input', function(done) {
    let input = 'kg';
    assert.equal(convertHandler.getNum(input), 1);
    done();
  });
  
  test('read each valid input unit', function(done) {
    let input = ['gal','L','mi','km','lbs','kg','GAL','l','MI','KM','LBS','KG'];
    input.forEach(function(ele) {
      assert.equal(convertHandler.getUnit(ele), convertHandler.getUnit(ele));
    });
    done();
  });
  
  test('unknown unit input', function(done) {
    assert.equal(convertHandler.getUnit('32g'), 'invalid unit');
    done();
  });
  
  test('return unit for each valid input unit', function(done) {
    let input = ['gal','L','mi','km','lbs','kg'];
    let expect = ['L','gal','km','mi','kg','lbs'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
    });
    done();
  });
  
  test('spelled-out string unit', function(done) {
    let input = ['gal','L','mi','km','lbs','kg'];
    let expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
    input.forEach(function(ele, i) {
      assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
    });
    done();
  });
  
  test('gal to L', function(done) {
    assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.1);
    done();
  });
  
  test('L to gal', function(done) {
    assert.approximately(convertHandler.convert(1, 'L'), 0.26417, 0.1);
    done();
  });
  
  test('mi to km', function(done) {
    assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.1);
    done();
  });
  
  test('km to mi', function(done) {
    assert.approximately(convertHandler.convert(1, 'km'), 0.62137, 0.1);
    done();
  });
  
  test('lbs to kg', function(done) {
    assert.approximately(convertHandler.convert(1, 'lbs'), 0.45359, 0.1);
    done();
  });
  
  test('kg to lbs', function(done) {
    assert.approximately(convertHandler.convert(1, 'kg'), 2.20462, 0.1);
    done();
  });

});
