/**
 * Library for storing and editing data
 */

//Dependencies
const fs = require("fs");
const path = require("path");

//Container for thr module (to be exported)
const lib = {};

//Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/");

// Write data to a file
lib.create = function (dir, file, data, callback) {
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //Convert data to string
        const stringData = JSON.stringify(data);

        //write to file and cole it
        fs.writeFile(fileDescriptor, stringData, function (err) {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false);
              } else {
                callback("error closing new file");
              }
            });
          } else {
            callback("error writing to new file");
          }
        });
      } else {
        callback("Could not create new file, it may already exit");
      }
    }
  );
};

//Read data from file
lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    function (err, data) {
      callback(err, data);
    }
  );
};

//Update data inside a file
lib.update = function (dir, file, data, callback) {
  //open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //Convert data to string
        const stringData = JSON.stringify(data);

        //Truncate the file
        fs.ftruncate(fileDescriptor, function (err) {
          if (!err) {
            //Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("error closing existing file");
                  }
                });
              }
            });
          } else {
            callback("Error truncating file");
          }
        });
      } else {
        callback("Could not open the file for updating, it may not exist yet");
      }
    }
  );
};

//Delete a file
lib.delete = function (dir, file, callback) {
  //unlink the file
  fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file");
    }
  });
};

//Export Module
module.exports = lib;
