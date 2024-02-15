module.exports = {
   testEnvironment: "node",
   collectCoverage: true,
   coverageReporters: ["text", "lcov"],
   coverageDirectory: "coverage",
   testMatch: [
     "**/__tests__/**/*.test.[jt]s?(x)",
     "**/?(*.)+(spec|test).[jt]s?(x)",
   ]
 };