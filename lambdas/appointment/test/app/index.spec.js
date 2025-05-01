const createEvent = require("@serverless/event-mocks").default;
const appointmentGET = require("../../src/app/appointment-get");
const appointmentPOST = require("../../src/app/appointment-post");

jest.mock("@aws-sdk/client-sns", () => {
  return {
    SNSClient: jest.fn().mockImplementation(() => {
      return { send: jest.fn().mockResolvedValue("mocked response") };
    }),
    PublishCommand: jest.fn(),
  };
});

describe("Lambdas Entry Integration", () => {
  test(`Insert Endpoint 202 - POST`, async () => {
    const event = createEvent("aws:apiGateway", {
      httpMethod: "POST",
      body: JSON.stringify({
        insuredId: "00002",
        scheduleId: "49a99e1-fc39-4534-bd5f-ba6201c4ed22",
        countryISO: "PE",
      }),
    });
    const result = await appointmentPOST(event);
    expect(result.statusCode).toBe(202);
  });

  test(`List Endpoint 200 - GET`, async () => {
    const event = createEvent("aws:apiGateway", {
      httpMethod: "GET",
    });

    const result = await appointmentGET(event);
    expect(result.statusCode).toBe(200);

    const body = JSON.parse(result.body);
    expect(body).toEqual({
      status: "OK",
      message: expect.arrayContaining([
        expect.objectContaining({
          insuredId: expect.any(String),
          scheduleId: expect.any(String),
          countryISO: expect.any(String),
          status: expect.any(String),
        }),
      ]),
    });
  });
});
