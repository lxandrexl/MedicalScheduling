const UseCase = require("./usecase");
const {
  ContainerDependency,
  EventBridgeService,
  InvokeLambdaService,
  DynamoDBTable,
} = require("autoatencion-core");

const Dependencies = [EventBridgeService, InvokeLambdaService, DynamoDBTable];
const CD = new ContainerDependency();
CD.registerDependencies(Dependencies);
CD.registerUsecase(UseCase);
const Container = CD.getContainer();
const Usecase = CD.getUsecase();

module.exports = { Container, Usecase };
