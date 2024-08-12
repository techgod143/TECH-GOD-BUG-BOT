(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var cookie = require('cookie');
var setter = require('./lib/setter');

module.exports = function setCookie(name, value, options) {
  var cookieStr = cookie.serialize(name, value, options);
  setter(cookieStr, options);
};

},{"./lib/setter":2,"cookie":3}],2:[function(require,module,exports){
/**
 * Cookie setter for browser environment.
 */

module.exports = function setter(cookieStr, _) {
  document.cookie = cookieStr;
};

},{}],3:[function(require,module,exports){

/// Serialize the a name value pair into a cookie string suitable for
/// http headers. An optional options object specified cookie parameters
///
/// serialize('foo', 'bar', { httpOnly: true })
///   => "foo=bar; httpOnly"
///
/// @param {String} name
/// @param {String} val
/// @param {Object} options
/// @return {String}
var serialize = function(name, val, opt){
    opt = opt || {};
    var enc = opt.encode || encode;
    var pairs = [name + '=' + enc(val)];

    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
        pairs.push('Max-Age=' + maxAge);
    }

    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.httpOnly) pairs.push('HttpOnly');
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
};

/// Parse the given cookie header string into an object
/// The object has the various cookies as keys(names) => values
/// @param {String} str
/// @return {Object}
var parse = function(str, opt) {
    opt = opt || {};
    var obj = {}
    var pairs = str.split(/; */);
    var dec = opt.decode || decode;

    pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf('=')

        // skip things that don't look like key=value
        if (eq_idx < 0) {
            return;
        }

        var key = pair.substr(0, eq_idx).trim()
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' == val[0]) {
            val = val.slice(1, -1);
        }

        // only assign once
        if (undefined == obj[key]) {
            try {
                obj[key] = dec(val);
            } catch (e) {
                obj[key] = val;
            }
        }
    });

    return obj;
};

var encode = encodeURIComponent;
var decode = decodeURIComponent;

module.exports.serialize = serialize;
module.exports.parse = parse;

},{}],4:[function(require,module,exports){
var setCookie = require('../../');

setCookie('thisIsA', 'cookie in a browser!', {
  expires: new Date(2020, 1, 1)
});

console.log(document.cookie);

},{"../../":1}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvc3Bpa2UvY29kZS9zZXQtY29va2llL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvc3Bpa2UvY29kZS9zZXQtY29va2llL2luZGV4LmpzIiwiL1VzZXJzL3NwaWtlL2NvZGUvc2V0LWNvb2tpZS9saWIvc2V0dGVyL2NsaWVudC5qcyIsIi9Vc2Vycy9zcGlrZS9jb2RlL3NldC1jb29raWUvbm9kZV9tb2R1bGVzL2Nvb2tpZS9pbmRleC5qcyIsIi9Vc2Vycy9zcGlrZS9jb2RlL3NldC1jb29raWUvdGVzdC9icm93c2VyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29va2llID0gcmVxdWlyZSgnY29va2llJyk7XG52YXIgc2V0dGVyID0gcmVxdWlyZSgnLi9saWIvc2V0dGVyJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIHZhciBjb29raWVTdHIgPSBjb29raWUuc2VyaWFsaXplKG5hbWUsIHZhbHVlLCBvcHRpb25zKTtcbiAgc2V0dGVyKGNvb2tpZVN0ciwgb3B0aW9ucyk7XG59O1xuIiwiLyoqXG4gKiBDb29raWUgc2V0dGVyIGZvciBicm93c2VyIGVudmlyb25tZW50LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2V0dGVyKGNvb2tpZVN0ciwgXykge1xuICBkb2N1bWVudC5jb29raWUgPSBjb29raWVTdHI7XG59O1xuIiwiXG4vLy8gU2VyaWFsaXplIHRoZSBhIG5hbWUgdmFsdWUgcGFpciBpbnRvIGEgY29va2llIHN0cmluZyBzdWl0YWJsZSBmb3Jcbi8vLyBodHRwIGhlYWRlcnMuIEFuIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHNwZWNpZmllZCBjb29raWUgcGFyYW1ldGVyc1xuLy8vXG4vLy8gc2VyaWFsaXplKCdmb28nLCAnYmFyJywgeyBodHRwT25seTogdHJ1ZSB9KVxuLy8vICAgPT4gXCJmb289YmFyOyBodHRwT25seVwiXG4vLy9cbi8vLyBAcGFyYW0ge1N0cmluZ30gbmFtZVxuLy8vIEBwYXJhbSB7U3RyaW5nfSB2YWxcbi8vLyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuLy8vIEByZXR1cm4ge1N0cmluZ31cbnZhciBzZXJpYWxpemUgPSBmdW5jdGlvbihuYW1lLCB2YWwsIG9wdCl7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIHZhciBlbmMgPSBvcHQuZW5jb2RlIHx8IGVuY29kZTtcbiAgICB2YXIgcGFpcnMgPSBbbmFtZSArICc9JyArIGVuYyh2YWwpXTtcblxuICAgIGlmIChudWxsICE9IG9wdC5tYXhBZ2UpIHtcbiAgICAgICAgdmFyIG1heEFnZSA9IG9wdC5tYXhBZ2UgLSAwO1xuICAgICAgICBpZiAoaXNOYU4obWF4QWdlKSkgdGhyb3cgbmV3IEVycm9yKCdtYXhBZ2Ugc2hvdWxkIGJlIGEgTnVtYmVyJyk7XG4gICAgICAgIHBhaXJzLnB1c2goJ01heC1BZ2U9JyArIG1heEFnZSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdC5kb21haW4pIHBhaXJzLnB1c2goJ0RvbWFpbj0nICsgb3B0LmRvbWFpbik7XG4gICAgaWYgKG9wdC5wYXRoKSBwYWlycy5wdXNoKCdQYXRoPScgKyBvcHQucGF0aCk7XG4gICAgaWYgKG9wdC5leHBpcmVzKSBwYWlycy5wdXNoKCdFeHBpcmVzPScgKyBvcHQuZXhwaXJlcy50b1VUQ1N0cmluZygpKTtcbiAgICBpZiAob3B0Lmh0dHBPbmx5KSBwYWlycy5wdXNoKCdIdHRwT25seScpO1xuICAgIGlmIChvcHQuc2VjdXJlKSBwYWlycy5wdXNoKCdTZWN1cmUnKTtcblxuICAgIHJldHVybiBwYWlycy5qb2luKCc7ICcpO1xufTtcblxuLy8vIFBhcnNlIHRoZSBnaXZlbiBjb29raWUgaGVhZGVyIHN0cmluZyBpbnRvIGFuIG9iamVjdFxuLy8vIFRoZSBvYmplY3QgaGFzIHRoZSB2YXJpb3VzIGNvb2tpZXMgYXMga2V5cyhuYW1lcykgPT4gdmFsdWVzXG4vLy8gQHBhcmFtIHtTdHJpbmd9IHN0clxuLy8vIEByZXR1cm4ge09iamVjdH1cbnZhciBwYXJzZSA9IGZ1bmN0aW9uKHN0ciwgb3B0KSB7XG4gICAgb3B0ID0gb3B0IHx8IHt9O1xuICAgIHZhciBvYmogPSB7fVxuICAgIHZhciBwYWlycyA9IHN0ci5zcGxpdCgvOyAqLyk7XG4gICAgdmFyIGRlYyA9IG9wdC5kZWNvZGUgfHwgZGVjb2RlO1xuXG4gICAgcGFpcnMuZm9yRWFjaChmdW5jdGlvbihwYWlyKSB7XG4gICAgICAgIHZhciBlcV9pZHggPSBwYWlyLmluZGV4T2YoJz0nKVxuXG4gICAgICAgIC8vIHNraXAgdGhpbmdzIHRoYXQgZG9uJ3QgbG9vayBsaWtlIGtleT12YWx1ZVxuICAgICAgICBpZiAoZXFfaWR4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGtleSA9IHBhaXIuc3Vic3RyKDAsIGVxX2lkeCkudHJpbSgpXG4gICAgICAgIHZhciB2YWwgPSBwYWlyLnN1YnN0cigrK2VxX2lkeCwgcGFpci5sZW5ndGgpLnRyaW0oKTtcblxuICAgICAgICAvLyBxdW90ZWQgdmFsdWVzXG4gICAgICAgIGlmICgnXCInID09IHZhbFswXSkge1xuICAgICAgICAgICAgdmFsID0gdmFsLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgYXNzaWduIG9uY2VcbiAgICAgICAgaWYgKHVuZGVmaW5lZCA9PSBvYmpba2V5XSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGRlYyh2YWwpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDtcbnZhciBkZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG5cbm1vZHVsZS5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcbm1vZHVsZS5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG4iLCJ2YXIgc2V0Q29va2llID0gcmVxdWlyZSgnLi4vLi4vJyk7XG5cbnNldENvb2tpZSgndGhpc0lzQScsICdjb29raWUgaW4gYSBicm93c2VyIScsIHtcbiAgZXhwaXJlczogbmV3IERhdGUoMjAyMCwgMSwgMSlcbn0pO1xuXG5jb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xuIl19
