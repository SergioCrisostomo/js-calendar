
var assert = require('assert');
var jsCalendar = require('../index');

describe('jsCalendar', function () {

    describe('basic functionality', function () {
        it('should do basic functionality', function () {
			var january = jsCalendar.generator(2019, 0);
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
					var monthInYear = jsCalendar.generator(y, m);
					var monthLength = monthLengths[m];
					if (!monthLength) monthLength = isLeapYear(y) ? 29 : 28;
					assert.equal(monthInYear.daysInMonth, monthLength);
					// check last day in each month is the right one
					var days = monthInYear.cells.filter(function(cell){
						return cell.type == 'monthDay';
					});
					var lastDay = days.pop().desc;
					assert.equal(monthInYear.daysInMonth, lastDay);
				}
			}
        });
        it('should return correct week numbers', function () {
			for (var y = 2015; y < 2300; y++){	// check dates between 1800 and 2300
				var monthInYear = jsCalendar.generator(y, 0, false, true);
				var weekNr = monthInYear.cells[0].week;
				var dayInWeek = new Date(y, 0).getDay() || 7;
				if (dayInWeek > 4) assert.equal(weekNr > 50, true);
				else assert.equal(weekNr, 1);
				
				var afterThreeWeeks = monthInYear.cells[28].week;
				if (dayInWeek <= 4) assert.equal(afterThreeWeeks, 4);
			}
		});
		describe('should add classes correctly', function () {
			it('when custom fn is last', function () {
				var monthInYear = jsCalendar.generator(2016, 0, [jsCalendar.addLabels, function(dayData){
						dayData.class.push('test-class');
						return dayData;
				}], true);
				assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
			});
			it('when custom function is first passing a string', function () {
			var monthInYear = jsCalendar.generator(2016, 1, [function(dayData){
					dayData.class = 'test-class';
						return dayData;
				}, jsCalendar.addLabels], true);
				assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
			});
			it('when custom function is first passing a array', function () {
			var monthInYear = jsCalendar.generator(2016, 2, [function(dayData){
					dayData.class = ['test-class'];
						return dayData;
				}, jsCalendar.addLabels], true);
				assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
			});
		});
    });
});
