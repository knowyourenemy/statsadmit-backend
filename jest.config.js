// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ['./__tests__/setup/jest.setup.ts'],
  testPathIgnorePatterns: ['./__tests__/setup'],
};
