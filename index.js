const http = require("http");
const { URL } = require("url");

const StringDecoder = require("string_decoder").StringDecoder;

// the server should respond to all request with a string

const server = http.createServer(function (req, res) {
  //get url as an object
  const fullUrl = new URL("http://" + req.headers.host + req.url);

  //get path
  const path = fullUrl.pathname;
  const regex = /^\/|\/$/g;
  const trimmedPath = path.replace(regex, "");

  //Get the query string as an object
  const queryStringObject = fullUrl.searchParams;

  // get the HTTP method
  const method = req.method.toLowerCase();

  //get the headers as an object
  const headers = req.headers;

  //get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    //choose the handler this request should go to. if one is not found use the not found handler
    const chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    //Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    //Route the request to handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      //use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      //Use the payload called back by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // convert the payload to a string

      const payloadString = JSON.stringify(payload);

      //return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      //log  the request
      console.log("Returning this response ", statusCode, payloadString);
    });
  });
});

//start the server, and have listen on port 3000
server.listen(3001, function () {
  console.log("the server is listening on the port 3001");
});

//define the handler
let handlers = {};

handlers.sample = function (data, callback) {
  //callback a http status code and payload object
  callback(406, { name: "sample handler" });
};

handlers.notFound = function (data, callback) {
  callback(404);
};

const router = {
  sample: handlers.sample,
};
