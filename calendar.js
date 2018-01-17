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
        days.push(null);
      }

      console.log('previous days:', days);
    }

    target.push({ days: days });

    console.log('--');
    return target;
  }, []);
}
