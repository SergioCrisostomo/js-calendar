// calendar with 8 column x 7 rows

function daysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

Date.prototype.getWeek = function () {
	// Create a copy of this date object
	var target  = new Date(this.valueOf());

	// ISO week date weeks start on monday
	// so correct the day number
	var dayNr   = (this.getDay() + 6) % 7;

	// ISO 8601 states that week 1 is the week
	// with the first thursday of that year.
	// Set the target date to the thursday in the target week
	target.setDate(target.getDate() - dayNr + 3);

	// Store the millisecond value of the target date
	var firstThursday = target.valueOf();

	// Set the target to the first thursday of the year
	// First set the target to january first
	target.setMonth(0, 1);
	// Not a thursday? Correct the date to the next thursday
	if (target.getDay() != 4) {
		target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
	}

	// The weeknumber is the number of weeks between the
	// first thursday of the year and the thursday in the target week
	return 1 + Math.ceil((firstThursday - target) / 604800000); // 604800000 = 7 * 24 * 3600 * 1000
}

function getMonthCalender(year, month, iteratorFns){

	// config passed by binding
	var lang = this.lang || 'en';
	var onlyDays = this.onlyDays;
	var weekStart = typeof this.weekStart == 'undefined' ? 1 : this.weekStart;

	var cells = [];
	var monthStartDate = new Date(year, month, 1);	// make a date object
	var dayOfWeek = monthStartDate.getDay() || 7;	// month week day for day 1
	var currentDay = weekStart - dayOfWeek; 		// starting position of first day in the week
	var maxDays = daysInMonth(year, month);			// total days in current month
	var lastMonthMaxDays = daysInMonth(year, month - 1);

	var returnObject = {
		month: month,
		year: year,
		daysInMonth: maxDays
	};

	for (var i = 0; i < 7; i++){					// 7 rows in the calendar
		var dayBefore = currentDay;
		for (var j = 0; j < 8; j++) {				// 8 columns: week nr + 7 days p/ week
			if (i > 0 && j > 0) currentDay++;		// not first row, not week nr column
			var day = currentDay;
			var currentMonth = month;
			var otherMonth = day > maxDays || day < 1;	// day in sibling month
			if (otherMonth) {
				// calculate day in sibling month
				day = day > maxDays ? day - maxDays : lastMonthMaxDays + day;
				currentMonth = currentDay > maxDays ? month + 1 : month - 1;
			}
			var type = (function () {
				if (j == 0) return 'weekLabel';
				else if (i == 0) return 'dayLabel';
				else if (otherMonth && currentDay < 1) return 'prevMonth';
				else if (otherMonth && currentDay > maxDays) return 'nextMonth';
				else return 'monthDay';
			})();
			var weekNr = new Date(year, currentMonth, day).getWeek();
			var isDay = dayBefore != currentDay && i > 0;
			var dayData = {
				desc: isDay ? day : weekNr,
				week: weekNr,
				type: type,
				date: isDay ? new Date(year, currentMonth, day) : false,
				index: onlyDays ? cells.length : i * 8 + j // when onlyDays == true the index is just for days, not the full 55 max
			};
			if (iteratorFns) {
				if (typeof iteratorFns === "function") dayData = iteratorFns(dayData, lang);
				else iteratorFns.forEach(function (fn) {
					dayData = fn.call(returnObject, dayData, lang);
				});
			}
			if (onlyDays && isDay) cells.push(dayData);	// add only days
			else if (!onlyDays) cells.push(dayData);	// add also week numbers and labels
		}
	}

	returnObject.cells = cells;
	return returnObject;
}

module.exports = function (config){
	return getMonthCalender.bind(config);
}
