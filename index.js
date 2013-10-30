var readline = require('readline')
  , jsdom = require('jsdom')
  , vm = require('vm')
  , fs = require('fs')
  , sandbox = {console: console, setTimeout: setTimeout}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

sandbox.open = function(url) {
  jsdom.env(url, function(err, _window) {
    if (err) return console.log(err);
    sandbox.window = _window;
    sandbox.document = _window.document;
  });
};

sandbox.inject = function(file) {
  var text = fs.readFileSync(file, "utf-8");
  sandbox.window.eval(text);
};

var execute = function(code) {
  var script = vm.createScript(code);
  try {
    console.log(script.runInNewContext(sandbox));
  } catch(error) {
    console.log('ERROR: ' + error);
  }
}

var prompt = exports.prompt = function() {
  rl.question("> ", function(line) {
    execute(line);
    prompt();
  }); 
};

if ((sandbox.url = process.argv[2])) {
  sandbox.open(sandbox.url);
}
