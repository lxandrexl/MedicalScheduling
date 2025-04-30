require("reflect-metadata");
const { ContainerController, InputProcess } = require("autoatencion-core");
const { Usecase, Container } = require("./src/app/container");

module.exports.handler = async (event) => {
  const container = new ContainerController()
    .setInputMethod(InputProcess.REQUEST)
    .setRemoveResponse()
    .setContainerIoC(Container, Usecase);

  return await container.call(event);
};
