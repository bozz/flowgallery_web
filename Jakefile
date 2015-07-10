var fs = require("fs");

var releaseFolder = "_release/";

desc('Generate html files');
task('dev', function (params) {
  console.log('Generating html files in DEV mode...');
  processFile('_partials/_index.html', 'index.html');
  console.log("Successfully generated: index.html");
});


desc('Generate production files in _release folder');
task('prod', function (params) {
  console.log('Generating html files in PROD mode...');
  processFile('_partials/_index.html', releaseFolder + 'index.html', 'prod');
});


desc('set default task to "dev"');
task('default', ['dev'], function (params) {
});


var processFile = function(inputFilePath, outputFilePath, mode) {
  var outputFile = fs.readFileSync(inputFilePath, 'utf8');
  if(mode === 'prod') {
    var exec = require('child_process').exec;
    exec('rm -rf _release && mkdir -p _release/js && mkdir _release/css && cp -R css/fonts _release/css/fonts && cp -R images _release/images && cp -R demos _release/demos', function(error, stdout, stderr) {
      if(!error) {
        console.log("...generated: " + releaseFolder);
        console.log("...copied 'images' and 'demos' folders");
        outputFile = processTags(outputFile, mode);
        fs.writeFileSync(outputFilePath, outputFile);
        console.log("finshed.");
      }
    });
  } else {
    outputFile = processTags(outputFile, mode);
    fs.writeFileSync(outputFilePath, outputFile);
  }
};


/**
 * @param {string} inputFile
 * @param {string} mode
 * @returns {string}
 */
var processTags = function(inputFile, mode) {
  var outputFile = inputFile;

  // extract tags
  var regex = /\{\{(.*?)\}\}/g;
  var matches, tags = [];
  while (matches = regex.exec(inputFile)) {
    tags.push(matches[1]);
  }
  //console.log(tags);

  // process tags and replace
  var i, output = "";
  for(i=0; i<tags.length; i++) {
    var segs = tags[i].split(':');
    if(!segs || segs.length < 2) {
      console.error('Error: invalid tag: ', tags[i]);
      continue;
    }
    switch(segs[0]) {
      case 'file':
        outputFile = processFileTag(outputFile, segs[1]);
      break;
      case 'assets':
        outputFile = processAssetTag(outputFile, segs[1], mode);
      break;
      default:
        console.error('Error: invalid tag segment: ', segs[0]);
    }
  }

  return outputFile;
};


var processFileTag = function(inputFile, targetFilePath) {
  // load file specified in tag
  var targetFile = fs.readFileSync(targetFilePath, 'utf8');

  targetFile = processTags(targetFile);

  // replace tag in inputFile
  return inputFile.replace('{{file:' + targetFilePath + '}}', targetFile);
};


var processAssetTag = function(inputFile, assetType, mode) {
  // load _partials/_assets.json (only if not previously loaded)
  var assetConfig = fs.readFileSync('_partials/_assets.json', 'utf8');
  assetConfig = JSON.parse(assetConfig);

  if(!assetConfig[assetType]) {
    console.error('Error: failed loading asset tag: ', assetType, mode);
    return inputFile;
  }

  // generate script or link tags 
  var i, output = "", combined = "";

  // if(assetType === 'javascripts') {
  //   output += "<!-- include jQuery - remote from CDN or get local fallback -->\n";
  //   output += "<script src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'></script>\n";
  //   output += "<script>window.jQuery || document.write('<script src=\"js/jquery-1.7.1.min.js\"><\\/script>')</script>\n";
  // }

  for(i=0; i<assetConfig[assetType].length; i++) {
    if(mode === 'prod') {
      combined += fs.readFileSync(assetConfig[assetType][i], 'utf8');
    } else {
      if(assetType === 'javascripts') {
        output += "<script src='" + assetConfig[assetType][i] + "' type='text/javascript'></script>\n";
      } else if(assetType === 'stylesheets') {
        output += "<link rel='stylesheet' href='" + assetConfig[assetType][i] + "' type='text/css' charset='utf-8' />\n";
      }
    }
  }

  if(mode === 'prod') {
    var targetFile, combinedFile = combined;
    if(assetType === 'javascripts') {
      combinedFile = uglifyFile(combinedFile);
      targetFile = releaseFolder + 'js/script.min.js';
      output += "<script src='js/script.min.js' type='text/javascript'></script>\n";

      // // add piwik code in prod mode
      // output += fs.readFileSync('_partials/_piwik.html', 'utf8');

    } else if(assetType === 'stylesheets') {
      targetFile = releaseFolder + 'css/skin.css';
      output += "<link rel='stylesheet' href='css/skin.css' type='text/css' charset='utf-8' />\n";
    }
    fs.writeFileSync(targetFile, combinedFile);
    console.log("...generated:", targetFile);
  }

  // replace tag in inputFile
  return inputFile.replace('{{assets:' + assetType + '}}', output);
};




desc('Run local dev server');
task('server', ['default'], function (params) {
  var libpath = require('path'),
  http = require("http"),
  fs = require('fs'),
  url = require("url"),
  mime = require('mime');

  var path = ".";
  var port = 8080;

  http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname;
    var filename = libpath.join(path, uri);

    fs.exists(filename, function (exists) {
      if (!exists) {
        response.writeHead(404, {
          "Content-Type": "text/plain"
        });
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) {
        filename += '/index.html';
      }

      fs.readFile(filename, "binary", function (err, file) {
        if (err) {
          response.writeHead(500, {
            "Content-Type": "text/plain"
          });
          response.write(err + "\n");
          response.end();
          return;
        }

        var type = mime.lookup(filename);
        response.writeHead(200, {
          "Content-Type": type
        });
        response.write(file, "binary");
        response.end();
        /*
         *setTimeout(function(){ 
         *  console.log("retrieving: ", filename);
         *  response.write(file, "binary");
         *  response.end();
         *  //console.log(Date.now() - start); 
         *}, 2500);
         */
      });
    });
  }).listen(port);

  console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
});


/*** U T I L S **********************/

// load header file (under /src/header.js) and replace 'Version' and
// 'Date' placeholders
var getHeader = function() {
  var headerData = fs.readFileSync('../src/header.js', 'utf8');
  var versionData = fs.readFileSync('../version.txt', 'utf8');
  headerData = headerData.replace('{{Version}}', trim(versionData));
  headerData = headerData.replace('{{Date}}', '(' + getDate() + ')');
  return headerData;
};

// search through 'file' for the 'marker' and if found
// replace it by the contents of file with same name under /src
var replaceMarkerWithFileContents = function(file, marker) {
  markerFilePath = marker;
  var markerFile = fs.readFileSync(markerFilePath, 'utf8');
  return file.replace('{{' + marker + '}}', markerFile);
};

// use uglify-js module to generate compressed code
var uglifyFile = function(file) {
  var jsp = require("uglify-js").parser;
  var pro = require("uglify-js").uglify;

  var ast = jsp.parse(file); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  var finalCode = pro.gen_code(ast); // compressed code here
  return finalCode;
};

// util method for trimming whitespaces from string
var trim = function(str) {
  return str.replace(/^\s+|\s+$/g,"");
};

// return current date in format 04-JUN-2012
var getDate = function() {
  var d = new Date();
  var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var day = d.getDate();
  if(day < 10) { day = "0" + day; }
  return day + "-" + months[d.getMonth()] + "-" + d.getFullYear();
};



/// DUMP //////////////////////////////////////////////
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var sys = require('util');

var runCommand = function(name, args) {
  /*proc = exec('stylus _stylus --out css --watch', function(error, stdout, stderr) {
    //console.log(error, stdout, stderr);
    sys.print(stdout);
  });*/
  //proc = spawn(name, args);
  proc = spawn('stylus', ['_stylus', '--out', 'css', '--watch']);
  proc.stderr.on('data', function(buffer) { console.log(buffer.toString()); });
  proc.stdout.on('data', function(buffer) { console.log(buffer.toString()); });
  proc.on('exit', function(code) { if(code!==0) { process.exit(1); }});
  //proc.kill();
};
var traverseFileSystem = function (currentPath, pattern) {
  result = [];
  var files = fs.readdirSync(currentPath);
  var i;
  for (i=0; i< files.length; i++) {
    var currentFile = currentPath + '/' + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile()) {
      if(currentFile.match(pattern)) {
        console.log("===", currentFile);
        result.push(currentFile);
      }
    } else if (stats.isDirectory()) {
      result.concat( traverseFileSystem(currentFile, pattern) );
    }
  }
  return result;
};
var contains = function(a, obj) {
  var i = a.length;
  while (i--) {
    if (a[i] === obj) {
      return true;
    }
  }
  return false;
};
//desc('test');
//task('test_child_process_stylus', function (params) {
  //runCommand('stylus', ['_stylus', '--out', 'css']);
//});
