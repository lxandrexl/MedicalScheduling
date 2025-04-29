const {
  EventBridgeClient,
  PutEventsCommand,
  PutRuleCommand,
  ListRulesCommand,
  DeleteRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  ListTargetsByRuleCommand,
} = require("@aws-sdk/client-eventbridge");

class EventBridgeService {
  constructor() {
    this.busName = "";
    this.eventSource = "";
    this.events = [];
    this.client = new EventBridgeClient();
  }

  setEventBuss(busName, eventSource) {
    this.busName = busName;
    this.eventSource = eventSource;
  }

  addEvent(eventType, eventData) {
    this.events.push({
      EventBusName: this.busName,
      Source: this.eventSource,
      DetailType: eventType,
      Detail: JSON.stringify(eventData),
    });
  }

  async send() {
    const groups = [...Array(Math.ceil(this.events.length / 10)).keys()];
    const resultGroups = await Promise.all(
      groups.map(async (groupIndex) => {
        const events = this.events.slice(
          groupIndex * 10,
          (groupIndex + 1) * 10
        );
        const command = new PutEventsCommand({ Entries: events });
        return await this.client.send(command);
      })
    );
    this.events = [];
    return resultGroups;
  }

  async putRule(
    ruleName,
    scheduleExpression,
    targetArn,
    targetInput,
    targetId = "ShedulerTargetDefault"
  ) {
    const ruleCommand = new PutRuleCommand({
      Name: ruleName,
      ScheduleExpression: scheduleExpression,
      EventBusName: this.busName,
      State: "ENABLED",
    });
    const ruleResponse = await this.client.send(ruleCommand);

    const targetCommand = new PutTargetsCommand({
      Rule: ruleName,
      EventBusName: this.busName,
      Targets: [
        {
          Id: targetId,
          Arn: targetArn,
          Input: JSON.stringify(targetInput),
        },
      ],
    });
    const targetResponse = await this.client.send(targetCommand);

    return { ruleResponse, targetResponse };
  }

  async listRules() {
    const command = new ListRulesCommand({ EventBusName: this.busName });
    const response = await this.client.send(command);
    return response;
  }

  async removeTargets(ruleName, targetIds) {
    const command = new RemoveTargetsCommand({
      Rule: ruleName,
      EventBusName: this.busName,
      Ids: targetIds,
    });
    const response = await this.client.send(command);
    return response;
  }

  async listTargetsByRule(ruleName) {
    const command = new ListTargetsByRuleCommand({
      Rule: ruleName,
      EventBusName: this.busName,
    });
    const response = await this.client.send(command);
    return response;
  }

  async deleteRule(ruleName) {
    const command = new DeleteRuleCommand({
      EventBusName: this.busName,
      Name: ruleName,
    });
    const response = await this.client.send(command);
    return response;
  }
}

module.exports = { EventBridgeService };
