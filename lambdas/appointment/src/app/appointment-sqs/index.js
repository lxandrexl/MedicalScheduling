require("reflect-metadata");
const { ContainerController, InputProcess } = require("lambda-core");
const { Usecase, Container } = require("../../config/container");

module.exports = async (event) => {
  const container = new ContainerController()
    .setInputMethod(InputProcess.RECORDS)
    .setRemoveResponse()
    .setContainerIoC(Container, Usecase.AppointmentSQSUseCase);

  return await container.call(event);
};
