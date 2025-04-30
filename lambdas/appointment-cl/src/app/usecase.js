const nanoid = require("nanoid");

class UseCase {
  constructor(dynamoDbService, eventBridgeService) {
    this._dynamoDbService = dynamoDbService;
    this._eventBridgeService = eventBridgeService;
  }

  async execute(req) {
    let { input } = req;
    const id = nanoid(8);
    console.log(input, id);
  }
}

module.exports = UseCase;
