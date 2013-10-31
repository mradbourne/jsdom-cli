jsdom-cli
=========

A mini REPL based on jsdom.

    npm install -g jsdom-cli

USAGE
-----

`jsdom-cli http://example.com` or just `jsdom-cli`

API
---

### open(url)

Open a new url `> open("http://google.com")`

### inject(filename)

Inject javascript. `> inject("./lib/underscore.js")`

### jQueryify()

Inject the lastest version of jquery

    > jQueryfiy()
    undefined
    > window.jQuery
    ...



