const { ReasonPhrases } = require("http-status-codes");
const envs = require("../../config/envs");

class AppointmentPOSTUseCase {
  constructor(dynamoDbService, snsService) {
    this._dynamoDbService = dynamoDbService;
    this._snsService = snsService;
  }

  async execute(req) {
    let { input } = req;
    this._dynamoDbService.setTable(envs.MedicalTable);
    await this._dynamoDbService.put({ ...input, status: "pending" });

    const filter = {
      countryISO: {
        DataType: "String",
        StringValue: input.countryISO,
      },
    };
    const subject = "AppointmentCreated";
    this._snsService.setTopicArn(envs.TopicArn);
    await this._snsService.publishMessage(subject, input, filter);

    return { status: ReasonPhrases.ACCEPTED, message: input };
  }
}

module.exports = AppointmentPOSTUseCase;
