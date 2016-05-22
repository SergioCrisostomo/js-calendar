require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// calendar with 8 column x 7 rows

var labels = require('./labels');

function merge(_new, _old){
    for (var prop in _new){
        if (!_old[prop]) _old[prop] = _new[prop];
        else merge(_new[prop], _old[prop]);
    }
}

function addLabels(dayObject, lang){

	var cssClass = [labels.classes[dayObject.type]];

	if (dayObject.class) dayObject.class = (typeof dayObject.class == 'string' ? [dayObject.class] : dayObject.class).concat(cssClass);
	else dayObject.class = cssClass;

	if (dayObject.index == 0 && labels.weekPlaceholder) dayObject.des = labels.weekPlaceholder;
	if (dayObject.index < 8) dayObject.desc = labels.columnNames[lang][dayObject.index];
	else if (dayObject.index % 8 == 0) dayObject.desc = dayObject.week;

	if (dayObject.date) dayObject.monthName = labels.monthNames[lang][dayObject.date.getMonth()];
	if (!this.monthName) this.monthName = labels.monthNames[lang][this.month];

	return dayObject;
}
addLabels.setLabels = function(newOptions){
	merge(newOptions, labels);
};

module.exports = addLabels;

},{"./labels":3}],2:[function(require,module,exports){
// calendar with 8 column x 7 rows

var oneDay = 1000 * 60 * 60 * 24;

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getYear(year, month, weekNr){
	if (month == 0 && weekNr > 50) return year - 1;
	else if(month == 11 && weekNr < 10) return year + 1;
	else return year;
}

function getDateInfo(y, m, d, iso) {
	if (m > 11){
		m = 0;
		y++;
	}
    var currentDay = new Date(y, m, d);
    if (iso) currentDay.setDate(currentDay.getDate() + 4 - (currentDay.getDay() || 7));
    var year = iso ? currentDay.getFullYear() : y;
    var firstOfJanuary = new Date(year, 0, 1);
    var numberOfDays = 1 + Math.round((currentDay - firstOfJanuary) / oneDay);

    if (!iso) numberOfDays += firstOfJanuary.getDay();
	var w = Math.ceil(numberOfDays / 7);
    if (!iso) {
		var initialDay = new Date(y, m, d);
        var beginOfNextYear = new Date(y + 1, 0, 1);
        var startDayOfNextYear = beginOfNextYear.getDay();
        if (initialDay.getTime() >= beginOfNextYear.getTime() - (oneDay * startDayOfNextYear)) w = 1;
    }
	return w;
}

function getMonthCalender(year, month, iteratorFns){

	// config passed by binding
	var lang = this.lang || 'en';
	var onlyDays = this.onlyDays;
	var weekStart = typeof this.weekStart == 'undefined' ? 1 : this.weekStart;
	var iso = weekStart == 1;
	var cells = [];
	var monthStartDate = new Date(year, month, 1);	// make a date object
	var dayOfWeek = monthStartDate.getDay() || (iso ? 7 : 0);	// month week day for day 1
	var currentDay = weekStart - dayOfWeek; 		// starting position of first day in the week
	var weekNr = getDateInfo(year, month, 1, iso);	// get week number of month start
	var maxDays = daysInMonth(year, month);			// total days in current month
	var lastMonthMaxDays = daysInMonth(year, month - 1);
	var currentMonth, day, dayBefore;
	var currentYear = getYear(year, month, weekNr);

	var returnObject = {
		month: month,
		year: year,
		daysInMonth: maxDays
	};

	for (var i = 0; i < 7; i++){					// 7 rows in the calendar
		dayBefore = currentDay;
		for (var j = 0; j < 8; j++){				// 8 columns: week nr + 7 days p/ week
			if (i > 0 && j > 0) currentDay++;		// not first row, not week nr column

			if (currentDay > maxDays || currentDay < 1){ // day belongs to sibling month
				// calculate day in sibling month
				day = currentDay > maxDays ? currentDay - maxDays : lastMonthMaxDays + currentDay;
				currentMonth = currentDay > maxDays ? month + 1 : month - 1;
			} else {
				day = currentDay;
				currentMonth = month;
			}

			var type = (function(){
				if (j == 0) return 'weekLabel';
				else if (i == 0) return 'dayLabel';
				else if (currentDay < 1) return 'prevMonth';
				else if (currentDay > maxDays) return 'nextMonth';
				else return 'monthDay';
			})();
			var isDay = dayBefore != currentDay && i > 0;

			var dayData = {
				desc: isDay ? day : weekNr,
				week: weekNr,
				type: type,
				format: iso ? 'ISO 8601' : 'US',
				date: isDay ? new Date(Date.UTC(year, currentMonth, day)) : false,
				year: currentYear,
				index: cells.length
			};

			if (iteratorFns){
				if (typeof iteratorFns === "function") dayData = iteratorFns(dayData, lang);
				else iteratorFns.forEach(function(fn){
					dayData = fn.call(returnObject, dayData, lang);
				});
			}
			if (onlyDays && isDay) cells.push(dayData);	// add only days
			else if (!onlyDays) cells.push(dayData);	// add also week numbers and labels
		}
		if (i > 0) weekNr = getDateInfo(year, currentMonth, day + 1, iso);
		currentYear = getYear(year, month, weekNr);
	}

	returnObject.cells = cells;
	return returnObject;
}

module.exports = function (config){
	return getMonthCalender.bind(config);
}

},{}],3:[function(require,module,exports){

module.exports = {
	weekPlaceholder: '',
	columnNames: {
		en: {
			0: 'w',
			1: 'monday',
			2: 'tuesday',
			3: 'wednesday',
			4: 'thursday',
			5: 'friday',
			6: 'saturday',
			7: 'sunday'
		},
		se: {
			0: 'v',
			1: 'mondag',
			2: 'tisdag',
			3: 'onsdag',
			4: 'torsdag',
			5: 'fredag',
			6: 'l├Ârdag',
			7: 's├Ândag'
		}
	},
	monthNames: {
		en: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		se: [
			"januari",
			"februari",
			"mars",
			"april",
			"maj",
			"june",
			"juli",
			"augusti",
			"september",
			"oktober",
			"november",
			"december"
		]
	},
	classes: {
		dayLabel: 'day-of-week',
		weekLabel: 'week-number',
		prevMonth: 'inactive',
		nextMonth: 'inactive',
		monthDay: 'day-in-month'
	}
};

},{}],"jsCalendar":[function(require,module,exports){

module.exports = {
	Generator: require('./src/jsCalendar'),
	addLabels: require('./src/addLabels')
}

},{"./src/addLabels":1,"./src/jsCalendar":2}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hZGRMYWJlbHMuanMiLCJzcmMvanNDYWxlbmRhci5qcyIsInNyYy9sYWJlbHMuanMiLCJpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBjYWxlbmRhciB3aXRoIDggY29sdW1uIHggNyByb3dzXHJcblxyXG52YXIgbGFiZWxzID0gcmVxdWlyZSgnLi9sYWJlbHMnKTtcclxuXHJcbmZ1bmN0aW9uIG1lcmdlKF9uZXcsIF9vbGQpe1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBfbmV3KXtcclxuICAgICAgICBpZiAoIV9vbGRbcHJvcF0pIF9vbGRbcHJvcF0gPSBfbmV3W3Byb3BdO1xyXG4gICAgICAgIGVsc2UgbWVyZ2UoX25ld1twcm9wXSwgX29sZFtwcm9wXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZExhYmVscyhkYXlPYmplY3QsIGxhbmcpe1xyXG5cclxuXHR2YXIgY3NzQ2xhc3MgPSBbbGFiZWxzLmNsYXNzZXNbZGF5T2JqZWN0LnR5cGVdXTtcclxuXHJcblx0aWYgKGRheU9iamVjdC5jbGFzcykgZGF5T2JqZWN0LmNsYXNzID0gKHR5cGVvZiBkYXlPYmplY3QuY2xhc3MgPT0gJ3N0cmluZycgPyBbZGF5T2JqZWN0LmNsYXNzXSA6IGRheU9iamVjdC5jbGFzcykuY29uY2F0KGNzc0NsYXNzKTtcclxuXHRlbHNlIGRheU9iamVjdC5jbGFzcyA9IGNzc0NsYXNzO1xyXG5cclxuXHRpZiAoZGF5T2JqZWN0LmluZGV4ID09IDAgJiYgbGFiZWxzLndlZWtQbGFjZWhvbGRlcikgZGF5T2JqZWN0LmRlcyA9IGxhYmVscy53ZWVrUGxhY2Vob2xkZXI7XHJcblx0aWYgKGRheU9iamVjdC5pbmRleCA8IDgpIGRheU9iamVjdC5kZXNjID0gbGFiZWxzLmNvbHVtbk5hbWVzW2xhbmddW2RheU9iamVjdC5pbmRleF07XHJcblx0ZWxzZSBpZiAoZGF5T2JqZWN0LmluZGV4ICUgOCA9PSAwKSBkYXlPYmplY3QuZGVzYyA9IGRheU9iamVjdC53ZWVrO1xyXG5cclxuXHRpZiAoZGF5T2JqZWN0LmRhdGUpIGRheU9iamVjdC5tb250aE5hbWUgPSBsYWJlbHMubW9udGhOYW1lc1tsYW5nXVtkYXlPYmplY3QuZGF0ZS5nZXRNb250aCgpXTtcclxuXHRpZiAoIXRoaXMubW9udGhOYW1lKSB0aGlzLm1vbnRoTmFtZSA9IGxhYmVscy5tb250aE5hbWVzW2xhbmddW3RoaXMubW9udGhdO1xyXG5cclxuXHRyZXR1cm4gZGF5T2JqZWN0O1xyXG59XHJcbmFkZExhYmVscy5zZXRMYWJlbHMgPSBmdW5jdGlvbihuZXdPcHRpb25zKXtcclxuXHRtZXJnZShuZXdPcHRpb25zLCBsYWJlbHMpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBhZGRMYWJlbHM7XHJcbiIsIi8vIGNhbGVuZGFyIHdpdGggOCBjb2x1bW4geCA3IHJvd3NcclxuXHJcbnZhciBvbmVEYXkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xyXG5cclxuZnVuY3Rpb24gZGF5c0luTW9udGgoeWVhciwgbW9udGgpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCArIDEsIDApLmdldERhdGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0WWVhcih5ZWFyLCBtb250aCwgd2Vla05yKXtcclxuXHRpZiAobW9udGggPT0gMCAmJiB3ZWVrTnIgPiA1MCkgcmV0dXJuIHllYXIgLSAxO1xyXG5cdGVsc2UgaWYobW9udGggPT0gMTEgJiYgd2Vla05yIDwgMTApIHJldHVybiB5ZWFyICsgMTtcclxuXHRlbHNlIHJldHVybiB5ZWFyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRlSW5mbyh5LCBtLCBkLCBpc28pIHtcclxuXHRpZiAobSA+IDExKXtcclxuXHRcdG0gPSAwO1xyXG5cdFx0eSsrO1xyXG5cdH1cclxuICAgIHZhciBjdXJyZW50RGF5ID0gbmV3IERhdGUoeSwgbSwgZCk7XHJcbiAgICBpZiAoaXNvKSBjdXJyZW50RGF5LnNldERhdGUoY3VycmVudERheS5nZXREYXRlKCkgKyA0IC0gKGN1cnJlbnREYXkuZ2V0RGF5KCkgfHwgNykpO1xyXG4gICAgdmFyIHllYXIgPSBpc28gPyBjdXJyZW50RGF5LmdldEZ1bGxZZWFyKCkgOiB5O1xyXG4gICAgdmFyIGZpcnN0T2ZKYW51YXJ5ID0gbmV3IERhdGUoeWVhciwgMCwgMSk7XHJcbiAgICB2YXIgbnVtYmVyT2ZEYXlzID0gMSArIE1hdGgucm91bmQoKGN1cnJlbnREYXkgLSBmaXJzdE9mSmFudWFyeSkgLyBvbmVEYXkpO1xyXG5cclxuICAgIGlmICghaXNvKSBudW1iZXJPZkRheXMgKz0gZmlyc3RPZkphbnVhcnkuZ2V0RGF5KCk7XHJcblx0dmFyIHcgPSBNYXRoLmNlaWwobnVtYmVyT2ZEYXlzIC8gNyk7XHJcbiAgICBpZiAoIWlzbykge1xyXG5cdFx0dmFyIGluaXRpYWxEYXkgPSBuZXcgRGF0ZSh5LCBtLCBkKTtcclxuICAgICAgICB2YXIgYmVnaW5PZk5leHRZZWFyID0gbmV3IERhdGUoeSArIDEsIDAsIDEpO1xyXG4gICAgICAgIHZhciBzdGFydERheU9mTmV4dFllYXIgPSBiZWdpbk9mTmV4dFllYXIuZ2V0RGF5KCk7XHJcbiAgICAgICAgaWYgKGluaXRpYWxEYXkuZ2V0VGltZSgpID49IGJlZ2luT2ZOZXh0WWVhci5nZXRUaW1lKCkgLSAob25lRGF5ICogc3RhcnREYXlPZk5leHRZZWFyKSkgdyA9IDE7XHJcbiAgICB9XHJcblx0cmV0dXJuIHc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vbnRoQ2FsZW5kZXIoeWVhciwgbW9udGgsIGl0ZXJhdG9yRm5zKXtcclxuXHJcblx0Ly8gY29uZmlnIHBhc3NlZCBieSBiaW5kaW5nXHJcblx0dmFyIGxhbmcgPSB0aGlzLmxhbmcgfHwgJ2VuJztcclxuXHR2YXIgb25seURheXMgPSB0aGlzLm9ubHlEYXlzO1xyXG5cdHZhciB3ZWVrU3RhcnQgPSB0eXBlb2YgdGhpcy53ZWVrU3RhcnQgPT0gJ3VuZGVmaW5lZCcgPyAxIDogdGhpcy53ZWVrU3RhcnQ7XHJcblx0dmFyIGlzbyA9IHdlZWtTdGFydCA9PSAxO1xyXG5cdHZhciBjZWxscyA9IFtdO1xyXG5cdHZhciBtb250aFN0YXJ0RGF0ZSA9IG5ldyBEYXRlKHllYXIsIG1vbnRoLCAxKTtcdC8vIG1ha2UgYSBkYXRlIG9iamVjdFxyXG5cdHZhciBkYXlPZldlZWsgPSBtb250aFN0YXJ0RGF0ZS5nZXREYXkoKSB8fCAoaXNvID8gNyA6IDApO1x0Ly8gbW9udGggd2VlayBkYXkgZm9yIGRheSAxXHJcblx0dmFyIGN1cnJlbnREYXkgPSB3ZWVrU3RhcnQgLSBkYXlPZldlZWs7IFx0XHQvLyBzdGFydGluZyBwb3NpdGlvbiBvZiBmaXJzdCBkYXkgaW4gdGhlIHdlZWtcclxuXHR2YXIgd2Vla05yID0gZ2V0RGF0ZUluZm8oeWVhciwgbW9udGgsIDEsIGlzbyk7XHQvLyBnZXQgd2VlayBudW1iZXIgb2YgbW9udGggc3RhcnRcclxuXHR2YXIgbWF4RGF5cyA9IGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKTtcdFx0XHQvLyB0b3RhbCBkYXlzIGluIGN1cnJlbnQgbW9udGhcclxuXHR2YXIgbGFzdE1vbnRoTWF4RGF5cyA9IGRheXNJbk1vbnRoKHllYXIsIG1vbnRoIC0gMSk7XHJcblx0dmFyIGN1cnJlbnRNb250aCwgZGF5LCBkYXlCZWZvcmU7XHJcblx0dmFyIGN1cnJlbnRZZWFyID0gZ2V0WWVhcih5ZWFyLCBtb250aCwgd2Vla05yKTtcclxuXHJcblx0dmFyIHJldHVybk9iamVjdCA9IHtcclxuXHRcdG1vbnRoOiBtb250aCxcclxuXHRcdHllYXI6IHllYXIsXHJcblx0XHRkYXlzSW5Nb250aDogbWF4RGF5c1xyXG5cdH07XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgNzsgaSsrKXtcdFx0XHRcdFx0Ly8gNyByb3dzIGluIHRoZSBjYWxlbmRhclxyXG5cdFx0ZGF5QmVmb3JlID0gY3VycmVudERheTtcclxuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgODsgaisrKXtcdFx0XHRcdC8vIDggY29sdW1uczogd2VlayBuciArIDcgZGF5cyBwLyB3ZWVrXHJcblx0XHRcdGlmIChpID4gMCAmJiBqID4gMCkgY3VycmVudERheSsrO1x0XHQvLyBub3QgZmlyc3Qgcm93LCBub3Qgd2VlayBuciBjb2x1bW5cclxuXHJcblx0XHRcdGlmIChjdXJyZW50RGF5ID4gbWF4RGF5cyB8fCBjdXJyZW50RGF5IDwgMSl7IC8vIGRheSBiZWxvbmdzIHRvIHNpYmxpbmcgbW9udGhcclxuXHRcdFx0XHQvLyBjYWxjdWxhdGUgZGF5IGluIHNpYmxpbmcgbW9udGhcclxuXHRcdFx0XHRkYXkgPSBjdXJyZW50RGF5ID4gbWF4RGF5cyA/IGN1cnJlbnREYXkgLSBtYXhEYXlzIDogbGFzdE1vbnRoTWF4RGF5cyArIGN1cnJlbnREYXk7XHJcblx0XHRcdFx0Y3VycmVudE1vbnRoID0gY3VycmVudERheSA+IG1heERheXMgPyBtb250aCArIDEgOiBtb250aCAtIDE7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZGF5ID0gY3VycmVudERheTtcclxuXHRcdFx0XHRjdXJyZW50TW9udGggPSBtb250aDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHR5cGUgPSAoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRpZiAoaiA9PSAwKSByZXR1cm4gJ3dlZWtMYWJlbCc7XHJcblx0XHRcdFx0ZWxzZSBpZiAoaSA9PSAwKSByZXR1cm4gJ2RheUxhYmVsJztcclxuXHRcdFx0XHRlbHNlIGlmIChjdXJyZW50RGF5IDwgMSkgcmV0dXJuICdwcmV2TW9udGgnO1xyXG5cdFx0XHRcdGVsc2UgaWYgKGN1cnJlbnREYXkgPiBtYXhEYXlzKSByZXR1cm4gJ25leHRNb250aCc7XHJcblx0XHRcdFx0ZWxzZSByZXR1cm4gJ21vbnRoRGF5JztcclxuXHRcdFx0fSkoKTtcclxuXHRcdFx0dmFyIGlzRGF5ID0gZGF5QmVmb3JlICE9IGN1cnJlbnREYXkgJiYgaSA+IDA7XHJcblxyXG5cdFx0XHR2YXIgZGF5RGF0YSA9IHtcclxuXHRcdFx0XHRkZXNjOiBpc0RheSA/IGRheSA6IHdlZWtOcixcclxuXHRcdFx0XHR3ZWVrOiB3ZWVrTnIsXHJcblx0XHRcdFx0dHlwZTogdHlwZSxcclxuXHRcdFx0XHRmb3JtYXQ6IGlzbyA/ICdJU08gODYwMScgOiAnVVMnLFxyXG5cdFx0XHRcdGRhdGU6IGlzRGF5ID8gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgY3VycmVudE1vbnRoLCBkYXkpKSA6IGZhbHNlLFxyXG5cdFx0XHRcdHllYXI6IGN1cnJlbnRZZWFyLFxyXG5cdFx0XHRcdGluZGV4OiBjZWxscy5sZW5ndGhcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGlmIChpdGVyYXRvckZucyl7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBpdGVyYXRvckZucyA9PT0gXCJmdW5jdGlvblwiKSBkYXlEYXRhID0gaXRlcmF0b3JGbnMoZGF5RGF0YSwgbGFuZyk7XHJcblx0XHRcdFx0ZWxzZSBpdGVyYXRvckZucy5mb3JFYWNoKGZ1bmN0aW9uKGZuKXtcclxuXHRcdFx0XHRcdGRheURhdGEgPSBmbi5jYWxsKHJldHVybk9iamVjdCwgZGF5RGF0YSwgbGFuZyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG9ubHlEYXlzICYmIGlzRGF5KSBjZWxscy5wdXNoKGRheURhdGEpO1x0Ly8gYWRkIG9ubHkgZGF5c1xyXG5cdFx0XHRlbHNlIGlmICghb25seURheXMpIGNlbGxzLnB1c2goZGF5RGF0YSk7XHQvLyBhZGQgYWxzbyB3ZWVrIG51bWJlcnMgYW5kIGxhYmVsc1xyXG5cdFx0fVxyXG5cdFx0aWYgKGkgPiAwKSB3ZWVrTnIgPSBnZXREYXRlSW5mbyh5ZWFyLCBjdXJyZW50TW9udGgsIGRheSArIDEsIGlzbyk7XHJcblx0XHRjdXJyZW50WWVhciA9IGdldFllYXIoeWVhciwgbW9udGgsIHdlZWtOcik7XHJcblx0fVxyXG5cclxuXHRyZXR1cm5PYmplY3QuY2VsbHMgPSBjZWxscztcclxuXHRyZXR1cm4gcmV0dXJuT2JqZWN0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjb25maWcpe1xyXG5cdHJldHVybiBnZXRNb250aENhbGVuZGVyLmJpbmQoY29uZmlnKTtcclxufVxyXG4iLCJcbm1vZHVsZS5leHBvcnRzID0ge1xuXHR3ZWVrUGxhY2Vob2xkZXI6ICcnLFxuXHRjb2x1bW5OYW1lczoge1xuXHRcdGVuOiB7XG5cdFx0XHQwOiAndycsXG5cdFx0XHQxOiAnbW9uZGF5Jyxcblx0XHRcdDI6ICd0dWVzZGF5Jyxcblx0XHRcdDM6ICd3ZWRuZXNkYXknLFxuXHRcdFx0NDogJ3RodXJzZGF5Jyxcblx0XHRcdDU6ICdmcmlkYXknLFxuXHRcdFx0NjogJ3NhdHVyZGF5Jyxcblx0XHRcdDc6ICdzdW5kYXknXG5cdFx0fSxcblx0XHRzZToge1xuXHRcdFx0MDogJ3YnLFxuXHRcdFx0MTogJ21vbmRhZycsXG5cdFx0XHQyOiAndGlzZGFnJyxcblx0XHRcdDM6ICdvbnNkYWcnLFxuXHRcdFx0NDogJ3RvcnNkYWcnLFxuXHRcdFx0NTogJ2ZyZWRhZycsXG5cdFx0XHQ2OiAnbMO2cmRhZycsXG5cdFx0XHQ3OiAnc8O2bmRhZydcblx0XHR9XG5cdH0sXG5cdG1vbnRoTmFtZXM6IHtcblx0XHRlbjogW1xuXHRcdFx0XCJKYW51YXJ5XCIsXG5cdFx0XHRcIkZlYnJ1YXJ5XCIsXG5cdFx0XHRcIk1hcmNoXCIsXG5cdFx0XHRcIkFwcmlsXCIsXG5cdFx0XHRcIk1heVwiLFxuXHRcdFx0XCJKdW5lXCIsXG5cdFx0XHRcIkp1bHlcIixcblx0XHRcdFwiQXVndXN0XCIsXG5cdFx0XHRcIlNlcHRlbWJlclwiLFxuXHRcdFx0XCJPY3RvYmVyXCIsXG5cdFx0XHRcIk5vdmVtYmVyXCIsXG5cdFx0XHRcIkRlY2VtYmVyXCJcblx0XHRdLFxuXHRcdHNlOiBbXG5cdFx0XHRcImphbnVhcmlcIixcblx0XHRcdFwiZmVicnVhcmlcIixcblx0XHRcdFwibWFyc1wiLFxuXHRcdFx0XCJhcHJpbFwiLFxuXHRcdFx0XCJtYWpcIixcblx0XHRcdFwianVuZVwiLFxuXHRcdFx0XCJqdWxpXCIsXG5cdFx0XHRcImF1Z3VzdGlcIixcblx0XHRcdFwic2VwdGVtYmVyXCIsXG5cdFx0XHRcIm9rdG9iZXJcIixcblx0XHRcdFwibm92ZW1iZXJcIixcblx0XHRcdFwiZGVjZW1iZXJcIlxuXHRcdF1cblx0fSxcblx0Y2xhc3Nlczoge1xuXHRcdGRheUxhYmVsOiAnZGF5LW9mLXdlZWsnLFxuXHRcdHdlZWtMYWJlbDogJ3dlZWstbnVtYmVyJyxcblx0XHRwcmV2TW9udGg6ICdpbmFjdGl2ZScsXG5cdFx0bmV4dE1vbnRoOiAnaW5hY3RpdmUnLFxuXHRcdG1vbnRoRGF5OiAnZGF5LWluLW1vbnRoJ1xuXHR9XG59O1xuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0R2VuZXJhdG9yOiByZXF1aXJlKCcuL3NyYy9qc0NhbGVuZGFyJyksXG5cdGFkZExhYmVsczogcmVxdWlyZSgnLi9zcmMvYWRkTGFiZWxzJylcbn1cbiJdfQ==
