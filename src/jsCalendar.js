// calendar with 8 column x 7 rows

const oneDay = 1000 * 60 * 60 * 24;

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getYear(year, month, weekNr) {
  if (month === 0 && weekNr > 50) return year - 1;
  else if (month === 11 && weekNr < 10) return year + 1;
  else return year;
}

function getDateInfo(y, m, d, iso) {
  if (m > 11) {
    m = 0;
    y++;
  }
  const currentDay = new Date(y, m, d);
  if (iso)
    currentDay.setDate(currentDay.getDate() + 4 - (currentDay.getDay() || 7));
  const year = iso ? currentDay.getFullYear() : y;
  const firstOfJanuary = new Date(year, 0, 1);
  let numberOfDays = 1 + Math.round((currentDay - firstOfJanuary) / oneDay);

  if (!iso) numberOfDays += firstOfJanuary.getDay();
  let w = Math.ceil(numberOfDays / 7);
  if (!iso) {
    const initialDay = new Date(y, m, d);
    const beginOfNextYear = new Date(y + 1, 0, 1);
    const startDayOfNextYear = beginOfNextYear.getDay();
    if (
      initialDay.getTime() >=
      beginOfNextYear.getTime() - oneDay * startDayOfNextYear
    )
      w = 1;
  }
  return w;
}

function getMonthCalender(year, month, iteratorFns) {
  // config passed by binding
  const lang = this.lang || "en";
  const onlyDays = this.onlyDays;
  const weekStart = typeof this.weekStart === "undefined" ? 1 : this.weekStart;
  const iso = weekStart === 1;
  const cells = [];
  const monthStartDate = new Date(year, month, 1); // make a date object
  const dayOfWeek = monthStartDate.getDay() || (iso ? 7 : 0); // month week day for day 1
  let currentDay = weekStart - dayOfWeek; // starting position of first day in the week
  let weekNr = getDateInfo(year, month, 1, iso); // get week number of month start
  const maxDays = daysInMonth(year, month); // total days in current month
  const lastMonthMaxDays = daysInMonth(year, month - 1);
  let currentMonth;
  let day;
  let dayBefore;
  let currentYear = getYear(year, month, weekNr);

  const returnObject = {
    month: month,
    year: year,
    daysInMonth: maxDays,
  };

  for (let i = 0; i < 7; i++) {
    // 7 rows in the calendar
    dayBefore = currentDay;
    for (let j = 0; j < 8; j++) {
      // 8 columns: week nr + 7 days p/ week
      if (i > 0 && j > 0) currentDay++; // not first row, not week nr column

      if (currentDay > maxDays || currentDay < 1) {
        // day belongs to sibling month
        // calculate day in sibling month
        day =
          currentDay > maxDays
            ? currentDay - maxDays
            : lastMonthMaxDays + currentDay;
        currentMonth = currentDay > maxDays ? month + 1 : month - 1;
      } else {
        day = currentDay;
        currentMonth = month;
      }

      const type = (function () {
        if (j === 0) return "weekLabel";
        else if (i === 0) return "dayLabel";
        else if (currentDay < 1) return "prevMonth";
        else if (currentDay > maxDays) return "nextMonth";
        else return "monthDay";
      })();
      const isDay = dayBefore !== currentDay && i > 0;

      let dayData = {
        desc: isDay ? day : weekNr,
        week: weekNr,
        type: type,
        format: iso ? "ISO 8601" : "US",
        date: isDay ? new Date(Date.UTC(year, currentMonth, day)) : false,
        year: currentYear,
        index: cells.length,
      };

      if (iteratorFns) {
        if (typeof iteratorFns === "function")
          dayData = iteratorFns.call(returnObject, dayData, lang);
        else
          iteratorFns.forEach(function (fn) {
            dayData = fn.call(returnObject, dayData, lang);
          });
      }
      if (onlyDays && isDay) cells.push(dayData);
      // add only days
      else if (!onlyDays) cells.push(dayData); // add also week numbers and labels
    }
    if (i > 0) weekNr = getDateInfo(year, currentMonth, day + 1, iso);
    currentYear = getYear(year, month, weekNr);
  }

  returnObject.cells = cells;
  return returnObject;
}

module.exports = function (config) {
  return getMonthCalender.bind(config);
};
