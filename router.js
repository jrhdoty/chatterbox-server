
var fs       = require('fs');
var urlParse = require('url');
var handlers = require('./handlers.js').handlers;

var router = function(request, response) {


  var url = urlParse.parse(request.url);
  console.log("Serving request type " + request.method + " for url " + request.url +" pathname is ", url.pathname);

  if(handlers[""+url.pathname] && handlers[""+url.pathname][request.method]){
    handlers[""+url.pathname][request.method](request, response);
  }else if (url.pathname.slice(0, 14) === "/client/client") {
    handlers["/client/client"][request.method](request, response);
  }
    else{
      //return 404 page
    }
};

exports.router = router;

// var routes = {
//   "/"                 : "index",
//   "/message"          : "messageRouter",
//   "/client/client"    : "clients",
// };
