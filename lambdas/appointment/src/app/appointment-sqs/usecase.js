const envs = require("../../config/envs");
class AppointmentSQSUseCase {
  constructor(dynamoDbService) {
    this._dynamoDbService = dynamoDbService;
  }

  async execute(req) {
    let { input } = req;
    this._dynamoDbService.setTable(envs.MedicalTable);
    await Promise.all(
      input.map(async (record) => {
        const { detail: payload } = JSON.parse(record.body);
        console.log("Payload", payload);
        await this._dynamoDbService.put({ ...payload, status: "completed" });
      })
    );
  }
}

module.exports = AppointmentSQSUseCase;
