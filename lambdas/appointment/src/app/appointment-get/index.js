require("reflect-metadata");
const { StatusCodes } = require("http-status-codes");
const {
  ContainerController,
  InputProcess,
  ValidateMethod,
  HttpMethods,
} = require("lambda-core");
const { Usecase, Container } = require("../../config/container");

module.exports = async (event) => {
  const container = new ContainerController()
    .setGuard([ValidateMethod([HttpMethods.GET])])
    .setInputMethod(InputProcess.REQUEST)
    .setStatus(StatusCodes.OK)
    .setContainerIoC(Container, Usecase.AppointmentGETUseCase);

  return await container.call(event);
};
