module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Si usas Babel
  },
  moduleFileExtensions: ["js", "json", "node"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@core/(.*)$": "<rootDir>/_layers/lambda-core/nodejs/@core/$1",
  },
  globals: {
    NODE_ENV: "test",
  },
  moduleDirectories: [
    "node_modules",
    "<rootDir>/_layers/lambda-core/nodejs/node_modules",
  ],
  testMatch: [
    "**/lambdas/**/*.spec.js", // Esto le indica a Jest donde buscar tus archivos de prueba. Ajusta según tu estructura de carpetas.
  ],
  verbose: true,
  setupFiles: ["<rootDir>/jest.setup.js"],
};
