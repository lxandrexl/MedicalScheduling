require("reflect-metadata");
const { StatusCodes } = require("http-status-codes");
const {
  ContainerController,
  InputProcess,
  HttpMethods,
  ValidateMethod,
} = require("lambda-core");
const { Usecase, Container } = require("../../config/container");

module.exports = async (event) => {
  console.log("Event", JSON.stringify(event));

  const container = new ContainerController()
    .setGuard([ValidateMethod([HttpMethods.POST])])
    .setInputMethod(InputProcess.BODY)
    .setStatus(StatusCodes.ACCEPTED)
    .setContainerIoC(Container, Usecase.AppointmentPOSTUseCase);

  return await container.call(event);
};
