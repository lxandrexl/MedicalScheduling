const UseCase = require("./usecase");
const {
  ContainerDependency,
  DynamoDbService,
  EventBridgeService,
} = require("lambda-core");

const Dependencies = [DynamoDbService, EventBridgeService];
const CD = new ContainerDependency();
CD.registerDependencies(Dependencies);
CD.registerUsecase(UseCase);
const Container = CD.getContainer();
const Usecase = CD.getUsecase();

module.exports = { Container, Usecase };
