require("reflect-metadata");
const { ContainerController, InputProcess } = require("lambda-core");
const { Usecase, Container } = require("../../config/container");

module.exports = async (event) => {
  console.log("Event", JSON.stringify(event));

  const container = new ContainerController()
    .setInputMethod(InputProcess.BODY)
    .setRemoveResponse()
    .setContainerIoC(Container, Usecase);

  return await container.call(event);
};
