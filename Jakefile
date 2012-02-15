var fs = require("fs");


desc('Generate html files');
task('default', function (params) {
  console.log('Generating html files...');

  var file = fs.readFileSync('_partials/_index.html', 'utf8');

  file = replaceMarkerWithFileContents(file, '_partials/_documentation.html');
  file = replaceMarkerWithFileContents(file, 'demos/_default_settings.html');
  file = replaceMarkerWithFileContents(file, '_partials/_scripts.html');

  var outputFile = 'index.html';
  fs.writeFileSync(outputFile, file);
  console.log("Successfully generated: " + outputFile);

  //file = header + uglifyFile(file);
  //var compressedFile = '../release/jquery.flowgallery.min.js';
  //fs.writeFileSync(compressedFile, file);
  //console.log("Successfully generated: " + compressedFile);
});


desc('Run local dev server');
task('server', function (params) {
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

    libpath.exists(filename, function (exists) {
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



//////////////////////////////////////////////////
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

desc('test');
task('test_child_process_stylus', function (params) {
  runCommand('stylus', ['_stylus', '--out', 'css']);
});
