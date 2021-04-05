/**
 * Primary file for servers
 */

// Dependencies
const http = require("http");
const https = require("https");
const { URL } = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const fs = require("fs");
const handlers = require("./handlers");
const helpers = require("./helpers");
const QueryString = require("querystring");
const path = require("path");

// Instantiate the server module object
const server = {};

// Instantiate the https
server.httpsServer = https.createServer(
  server.httpsServerOptions,
  function (req, res) {
    server.unifiedServer(req, res);
  }
);

// Instantiate the http
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

//Instantiate the HTTPS sever
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem")),
};

//All the server logic for both http and https server
server.unifiedServer = function (req, res) {
  //get url as an object
  const fullUrl = new URL("http://" + req.headers.host + req.url);

  //get path
  const path = fullUrl.pathname;
  const regex = /^\/|\/$/g;
  const trimmedPath = path.replace(regex, "");

  //Get the query string as an object
  const queryParams = new URLSearchParams(fullUrl.search);
  const queryStringObject = QueryString.parse(queryParams.toString());

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
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    //Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
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

server.router = {
  ping: handlers.ping,
  hello: handlers.hello,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

// Init script
server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function () {
    console.log("The server is listening on port" + config.httpPort);
  });

  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function () {
    console.log(`server is listening on the port ${config.httpsPort}`);
  });
};

// Export the module
module.exports = server;
