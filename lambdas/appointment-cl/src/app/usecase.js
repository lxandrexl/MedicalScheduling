const nanoid = require("nanoid");

class UseCase {
  constructor(dynamoDbService) {
    this._dynamoDbService = dynamoDbService;
  }

  async execute(req) {
    let { input } = req;
    const id = nanoid(8);
    console.log(input, id);
  }
}

module.exports = UseCase;
