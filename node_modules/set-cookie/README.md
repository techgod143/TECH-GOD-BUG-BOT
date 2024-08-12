set-cookie
==========

Set a cookie using the same API on both the client and the server.

The `set-cookie` module exports a function, `setCookie`. It takes two required arguments
and one optional argument:

```js
setCookie(cookieName, cookieValue, options);
```

## `cookieName`
### *String*

The name of the cookie.

## `cookieValue`
### *String*

The value of the cookie.

## `options` (optional)
### *Object*

Options, such as `path`, `expires`, `domain`. Under the hood, `set-cookie`
uses the [`cookie`](https://github.com/defunctzombie/node-cookie) module
to serialize the cookie metadata into a string. Check out that project for the
full list of options.

There is also one special option, `res`, which must be passed in when using
`set-cookie` from Node. It is an instance of
[`http.ServerResponse`](http://nodejs.org/api/http.html#http_class_http_serverresponse),
which can come from a simple `http` server or can be a Connect or Express response.


# Usage

## Node

In Node, you must pass `res` as an option in the third argument.

```js
var setCookie = require('set-cookie');

// In, for example, an Express middleware.
app.use(function(req, res, next) {
  setCookie('myCookie', 'the value of the cookie', {
    domain: '.example.org',
    res: res
  });
  next();
});
```

This would set the following HTTP header:

    Set-Cookie: myCookie=the%20value%20of%20the%20cookie; Domain=.example.org

## Browser

You can use a tool like [Browserify](http://browserify.org) to package up `set-cookie`,
which uses the CommonJS module format, for use by a browser.

```js
var setCookie = require('set-cookie');

setCookie('myCookie', 'the value of the cookie', {
  domain: '.example.org'
});
```

This would mutate `document.cookie` behind the scenes:

```js
document.cookie = 'myCookie=the%20value%20of%20the%20cookie; Domain=.example.org'
```

# License
MIT

