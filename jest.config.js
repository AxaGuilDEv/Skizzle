const esModules = ["svelte-highlight"].join("|")

module.exports = {
  testEnvironment: 'jsdom',
	setupFiles: ['jest-localstorage-mock'],
  verbose: true,
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec).+(ts|tsx|js)"],
  clearMocks: true,
  transform: {
    "^.+\\.(js|mjs)$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.svelte$": ["svelte-jester", { "preprocess": true }],
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  moduleDirectories: ["src","node_modules"],
  moduleFileExtensions: [
    "js",
    "mjs",
    "ts",
    "svelte"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.svelte",
    "src/**/*.ts",
    "!src/tests/**/*"
  ],
  coverageProvider: "babel",
  coveragePathIgnorePatterns: [
    ".*\\.d\\.ts"
  ],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	bail: false,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './src/setupTests.ts']
};