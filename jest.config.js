module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  setupFiles: ["./src/__test__/setup.ts"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.[t]s?(x)", "**/?(*.)+(spec|test).[t]s?(x)"]
};
