require("reflect-metadata");
const { ContainerController, InputProcess } = require("lambda-core");
const { Usecase, Container } = require("./src/app/container");

module.exports.handler = async (event) => {
  console.log("Event", JSON.stringify(event));

  const container = new ContainerController()
    .setInputMethod(InputProcess.RECORDS)
    .setRemoveResponse()
    .setContainerIoC(Container, Usecase);

  return await container.call(event);
};
