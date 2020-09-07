module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js'],
  preset: '@shelf/jest-mongodb',
  roots: ['src', '__mocks__'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/main/index.js']
}
