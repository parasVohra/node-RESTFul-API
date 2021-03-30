const http = require("http");

// the server should respond to all request with a string

const server = http.createServer(function (req, res) {
  res.end("hello world");
});

server.listen(3001, function () {
  console.log("the server is listening on the port 3000");
});
