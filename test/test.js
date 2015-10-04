
var assert = require("assert");
var jsCalendar = require('../index');

describe('jsCalendar', function () {

    describe('basic functionality', function () {
        it('should do basic functionality', function () {
			var january = jsCalendar(2019, 1);
            assert.equal(january.days.length, 56);
            assert.equal(january.month, 1);
			assert.equal(january.year, 2019);
        });
    });
});
