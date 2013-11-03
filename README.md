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

### edit()

Edit the DOM with the default HTML editor and reload it

### inspect()

Inspect and navigate the DOM like in the browsers dev tools



