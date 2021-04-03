/**
 *  Helpers for various tasks
 */

//Dependencies
const crypto = require("crypto");
const config = require("./config");

// Container for all the helpers
const helpers = {};

//Create a SHA256 hash
helpers.hash = function (str) {
  if (typeof str == "string" && str.length > 0) {
    const hash = crypto
      .createHash("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
  }
};

//Parse a JSON string to an object is all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};

//Create a String of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
  strLength = typeof strLength == "number" && strLength > 0 ? strLength : false;
  if (strLength) {
    // Define all the possible characters that could go into a string
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    //Start the final String
    let str = "";
    for (let i = 1; i <= strLength; i++) {
      // Get a random character from the possibleCharacter string
      let randomCharacter = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      //Append this character to the final string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    false;
  }
};

//Export helpers
module.exports = helpers;
