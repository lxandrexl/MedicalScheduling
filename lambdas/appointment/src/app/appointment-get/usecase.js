const { ReasonPhrases } = require("http-status-codes");
const envs = require("../../config/envs");

class AppointmentGETUseCase {
  constructor(dynamoDbService) {
    this._dynamoDbService = dynamoDbService;
  }

  async execute() {
    this._dynamoDbService.setTable(envs.MedicalTable);
    const data = await this._dynamoDbService.scan();

    return { status: ReasonPhrases.OK, message: data };
  }
}

module.exports = AppointmentGETUseCase;
