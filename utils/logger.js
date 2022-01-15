// Printing normal log messages
const info = (...params) => {
  console.log(...params);
};

// Printing error messages
const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
