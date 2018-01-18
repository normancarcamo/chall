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
  this.selection = {};
  if (year) {
    this.years[year] = this.getMonthsFrom(year);
  }
}

Calendario.prototype.setHolidays = function(month, holidays) {
  // date example = 2017-01-01 or 2017-1-1

  let checkYears = /^(19{1}\d{2}|2{1}\d{3})/;
  var checkMonth = /^(\d{4}\-)(\d{1,2})/;
  let checkDays = /(\d{2}|\d{1})$/g;

  function parseHolidays(holidays) {
    return holidays.reduce((target, holiday) => {
      let dateValid = null;
      if (/\-0/g.test(holiday.date)) { // -0n
        let str = holiday.date.replace(/\-0/g, '-'); // 2017-01-01 -> 2017-1-1
        let y = Number(str.match(checkYears)[0]);
        let m = Number(str.match(checkMonth)[2]);
        let d = Number(str.match(checkDays)[0]);
        dateValid = new Date(y, m, d, 0, 0, 0, 0);
      } else {
        let y = Number(holiday.date.match(checkYears)[0]);
        let m = Number(holiday.date.match(checkMonth)[2]);
        let d = Number(holiday.date.match(checkDays)[0]);
        dateValid = new Date(y, m, d, 0, 0, 0, 0);
      }
      target.push(Object.assign({ parsed: dateValid }, holiday));
      return target;
    }, []);
  }

  const _holidays = parseHolidays(holidays);

  const result = this.getMonthsFrom(this.year)[month].weeks.reduce((target, week, index) => {
    target.push(week.reduce((target, day) => {
      if (day) {
        if (_holidays.length) {
          let filtered = _holidays.filter(holiday => !!(holiday && holiday.parsed.getDate() === day.key));
          if (filtered.length) {
            day.holiday = filtered;
          }
        }
      }
      target.push(day);
      return target;
    }, []));
    return target;
  }, []);

  this.years[this.year][month].weeks = result;

  return this;
}

Calendario.prototype.getFirstAndLastDayOfAMonth = function(m, year = this.year) {
  let y = year;
  let f = new Date(y, m, 1);
  let l = new Date(y, m + 1, 0);
  return { f, l };
}

Calendario.prototype.monthdays = function(m) {
  let { f, l } = this.getFirstAndLastDayOfAMonth(m);
  return (l.getDate() - f.getDate()) + 1
}

Calendario.prototype.getMonthsFrom = function(year = this.year) {
  let that = this;

  function getLastDays(m) {
    let { l } = that.getFirstAndLastDayOfAMonth(m);
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
    let { f, l } = this.getFirstAndLastDayOfAMonth(index);
    let previousDays = (f.getDay() - 0);
    let nextDays = getLastDays(index).length;
    let daysTotal = that.monthdays(index) + previousDays + nextDays;
    let dayCounter = -1;
    let days = [];

    for (let i = 0; i<daysTotal; i++) {
      if ((i % 7) === 0) {
        dayCounter = 0;
      } else {
        dayCounter++;
      }

      if (i < previousDays) {
        days.push(null);
      } else {
        if ((days.length-previousDays) < l.getDate()) {
          let key = ((i-previousDays)+1);
          let source = { key };
          if (key === 1) source.firstday = true;
          if (key === l.getDate()) source.lastday = true;
          source.date = new Date(year, index, key);
          let day = Object.assign(source, this.weekdays[dayCounter]);
          days.push(day);
        } else {
          days.push(null);
        }
      }
    }

    const source = {
      key: index,
      previousDays,
      nextDays,
      padding: previousDays + nextDays,
      days: days.filter(day => day && day),
      weeks: filterDaysPerWeek(days),
      weekdays: this.weekdays,
      year,
    }

    target.push(Object.assign(source, month));

    return target;
  }, []);
}

Calendario.prototype.getResumeOfSelection = function() {
  let resume = Object.keys(this.years).reduce((years, year) => {
    let monthsMarked = this.years[year].reduce((months, month) => {
      if (month.marked) {
        months.push(month.key);
      }
      return months;
    }, []);
    years[year] = monthsMarked;
    return years;
  }, {});

  this.selection.years = resume;
  return resume;
}

Calendario.prototype.markDays = function(_from, _end) {
  let startdate;

  if (/\-0/g.test(_from)) { // -0n
    startdate = new Date(_from.replace(/\-0/g, '-')); // 2017-08-16 -> 2017-8-16
  } else {
    startdate = new Date(_from);
  }

  let that = this;

  function mark({ year, month, start, end, lastYear}) {
    // Increment the year+1 and reset the month to 1:
    if ((month === 12) && (!year[month]) && (end > 0) && (!year[lastYear+1])) {
      that.years[lastYear+1] = that.getMonthsFrom(lastYear+1);
      year = that.years[lastYear+1];
      month = 0;
    }

    let nextDays  = (end-year[month].days.length) > 0 ? (end-year[month].days.length) : 0;

    year[month].weeks.forEach(week => {
      week.forEach(day => {
        if (day && day.key >= start && day.key <end) {
          day.marked = true;
          year[month].marked = true;
          if ((day.key+nextDays) === end) {
            year[month].marked = true;
            mark({ year: year, month: month+1, start: 1, end: nextDays, lastYear: year[0].year });
          }
        }
      });
    });
  }

  mark({
    year  : this.years[startdate.getFullYear()],                           // array
    month : this.years[startdate.getFullYear()][startdate.getMonth()].key, // number
    start : startdate.getDate(),                                           // number
    end   : startdate.getDate()+_end,                                      // number
    limit : startdate.getDate()+_end
  });

  return this.years;
}

Calendario.prototype.betweenYears = function(_from = 2000, _to = this.year) {
  for (let i = _from; i <= _to; i++) {
    this.years[i] = this.getMonthsFrom(i);
  }
  return this.years;
}

if (typeof window !== "undefined") {
  window.Calendario = Calendario;
}
