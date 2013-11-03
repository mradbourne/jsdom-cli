var readline = require('readline');
var jsdom = require('jsdom');
var vm = require('vm');
var fs = require('fs');
var child_process = require('child_process');
var inspector = require('jsdom-inspector');

var src;
var stopExecution = false;
var sandbox = {console: console, setTimeout: setTimeout, require: require,
               jQueryify: function(){jsdom.jQueryify(sandbox.window)}};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// replace original logger with an html logger
console.originalLog = console.log;
console.log = function(object) {
  if (typeof object === 'object' && object.length && object[0].outerHTML)
    for(var i = 0; i < object.length; i++)
      console.originalLog(object[i].outerHTML);
  else if (typeof object === 'object' && object.outerHTML)
    console.originalLog(object.outerHTML)
  else
    console.originalLog(object)
}

sandbox.open = function(data) {
  stopExecution = true;

  jsdom.env(data, {src: src}, function(err, _window){
      if (err) console.log(err);
      sandbox.window = _window;
      sandbox.document = _window.document;
      prompt();
  });
};

sandbox.edit = function() {
  stopExecution = true;

  Number.MAX_INT= Math.pow(2,53);
  var file = process.env.TMPDIR+ (Number.MAX_INT * Math.random()).toString(36)+ '.html';

  fs.writeFile(file, sandbox.document.outerHTML, function() {
    child_process.spawn('open', ['-F', '-W', '-a', 'Sublime Text', file]).on('exit', onExit);

    function onExit () {
      console.log('exit');
      var html = fs.readFileSync(file).toString('utf8');
      sandbox.open(html);
    }
  });
}

sandbox.inspect = function() {
  stopExecution = true;
  rl.close();

  inspector(sandbox.window.document, function() {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    prompt();
  })
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
};

var prompt = exports.prompt = function() {
  stopExecution = false;
  rl.question("> ", function(line) {
    execute(line);
    stopExecution || prompt();
  }); 
};

for (var i = 3; i < process.argv.length; i++)
  sandbox.src.push(fs.readFileSync(process.argv[i], "utf-8"));

if ((sandbox.url = process.argv[2])) {
  sandbox.open(sandbox.url);
} else 
  prompt();
