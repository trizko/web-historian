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

exports.readListOfUrls = function(){
  return fs.readFileSync(exports.paths.list).toString().split('\n');
};

exports.isUrlInList = function(url){
  var listUrl = exports.readListOfUrls();
  if(_.indexOf(listUrl, url) > -1){
    return true;
  }
  return false;
};

exports.addUrlToList = function(url){
  if(!exports.isUrlInList(url) && exports.isAcceptableUrl(url)){
    fs.appendFile(exports.paths.list, url + '\n',function(err) {
      if (err) throw err;
      console.log('Added ' + url +' to sites.txt');
    });
  }
};

exports.isUrlArchived = function(url){
  var urlPath = path.join(exports.paths.archivedSites, url);
  return fs.existsSync(urlPath);
};

exports.downloadUrls = function(){
  var listUrl = exports.readListOfUrls();
  _.each(listUrl, function(url, index, collection){
    if(!exports.isUrlArchived(url)){
      var fullPath = path.join(exports.paths.archivedSites, url);

      http.get({
          url: url,
          progress: function (current, total) {
            console.log('downloaded %d bytes from %d', current, total);
          }
        }, fullPath, function (err, res) {
          if (err) {
            fs.appendFile('log.txt', err, function(err){
              if (err) throw err;
            });
            return;
          }
        fs.appendFile('log.txt', res.code + '\n' + res.headers + '\n' + res.file, function(err){
          if (err) throw err;
        });
      });
    }
  });
};
