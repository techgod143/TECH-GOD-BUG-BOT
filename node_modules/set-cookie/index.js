var cookie = require('cookie');
var setter = require('./lib/setter');

module.exports = function setCookie(name, value, options) {
  var cookieStr = cookie.serialize(name, value, options);
  setter(cookieStr, options);
};
