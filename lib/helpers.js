/**
 *  Helpers for various tasks
 */

//Dependencies
const crypto = require("crypto");
const config = require("./config");
const https = require("https");
const querystring = require("querystring");

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

// Send an SMS message via Twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
  // Valiadate paratemets
  phone =
    typeof phone == "string" && phone.trim().length == 10
      ? phone.trim()
      : false;
  msg =
    typeof msg == "string" && msg.trim().length > 0 && msg.trim.length <= 1600
      ? msg.trim()
      : false;

  if (phone && msg) {
    // Configuration the request payload
    let payload = {
      From: config.twilio.fromPhone,
      To: "+1" + phone,
      Body: msg,
    };

    // Stringify the payload
    let stringPayload = querystring.stringify(payload);

    // Configure the request details
    let requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path:
        "/2010-04-01/Accounts/" + config.twilio.accountSid + "/Messages.json",
      auth: config.twilio.accountSid + ":" + config.twilio.authToken,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(stringPayload),
      },
    };

    // Instanctiate the request object
    let req = https.request(requestDetails, function (res) {
      // Grab the status of the sent request
      let status = res.statusCode;
      //callback sucessfully if the request went through
      if (status == 200 || status == 201) {
        callback(false);
      } else {
        callback("Status code returned was  " + status);
      }
    });

    //Bind to the error event so it doesn't get thrown
    req.on("error", function (e) {
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    callback("Given parameters were missing or invalid");
  }
};

//Export helpers
module.exports = helpers;
