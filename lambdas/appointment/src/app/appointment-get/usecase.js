const { ReasonPhrases } = require("http-status-codes");
const envs = require("../../config/envs");

class AppointmentGETUseCase {
  constructor(dynamoDbService, snsService) {
    this._dynamoDbService = dynamoDbService;
    this._snsService = snsService;
  }

  async execute() {
    this._dynamoDbService.setTable(envs.MedicalTable);
    const data = await this._dynamoDbService.scan();

    return { status: ReasonPhrases.OK, message: data };
  }
}

module.exports = AppointmentGETUseCase;
