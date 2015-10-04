
var assert = require('assert');
var jsCalendar = require('../index');

describe('jsCalendar', function () {

    describe('basic functionality', function () {
        it('should do basic functionality', function () {
			var january = jsCalendar(2019, 0);
            assert.equal(january.cells.length, 56);
            assert.equal(january.month, 0);
			assert.equal(january.year, 2019);
			assert.equal(january.daysInMonth, 31);
        });

        it('should return correct month length', function () {
			var monthLengths = [31, false, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			function isLeapYear(year){	// double verification if is a leap year
				var algorithm = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
				var javascript = new Date(y, 1, 29).getMonth() == 1;
				assert.equal(algorithm, javascript); // just to be sure
				return javascript;
			}
			
			for (var y = 1800; y < 2300; y++){	// check dates between 1800 and 2300
				for (var m = 0; m < 12; m++){
					var monthInYear = jsCalendar(y, m);
					var monthLength = monthLengths[m];
					if (!monthLength) monthLength = isLeapYear(y) ? 29 : 28;
					assert.equal(monthInYear.daysInMonth, monthLength);
					// check last day in each month is the right one
					var days = monthInYear.cells.filter(function(cell){
						return cell.type == 'monthDay';
					});
					var lastDay = days.pop().day;
					assert.equal(monthInYear.daysInMonth, lastDay);
				}
			}
        });

    });
});
/*
	31 days
2	February	28 days, 29 in leap years
3	March	31 days
4	April	30 days
5	May	31 days
6	June	30 days
7	July	31 days
8	August	31 days
9	September	30 days
10	October	31 days
11	November	30 days
12	December	31 days
*/