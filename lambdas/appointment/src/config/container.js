const UseCase = require("../app/appointment-post/usecase");
const {
  ContainerDependency,
  DynamoDbService,
  SnsService,
} = require("lambda-core");

const Dependencies = [DynamoDbService, SnsService];
const CD = new ContainerDependency();
CD.registerDependencies(Dependencies);
CD.registerUsecase(UseCase);
const Container = CD.getContainer();
const Usecase = CD.getUsecase();

module.exports = { Container, Usecase };
