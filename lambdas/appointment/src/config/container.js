const AppointmentGET = require("../app/appointment-get/usecase");
const AppointmentPOST = require("../app/appointment-post/usecase");
const AppointmentSQS = require("../app/appointment-sqs/usecase");
const {
  ContainerDependency,
  DynamoDbService,
  SnsService,
} = require("lambda-core");

const Dependencies = {
  AppointmentGET: [DynamoDbService],
  AppointmentPOST: [DynamoDbService, SnsService],
  AppointmentSQS: [DynamoDbService],
};

const CD = new ContainerDependency();
CD.registerDependencies(Dependencies.AppointmentGET);
CD.registerUsecase(AppointmentGET);

CD.registerDependencies(Dependencies.AppointmentPOST);
CD.registerUsecase(AppointmentPOST);

CD.registerDependencies(Dependencies.AppointmentSQS);
CD.registerUsecase(AppointmentSQS);

const Container = CD.getContainer();
const Usecase = CD.getUsecase();

module.exports = { Container, Usecase };
