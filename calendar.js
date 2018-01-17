function Calendario(year) {
  this.year = year || new Date().getFullYear();
  this.weekdays = [
    { name: 'Sunday', abbr: 'S', weekend: true },
    { name: 'Monday', abbr: 'M' },
    { name: 'Tuesday', abbr: 'T' },
    { name: 'Wednesday', abbr: 'W' },
    { name: 'Thursday', abbr: 'T' },
    { name: 'Friday', abbr: 'F' },
    { name: 'Saturday', abbr: 'S', weekend: true }
  ];
  this.months = [
    { name: 'January', abbr: 'Jan' },
    { name: 'February', abbr: 'Feb' },
    { name: 'March', abbr: 'Mar' },
    { name: 'April', abbr: 'Apr' },
    { name: 'May', abbr: 'May' },
    { name: 'Jun', abbr: 'Jun' },
    { name: 'July', abbr: 'Jul' },
    { name: 'August', abbr: 'Aug' },
    { name: 'Septermber', abbr: 'Sep' },
    { name: 'October', abbr: 'Oct' },
    { name: 'November', abbr: 'Nov' },
    { name: 'December', abbr: 'Dec' },
  ];
  this.years = {};
  this.range = {};
}

Calendario.prototype.getMonthsFrom = function(year = this.year) {
  let that = this;

  function getFirstAndLastDayOfAMonth(m) {
    let y = year;
    let f = new Date(y, m, 1);
    let l = new Date(y, m + 1, 0);
    return { f, l };
  }

  function monthdays(m) {
    let { f, l } = getFirstAndLastDayOfAMonth(m);
    return (l.getDate() - f.getDate()) + 1
  }

  function getLastDays(m) {
    let { l } = getFirstAndLastDayOfAMonth(m);
    let lastDays = (that.weekdays.length - l.getDay())-1;
    return Array(lastDays).fill(null);
  }

  function filterDaysPerWeek(days) {
    return days.reduce((target, day, index) => {
      if ((index % 7) === 0) {
        target.push(days.slice(index, index+7));
      }
      return target;
    }, []);
  }

  return this.months.reduce((target, month, index) => {
    let { f, l } = getFirstAndLastDayOfAMonth(index);
    let previousDays = (f.getDay() - 0);      // used to know how much days have to be null
    let nextDays = getLastDays(index).length; // used to know how much days have to be null
    let daysTotal = monthdays(index) + previousDays + nextDays;

    let dayCounter = -1; // Used to know what day of the week are we.
    let days = []; // Used to hold the days of a week.

    // On each month we will loop each day:
    for (let i = 0; i<daysTotal; i++) {
      if ((i % 7) === 0) {
        dayCounter = 0;
      } else {
        dayCounter++;
      }
      if (i < previousDays) {
        days.push(null); // previous days before the first day of the month, example: S -> null, M -> null, T -> null, W -> 1, T -> 2 ...
      } else {
        if ((days.length-previousDays) < l.getDate()) { // Days between previous and nextdays:
          let key = ((i-previousDays)+1); // marks each day with 1, 2, 3, 4, 5, 6...
          let source = { key };
          if (key === 1) source.firstday = true; // added flag to know later which is the first day of a week
          if (key === l.getDate()) source.lastday = true; // added flag to know later which is the last day of a week
          let day = Object.assign(source, this.weekdays[dayCounter]); // { key, firstday, lastday, name: 'Sunday', abbr: 'S', weekend: true };
          days.push(day);
        } else {
          days.push(null); // next days after the last day of the month, example: W -> 31, T -> null, F -> null, S -> null
        }
      }
    }

    const source = {
      key: index, // key to know what month is, example: 1 = Jan...
      previousDays,
      nextDays,
      padding: previousDays + nextDays, // If you want to know how many days between the days there are because you could rest this padding to the total of days.
      days: days.filter(day => day && day), // added only the days valid, not the previous and next days.
      weeks: filterDaysPerWeek(days),
      weekdays: this.weekdays, // Added to build the calendar using the abbr, example: S M T W T F S
      year
    }

    target.push(Object.assign(source, month));

    return target;
  }, []);
}
