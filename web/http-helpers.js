var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  var statusCode = 200;

  if(archive.isAcceptableUrl(asset)){
    var filePath = path.join(archive.paths.archivedSites, asset);
    fs.readFile(filePath, function(err, data){
      if(err){
        statusCode = 302;
        filePath = path.join(archive.paths.siteAssets, 'loading.html');
        fs.readFile(filePath, function(err, data){
          callback(data, statusCode);
        });
      } else {
        callback(data, statusCode);
      }
    });
  } else {
    if(asset === '/'){
      asset = 'index.html';
    }
    var filePath = path.join(archive.paths.siteAssets, asset);
    fs.readFile(filePath, function(err, data){
      if(err){
        callback('404', 404);
      } else {
        callback(data, statusCode);
      }
    });
  }
};



// As you progress, keep thinking about what helper functions you can put here!
exports.sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(data);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on('data', function(chunk){
    data += chunk;
  });
  request.on('end', function(){
    callback(data);
  });
};
