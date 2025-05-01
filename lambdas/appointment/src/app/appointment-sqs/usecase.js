const { nanoid } = require("nanoid");

class AppointmentSQSUseCase {
  constructor(dynamoDbService, snsService) {
    this._dynamoDbService = dynamoDbService;
    this._snsService = snsService;
  }

  async execute(req) {
    let { input } = req;
    const id = nanoid(8);
    console.log(input, id);
  }
}

module.exports = AppointmentSQSUseCase;
