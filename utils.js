
var sendResponse = function(response, content, headers, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.write(content);
  response.end();
};

var collectData = function(request, callback){
  var data = "";
  request.on('data', function(partial){
    data += partial;
  });

  request.on('end', function(){
    var message = JSON.parse(data);
    callback(message);
  });
};

var nextKey = 0;
var keyGen = function(){
  return nextKey++;
};

exports.sendResponse = sendResponse;
exports.keyGen = keyGen;
exports.collectData = collectData;