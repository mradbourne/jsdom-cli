jsdom-cli
=========

A mini REPL based on jsdom.

    npm install -g jsdom-cli

USAGE
-----

    $ jsdom-cli http://google.com
    > var title = document.title
    undefined
    > title
    Google

API
---

### open(url)

Open a new url

### inject(filename)

Inject javascript. Ex: inject('./jquery.js')

