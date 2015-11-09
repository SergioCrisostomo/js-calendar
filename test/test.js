
var assert = require('assert');
var jsCalendar = require('../index');

describe('jsCalendar', function(){

	describe('basic functionality', function(){

		function isLeapYear(year){	// double verification if is a leap year
			var algorithm = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
			var javascript = new Date(year, 1, 29).getMonth() == 1;
			assert.equal(algorithm, javascript); // just to be sure
			return javascript;
		}

		var monthLengths = [31, false, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var jsCal = new jsCalendar.Generator();

		it('should do basic functionality', function(){
			var january = jsCal(2019, 0);
			assert.equal(january.cells.length, 56);
			assert.equal(january.month, 0);
			assert.equal(january.year, 2019);
			assert.equal(january.daysInMonth, 31);
		});

		it('should return correct month length', function(){
			for (var y = 1800; y < 2300; y++){	// check dates between 1800 and 2300
				for (var m = 0; m < 12; m++){
					var monthInYear = jsCal(y, m);
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

		it('should return correct week numbers', function(){
			for (var y = 1978; y < 2078; y++){	// check dates between 1800 and 2300
				var monthInYear = jsCal(y, 0);
				var weekNr = monthInYear.cells[0].week;
				var dayInWeek = new Date(y, 0).getDay() || 7;
				if (dayInWeek > 4) assert.equal(weekNr > 50, true);
				else assert.equal(weekNr, 1);
				
				var afterThreeWeeks = monthInYear.cells[28].week;
				if (dayInWeek <= 4) assert.equal(afterThreeWeeks, 3);
			}
		});
	});

	describe('addLabels should add classes correctly', function(){

		var jsCalWithWeeks = new jsCalendar.Generator({onlyDays: true});

		it('when custom fn is last', function(){
			var monthInYear = jsCalWithWeeks(2016, 0, [jsCalendar.addLabels, function(dayData){
					dayData.class.push('test-class');
					return dayData;
			}]);
			assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
		});

		it('when custom function return class as string', function(){
		var monthInYear = jsCalWithWeeks(2016, 1, [function(dayData){
				dayData.class = 'test-class';
				return dayData;
			}, jsCalendar.addLabels]);
			assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
		});

		it('when custom function return class as array', function(){
			var monthInYear = jsCalWithWeeks(2016, 2, [function(dayData){
				dayData.class = ['test-class'];
				return dayData;
			}, jsCalendar.addLabels]);
			assert.equal(monthInYear.cells[0].class.indexOf('test-class') != -1, true);
		});
	});

	describe('addLabels ', function(){

		var jsCalWithWeeks = new jsCalendar.Generator();

		it('should set the correct default month name in each day', function(){
			var monthInYear = jsCalWithWeeks(2016, 2, [jsCalendar.addLabels]);

			monthInYear.cells.forEach(function(day){
				console.log('day.type: ', day.type, monthInYear.cells.length, day)
				if (day.type == 'prevMonth') assert.equal(day.monthName, 'February');
				else if (day.type == 'nextMonth') assert.equal(day.monthName, 'April');
				else if (day.type == 'monthDay') assert.equal(day.monthName, 'March');
			});
		});

		it('should set the correct default month name in month object', function(){
			var monthInYear = jsCalWithWeeks(2016, 2, [jsCalendar.addLabels]);
			assert.equal(monthInYear.monthName, 'March');
		});

		it('should merge new options', function(){
			var jsCal = new jsCalendar.Generator({lang: 'pt'});
			var ptColumnNames = {
				0: 'w',
				1: 'segunda',
				2: 'terça',
				3: 'quarta',
				4: 'quinta',
				5: 'sexta',
				6: 'sabado',
				7: 'domingo'
			};
			var ptMonthNames = [
				"Janeiro",
				"Fevereiro",
				"Março",
				"Abril",
				"Maio",
				"Junho",
				"Julho",
				"Agosto",
				"Setembro",
				"Outubro",
				"Novembro",
				"Dezembro"
			];
			var pt = {monthNames: {pt: ptMonthNames}, columnNames: {pt: ptColumnNames}};
			jsCalendar.addLabels.setLabels(pt);
			var monthInYear = jsCal(2016, 2, [jsCalendar.addLabels]);
			var month = monthInYear.cells.pop().monthName;
			assert.equal(month, 'Abril');
		});
	});

	describe('should generate correct index', function(){
		var jsCal = new jsCalendar.Generator();
		it('should not be a monthDay in index < 8', function(){
			var monthInYear = jsCal(2016, 0, [jsCalendar.addLabels]);
			for (var i = 0; i < 8; i++){
				assert.equal(monthInYear.cells[i].type != 'monthDay', true);
				assert.equal(monthInYear.cells[i].index, i);
			}
		});

		it('first index is 0', function(){
			var monthInYear = jsCal(2016, 1, [jsCalendar.addLabels]);
			assert.equal(monthInYear.cells[0].index == 0, true);
		});

		it('last index is 55 for full calendar', function(){
			var monthInYear = jsCal(2016, 2, [jsCalendar.addLabels]);
			assert.equal(monthInYear.cells.pop().index == 55, true);
		});

		it('last index is same as month length for only days calendar', function(){
			var jsCalOnlyDays = new jsCalendar.Generator({onlyDays: true});
			var monthInYear = jsCalOnlyDays(2016, 2, [jsCalendar.addLabels]);
			assert.equal(monthInYear.cells.pop().index, 41);
			assert.equal(monthInYear.cells.length, 41);
		});

		it('set the correct day type', function(){
			var february = 2;
			var jsCalOnlyDays = new jsCalendar.Generator({onlyDays: true});
			var monthInYear = jsCalOnlyDays(2016, february, []);
			var dayInFebruary = monthInYear.cells.shift();
			var dayInApril = monthInYear.cells.pop();

			assert.equal(dayInFebruary.type, 'prevMonth');
			assert.equal(dayInApril.type, 'nextMonth');
			assert.equal(dayInFebruary.date.getMonth(), february - 1);
			assert.equal(dayInApril.date.getMonth(), february + 1);
		});

	});
});
