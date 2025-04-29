const { pathToRegexp, match } = require("path-to-regexp");

const FindRoute = (routes, path, method) => {
  for (const route of routes) {
    const regexp = pathToRegexp(route.path);
    const matchResult = match(route.path)(path);

    if (regexp.test(path) && route.method === method) {
      return {
        action: route.action,
        params: matchResult ? matchResult.params : {},
        options: route.options ?? {},
      };
    }
  }

  return null;
};

module.exports = { FindRoute };
