var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
var _ = require('underscore');


console.log('readListOfUrls:', archive.readListOfUrls());
console.log('isUrlInList:', archive.isUrlInList('www.google.com'));
console.log('isUrlInList:', archive.isUrlInList('/argybargle'));
console.log('addUrlToList:', archive.addUrlToList('noice.herokuapp.com'));
console.log('is noice here?', archive.isUrlInList('noice.herokuapp.com'));
console.log('add unacceptable:', archive.addUrlToList('noice.herokuapp.www'));
console.log('is unacceptable here?', archive.isUrlInList('noice.herokuapp.www'));
console.log('is google archived?', archive.isUrlArchived('www.google.com'));
console.log('is noice archived?', archive.isUrlArchived('noice.herokuapp.com'));
archive.downloadUrls();
console.log('is noice archived?', archive.isUrlArchived('noice.herokuapp.com'));

var actions = {

  'GET': function(req, res){
    helpers.serveAssets(res, req.url, function(data, statusCode){
      helpers.sendResponse(res, data, statusCode);
    });
  },
  'POST': function(req, res){
    helpers.collectData(req, function(url){
      url = url.split('=').pop();
      archive.addUrlToList(url);
      res.setHeader('Location', url)
      helpers.sendResponse(res, url, 302);
    });
  },
  'OPTIONS': function(req, res){
    helpers.sendResponse(res, '');
  }
}

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if( action ){
    action(req, res);
  } else {
    utils.sendResponse(res, "Not Found", 404);
  }
  // console.log(req.url);
  // if(req.url === '/'){
  //   req.url = '/index.html';
  // }

  // var statusCode = 200;
  // var indexFile = '';
  // if(archive.isUrlArchived(req.url)) {
  //   indexFile = fs.readFileSync(indexPath);
  // } else {
  //   indexPath = path.join(archive.paths.archivedSites, req.url);
  //   if(fs.existsSync(indexPath)) {
  //     indexFile = fs.readFileSync(indexPath);
  //   } else {
  //     indexPath = path.join(archive.paths.siteAssets, 'loading.html')
  //     indexFile = fs.readFileSync(indexPath);
  //     // fs.appendFile(archive.paths.list, req.url + '\n', function(err) {
  //     //   if (err) throw err;
  //     //   console.log('Added ' + req.url +' to sites.txt');
  //     // })
  //   }
  //   //Look for it in sites.txt
  //   //if not in sites add it
  //   //else return archives/sites/sitename
  // }
  // helpers.sendResponse(res, indexFile, statusCode);
};
