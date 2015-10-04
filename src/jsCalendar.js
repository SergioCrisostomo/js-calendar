// calendar with 8 column x 7 rows

function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getWeekNumber(day) {
    // http://jsfiddle.net/ormfm5o8/ testing
    var d = new Date(+day);
    d.setHours(0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    var yearStart = new Date(d.getFullYear(), 0, 1);
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return {
        y: day.getFullYear(),
        m: day.getMonth() + 1,
        d: day.getDate(),
        w: weekNo
    };
}

function getMonthCalender(year, month, iteratorFn, weekStart){
	if (typeof weekStart == 'undefined') weekStart = 1;
	var cells = [];
	var monthStartDate = new Date(year, month, 1);	// make a date object
	var dayOfWeek = monthStartDate.getDay() || 7;	// month week day for day 1
	var currentDay = weekStart - dayOfWeek; // starting position of first day in the week
	var weekNr = getWeekNumber(monthStartDate).w;	// get week number of month start
	var maxDays = daysInMonth(year, month);			// total days in current month
	var lastMonthMaxDays = daysInMonth(year, month - 1);

	for (var i = 0; i < 7; i++) {					// 7 rows in the calendar
		var dayBefore = currentDay;
		for (var j = 0; j < 8; j++) {				// 8 columns: week nr + 7 days p/ week
			if (i > 0 && j > 0) currentDay++;		// not first row, not week nr column
			var day = currentDay;
			var currentMonth = month;
			var otherMonth = day > maxDays || day < 1;	// day in sibling month
			if (otherMonth){
					// calculate day in sibling month
					day = day > maxDays ? day - maxDays : lastMonthMaxDays + day;
					currentMonth = day > maxDays ? month + 1 : month - 1;
			}
			var type = (function(){
				if (j == 0) return 'weekLabel';
				else if (i == 0) return 'dayLabel';
				else if (otherMonth && currentDay < 1) return 'prevMonth';
				else if (otherMonth && currentDay > maxDays) return 'nextMonth';
				else return 'monthDay';
			})();
			var dayData = {
				day: dayBefore == currentDay ? false : day,
				week: weekNr,
				type: type,
				date: dayBefore == currentDay ? false : new Date(year, currentMonth, day)
			};
			if (iteratorFn) dayData = iteratorFn(dayData);
			cells.push(dayData);					// add data to export
			if (j == 0 && i > 0) weekNr++;			// welcome to next week
		}
	}
	return {
		month: month,
		year: year,
		cells: cells,
		daysInMonth: maxDays
	};
}

module.exports = getMonthCalender;
















//