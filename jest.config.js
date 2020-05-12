module.exports = {
  preset: "ts-jest",
  coverageDirectory: "coverage",
  setupFiles: ["./src/__tests__/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"]
};
