const { defaults: tsJestPresets } = require('ts-jest/presets');

module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  verbose: true,
  transform: tsJestPresets.transform
};