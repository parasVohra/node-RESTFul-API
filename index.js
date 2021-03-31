const http = require("http");
const https = require("https");
const { URL } = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");

// Instantiate the HTTP server
const httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

//start the server, and have listen on port 3000
httpServer.listen(config.httpPort, function () {
  console.log(`server is listening on the port ${config.httpPort}`);
});

//Instantiate the HTTPS sever
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log(`server is listening on the port ${config.httpsPort}`);
});

//All the server logic for both http and https server
const unifiedServer = function (req, res) {
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
};

//define the handler
let handlers = {};

//Ping handler
handlers.ping = function (data, callback) {
  callback(200);
};
//handle not found
handlers.notFound = function (data, callback) {
  callback(404);
};

//Hello handler
handlers.hello = function (data, callback) {
  callback(200, { message: "hello world" });
};

const router = {
  ping: handlers.ping,
  hello: handlers.hello,
};
