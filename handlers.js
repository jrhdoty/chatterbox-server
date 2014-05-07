var fs           = require('fs');
var utils        = require('./utils.js');
var sendResponse = utils.sendResponse; 
var keyGen       = utils.keyGen;
var collectData  = utils.collectData;

var handlers                 = {};
handlers["/"]                = {};
handlers["/message"]         = {};
handlers["/client/client"]   = {};


handlers["/message"].OPTIONS = function(request, response){
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    sendResponse(response, "terminating options request", headers, 201);
  };

handlers["/message"].GET =  function(request, response){
  console.log(applicationData);
  var keys = Object.keys(applicationData);
  var results = [];
  for( var i = 0; i < keys.length; i++ ){
    results.push(applicationData[keys[i]]);
  }

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  results = JSON.stringify(results);
  sendResponse(response, results, headers, 201);
};


handlers["/message"].POST = function(request, response){
  collectData(request, function(message){
    var key = keyGen();
    applicationData[key] = {
      objectId : key,
      username : message.username,
      time     : new Date().toString(),
      text     : message.text
    };

    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    sendResponse(response, "terminating options request", headers, 201);
  });
};


handlers["/"].GET = function(request, response){
  console.log("GETTING INDEX");
  var headers = {'Content-Type' : "text/html"};
  fs.readFile('./index.html', function(err, html){
    if(err){
      throw err;
    }
    sendResponse(response, html, headers, 201);
  });

};

handlers["/client/client"] = function(request, response){};



//this is our ephemeral data store,
//we are like snapchat but for text!!!!
//we are like snapchat but for elevators
var applicationData = {};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handlers = handlers;
