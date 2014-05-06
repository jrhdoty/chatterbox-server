
var handleRequest = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  // var test = function(request, response){
  //   request.addListener("data", function(data){
  //     console.log(data.toString('utf8'));
  //   });
  // }

  //add check if handlers[request.method] is undefined and return 404
  handlers[request.method](request, response);
};

var handlers = {};

handlers.OPTIONS = function(request, response){
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end("terminating options request")
  };

handlers.GET =  function(request, response){
  var keys = Object.keys(applicationData);
  var results = [];
  console.log(keys.length);
  for( var i = 0; i < keys.length; i++ ){
    results.push(applicationData[keys[i]]);
  }
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  results = JSON.stringify(results);
  console.log(results);
  response.end(results);
};

handlers.POST =  function(request, response){
  var username;
  var message;
  var time;
  var key;
  request.addListener("data", function(data){
    message  = JSON.parse(data.toString());
    text     = message.text;
    username = message.username;
    time     = new Date();
    time     = time.toString();
    key      = keyGen();

    applicationData[key] = {
      objectId : key,
      username : username,
      time     : time,
      text     : text
    };

    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    response.end("terminating options request")
  });
};

var nextKey = 0;
var keyGen = function(){
  return nextKey++;
}

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

exports.handleRequest = handleRequest;
