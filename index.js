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

    // send the response
    res.end("hi");

    //log  the request
    console.log(" Request received with this payload: ", buffer);
  });
});

server.listen(3001, function () {
  console.log("the server is listening on the port 3001");
});
