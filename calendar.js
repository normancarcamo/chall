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

Calendario.prototype.getFirstAndLastDayOfAMonth = function(m) {
  let y = this.year;
  let f = new Date(y, m, 1);
  let l = new Date(y, m + 1, 0);
  return { f, l };
}

Calendario.prototype.monthdays = function(m) {
  let { f, l } = this.getFirstAndLastDayOfAMonth(m);
  return (l.getDate() - f.getDate()) + 1
}

Calendario.prototype.getLastDays = function(m) {
  let { l } = this.getFirstAndLastDayOfAMonth(m);
  let lastDays = (this.weekdays.length - l.getDay())-1;
  return Array(lastDays).fill(null); // array because later we will use it and it's better cause it also give us the length.
}
