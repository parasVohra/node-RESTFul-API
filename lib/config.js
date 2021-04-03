/*
 *Create and export configuration variables
 *
 */

//Container for all environments
const environments = {};

//Staging (default) environment
environments.staging = {
  httpPort: 3001,
  httpsPort: 3002,
  envName: "staging",
  hashingSecret: "ParasVohar",
  maxChecks: 5,
  twilio: {
    accountSid: "AC0c3b33c23b4aaee1c369376c2058f6b0",
    authToken: "25dc6c9a010e8e29cc79f04fa6133c0e",
    fromPhone: "+15005550006",
  },
};

//Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "ParasVohar",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
};

//Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// check that the current environment is one of the environment above, if not , default to staging
let environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

//Export the module
module.exports = environmentToExport;
