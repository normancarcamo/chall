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

  return this.months.reduce((target, month, index) => {
    let { f, l } = getFirstAndLastDayOfAMonth(index);
    let previousDays = (f.getDay() - 0);      // used to know how much days have to be null
    let nextDays = getLastDays(index).length; // used to know how much days have to be null
    let daysTotal = monthdays(index) + previousDays + nextDays;

    console.log('---------------------------------------------------------------');
    console.log('Index:', index);
    console.log('First day:', f);
    console.log('Last day:', l);
    console.log('Previous days of a month:', previousDays);
    console.log('Next days of a month:', nextDays);
    console.log('Total days of a month: (+prev+next)', daysTotal);

    let dayCounter = -1; // Used to know what day of the week are we.
    let days = []; // Used to hold the days of a week.

    // On each month we will loop each day:
    for (let i = 0; i<daysTotal; i++) {
      if ((i % 7) === 0) {
        dayCounter = 0;
        console.log('Last day of a week ->', dayCounter);
      } else {
        dayCounter++;
        console.log('DOWN Day ->', dayCounter);
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

      console.log('previous days + weekdays:', days);
    }

    target.push({ days: days });

    console.log('--');
    return target;
  }, []);
}
