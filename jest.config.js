const {defaults} = require('jest-config');

module.exports = async () => {
  return {
    // ...
    bail: 1,
    verbose: true,
    preset: "@shelf/jest-mongodb",
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    // ...
  }
};