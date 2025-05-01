class UseCase {
  constructor(eventBridgeService, sequelizeService) {
    this._eventBridgeService = eventBridgeService;
    this._sequelizeService = sequelizeService;
  }

  async execute(req) {
    let { input } = req;
    await this._sequelizeService.testConnection();
    await Promise.all(
      input.map(async (record) => {
        const { Message } = JSON.parse(record.body);
        const messageParsed = JSON.parse(Message);
        const result = await this.insertQuery(messageParsed);
        console.log("rs", result);
        await this.sendEvent(messageParsed);
      })
    );
  }

  async insertQuery(message) {
    const query =
      "INSERT INTO appointment_cl (insuredId, scheduleId) VALUES (?, ?)";
    const items = {
      replacements: [message.insuredId, message.scheduleId],
      type: this._sequelizeService.sequelize.QueryTypes.INSERT,
    };
    await this._sequelizeService.sequelize.query(query, items);
  }

  async sendEvent(eventData) {
    this._eventBridgeService.setEventBuss(
      "default",
      "cl.medical-scheduling.api"
    );
    this._eventBridgeService.addEvent("Outbound", eventData);
    console.log("Outbound", JSON.stringify(eventData));
    await this._eventBridgeService.send();
  }
}

module.exports = UseCase;
