var assert = require('assert');
const fs = require('fs')
var Display = require('./Display.js')

describe('Display', function() {
  describe('should read input and determine digits displayed', function() {
    it('reads input and determines number of times a 1, 4, 7, or 8 is displayed', function(done) {
      fs.readFile('test-input.txt', 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }

      const lines = data.split(/\r?\n/).map(line => line.trim());
      const display = new Display(lines);
			assert.deepEqual(display.solvedDigits[0], '8394')
			assert.deepEqual(display.solvedDigits[1], '9781')
			assert.deepEqual(display.solvedDigits[2], '1197')
			assert.equal(display.answer, 61229)
      done();
    })
    });
  });
});