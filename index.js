var readline = require('readline')
  , jsdom = require('jsdom')
  , vm = require('vm')
  , fs = require('fs')
  , sandbox = {console: console, setTimeout: setTimeout, src: [], 
               jQueryify: function(){jsdom.jQueryify(sandbox.window)}}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

sandbox.open = function(url) {
  jsdom.env({
    url: url, 
    src: sandbox.src,
    done: function(err, _window) {
      if (err) return console.log(err);
      sandbox.window = _window;
      sandbox.document = _window.document;
    }
  });
};

sandbox.inject = function(file) {
  var features = sandbox.window.document.implementation._features;
  sandbox.window.document.implementation.addFeature('FetchExternalResources', ['script']);
  sandbox.window.document.implementation.addFeature('ProcessExternalResources', ['script']);
  sandbox.window.document.implementation.addFeature('MutationEvents', ['2.0']);
  var script = sandbox.window.document.createElement('script');
  script.onload = function() {
    sandbox.window.document.implementation._features = features;
  };
  script.text = fs.readFileSync(file, "utf-8");
  sandbox.window.document.body.appendChild(script);
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

for (var i = 3; i < process.argv.length; i++)
  sandbox.src.push(fs.readFileSync(process.argv[i], "utf-8"));

if ((sandbox.url = process.argv[2])) {
  sandbox.open(sandbox.url);
}
