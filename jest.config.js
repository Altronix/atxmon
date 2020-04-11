module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  setupFiles: ["./src/__test__/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).[t]s?(x)"]
};
