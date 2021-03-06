/**
 * Primary file for API
 */

// Dependencies
const server = require("./lib/server");
const workers = require("./lib/workers");

// Declare the app
let app = {};

// Init function
app.init = function () {
  //Start the Server
  server.init();

  //Start the workers
  workers.init();
};

// Execute
app.init();

// Export the app
module.exports = app;
