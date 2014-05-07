
var fs = require('fs');
var handlers = require('./handlers.js').handlers;

var router = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);
  //add check if handlers[request.method] is undefined and return 404
  if(handlers[request.url] && handlers[request.url][request.method]){
    handlers[request.url][request.method](request, response);
  }else{
    //return 404 page
  }
};

exports.router = router;

var routes = {
  "/"                 : "index",
  "/message"          : "messageRouter",
  "/client/client"    : "clients",
};
