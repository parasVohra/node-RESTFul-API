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
};

//Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "ParasVohar",
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
