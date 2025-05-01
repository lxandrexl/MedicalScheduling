const { AppointmentFromSQS } = require("../src");
const httpHandler = require("./http");

module.exports = async function dispatch(event) {
  if (isSQSEvent(event)) {
    return await AppointmentFromSQS(event);
  } else if (isHTTPEvent(event)) {
    return await httpHandler(event);
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Unsupported event type" }),
  };
};

function isSQSEvent(event) {
  return event.Records && event.Records[0]?.eventSource === "aws:sqs";
}

function isHTTPEvent(event) {
  return event.httpMethod && event.path;
}
