class mathops{

  // Addition
  add(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    var _z = _x + _y;
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }
  
  // Subtraction
  sub(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    var _z = _x - _y;
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }

  // Multiplication
  mul(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    var _z = _x * _y;
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }

  // Division
  div(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    var _z = _x / _y;
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }

  // Percentage
  percent_value(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    var _z = _x * (_y / 100);
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }

  percent_ratio(x, y) {
    const _x = parseFloat(x);
    const _y = parseFloat(y);
    if(_y == 0){
      return '0.00';  
    }
    var _z = (_y  / _x) * 100;
    _z = parseFloat(_z.toFixed(2));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 2);
    const result = z[0] + '.' + z[1];
    return result;
  }

  // String to 10^y Big Integer
  bigint(x, y = 0) {
    const _x = parseFloat(x);
    var _z = _x * Math.pow(10, y);
    return _z;
  }
  
  // 10^y Big Integer to Sttring
  bigint_str(x, y = 0) {
    var _z = x / Math.pow(10, y);
    _z = parseFloat(_z.toFixed(7));
    var z = _z.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '000000').substring(0, 7);
    const result = z[0] + '.' + z[1];
    return result;
  }
  
  // y is decimal number
  float_str(x, y = 2) {
    var z = x.toString().split('.');
    if(typeof z[1] == 'undefined'){
      z[1] = '0';
    }
    z[1] = (z[1] + '0'.repeat(y)).substring(0, y);
    const result = z[0] + '.' + z[1];
    return result;
  }

  // days to now - dateString = YYYYMMDD
  count_days(dateString) {
    const year = dateString.substring(0,4);
    const month = dateString.substring(4,6);
    const day = dateString.substring(6,8);
    const firstDate = new Date(year, month-1, day);
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round((currentDate - firstDate) / oneDay);
    return diffDays;
  }

}

module.exports = new mathops();
