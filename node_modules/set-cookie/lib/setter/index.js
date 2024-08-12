/**
 * Cookie setter for Node.js environment.
 */

module.exports = function setter(cookieStr, options) {
  var res = options && options.res;
  if (!res) throw new Error('Must specify `res` when setting cookie.');
  res.setHeader('Set-Cookie', cookieStr);
};
