const { HttpMethods, Http } = require("lambda-core");
const API = require("../src");

const routes = [
  {
    path: "/appointment",
    method: HttpMethods.GET,
    action: API.AppointmentGET,
  },
  {
    path: "/appointment",
    method: HttpMethods.POST,
    action: API.AppointmentPOST,
  },
];

module.exports = async function handleHTTP(event) {
  const route = Http.FindRoute(routes, event.path, event.httpMethod);

  if (!route) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Route not found" }),
    };
  }

  return await route.action(event);
};
