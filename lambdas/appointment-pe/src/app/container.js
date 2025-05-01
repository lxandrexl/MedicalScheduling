const UseCase = require("./usecase");
const {
  ContainerDependency,
  EventBridgeService,
  SequelizeService,
} = require("lambda-core");

const Dependencies = [EventBridgeService, SequelizeService];
const CD = new ContainerDependency();
CD.registerDependencies(Dependencies);
CD.registerUsecase(UseCase);
const Container = CD.getContainer();
const Usecase = CD.getUsecase();

module.exports = { Container, Usecase };
