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
