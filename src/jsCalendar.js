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
        m: day.getMonth(),
        d: day.getDate(),
        w: weekNo
    };
}

function getMonthCalender(year, month, iteratorFns, onlyDays, weekStart){
	if (typeof weekStart == 'undefined') weekStart = 1;
	var cells = [];
	var monthStartDate = new Date(year, month, 1);	// make a date object
	var dayOfWeek = monthStartDate.getDay() || 7;	// month week day for day 1
	var currentDay = weekStart - dayOfWeek; 		// starting position of first day in the week
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
					currentMonth = currentDay > maxDays ? month + 1 : month - 1;
			}
			var type = (function(){
				if (j == 0) return 'weekLabel';
				else if (i == 0) return 'dayLabel';
				else if (otherMonth && currentDay < 1) return 'prevMonth';
				else if (otherMonth && currentDay > maxDays) return 'nextMonth';
				else return 'monthDay';
			})();
			var isDay = dayBefore != currentDay && i > 0;
			var dayData = {
				desc: isDay ? day : weekNr,
				week: weekNr,
				type: type,
				date: isDay ? new Date(year, currentMonth, day) : false,
				index: onlyDays ? cells.length : i * 8 + j // when onlyDays == true the index is just for days, not the full 55 max
			};
			if (iteratorFns){
				if (typeof iteratorFns === "function") dayData = iteratorFns(dayData);
				else iteratorFns.forEach(function(fn){
					dayData = fn(dayData);
				});
			}
			if (onlyDays && isDay) cells.push(dayData);	// add only days
			else if (!onlyDays) cells.push(dayData);	// add also week numbers and labels
			if (j == 7 && i > 0) weekNr++;				// welcome to next week
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
