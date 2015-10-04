// calendar with 8 column x 7 rows

var options = {
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
		}
	},
	monthNames: {	// not used yet
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
		]
	},
	classes: {
		dayLabel: 'column-name',
		weekLabel: 'week-number',
		prevMonth: 'inactive',
		nextMonth: 'inactive',
		monthDay: 'day-in-month'
	}
};

function mergeOptions(newOptions){
	// todo
}

function addLabels(dayObject, lang){
	if (!lang) lang = 'en';

	dayObject.class = options.classes[dayObject.type];
	if (dayObject.index < 8) dayObject.desc = options.columnNames[lang][dayObject.index];
	else if ((dayObject.index - 1) % 8 == 0) dayObject.desc = dayObject.week;
	return dayObject;
}

module.exports = addLabels;

















//