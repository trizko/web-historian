var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

exports.acceptableEXT = ['.com', '.io', '.org', '.net'];

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.isAcceptableUrl = function(url){
  return _.contains(exports.acceptableEXT, path.extname(url));
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, function (err, data){
    if (err) throw err;
    data = data.toString().split('\n');
    callback(data);
  });
};

exports.ifUrlNotInList = function(url, callback){
  exports.readListOfUrls(function(listUrl){
    if(_.indexOf(listUrl, url) === -1){
      callback(url);
    }
  });
};

exports.addUrlToList = function(url){
  if(exports.isAcceptableUrl(url)){
    exports.ifUrlNotInList(url, function(url){
      fs.appendFile(exports.paths.list, url + '\n',function(err) {
        if (err) throw err;
        console.log('Added ' + url +' to sites.txt');
      });
    })
  }
};

exports.ifUrlArchived = function(url, callback){
  var urlPath = path.join(exports.paths.archivedSites, url);
  fs.exists(urlPath, function(exists){
    if(exists){
      callback(urlPath);
    }
  });
};

exports.ifUrlNotArchived = function(url, callback){
  var urlPath = path.join(exports.paths.archivedSites, url);
  fs.exists(urlPath, function(exists){
    if(!exists){
      callback(urlPath);
    }
  });
};

exports.downloadUrls = function(){
  exports.readListOfUrls(function(listUrls){
    _.each(listUrls, function(url, index, collection){
      exports.ifUrlNotArchived(url, function(urlPath){
        http.get(
          { url: url },
          urlPath,
          function (err, res) {
            if (err) {
              fs.appendFile(urlPath, 'not noice', function(err){
                if (err) throw err;
              });
              fs.appendFile('/Users/student/Desktop/2014-10-web-historian/log.txt', url + ': ' + err + '\n', function(err){
                if (err) throw err;
              });
              return;
            }
            fs.appendFile('/Users/student/Desktop/2014-10-web-historian/log.txt', res.code + '\n' + res.headers + '\n' + res.file, function(err){
              if (err) throw err;
            });
          }
        );
      });
    });
  });
};
