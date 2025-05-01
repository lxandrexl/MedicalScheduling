const { nanoid } = require("nanoid");

class UseCase {
  constructor(dynamoDbService, snsService) {
    this._dynamoDbService = dynamoDbService;
    this._snsService = snsService;
  }

  async execute(req) {
    let { input } = req;
    const id = nanoid(8);
    console.log("POST METHOD", input, id);
  }
}

module.exports = UseCase;
