/**
 * Cookie setter for browser environment.
 */

module.exports = function setter(cookieStr, _) {
  document.cookie = cookieStr;
};
