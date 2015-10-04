#js-calendar

A JavaScript calendar days generator for datepickers and apps where weekdays are needed.

---

## install

    npm install js-calendar --save

## syntax:

	var january = jsCalendar(year, month, iteratorFn, weekStart);

#### arguments:

1. year - the year
2. month - the month
3. iteratorFn - a function to be used on each day, receives a object with:
	- (_day_) the current generated day
	- (_week_) the number of the week in the year
	- (_date_) a Date object for that day

4. weekStart - the starting day of the week. Can be `0` for sunday or `1` for monday. When not specified it will default to `1`;


#### returns:

* (*object*) O object with keys:

	* (*month*) The generated month.
	* (*year*) The generated year.
	* (*days*) A array with objects as passed to the iterator function above.

#### examples:


	jsCalendar = require('js-calendar');
	var january = jsCalendar(2016, 7);

## testing

js-calendar uses [mocha](http://mochajs.org/). To run the tests do in your command line:

    npm install
	npm test

## todo:

	- add more tests
	- add usefull iterator function for standard uses
	- add more examples like jade compiler or some other use case
	




