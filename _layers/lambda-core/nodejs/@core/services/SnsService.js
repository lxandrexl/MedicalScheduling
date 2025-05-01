const {
  SNSClient,
  PublishCommand,
  CreateTopicCommand,
  DeleteTopicCommand,
  ListTopicsCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  ListSubscriptionsByTopicCommand,
} = require("@aws-sdk/client-sns");

class SnsService {
  constructor() {
    this.client = new SNSClient();
    this.topicArn = "";
  }

  setTopicArn(topicArn) {
    this.topicArn = topicArn;
  }

  async publishMessage(subject, message, messageAttributes = {}) {
    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Subject: subject,
      Message: JSON.stringify(message),
      MessageAttributes: messageAttributes,
    });
    return await this.client.send(command);
  }

  async createTopic(name) {
    const command = new CreateTopicCommand({ Name: name });
    const response = await this.client.send(command);
    this.topicArn = response.TopicArn;
    return response;
  }

  async deleteTopic(topicArn = this.topicArn) {
    const command = new DeleteTopicCommand({ TopicArn: topicArn });
    return await this.client.send(command);
  }

  async listTopics() {
    const command = new ListTopicsCommand({});
    return await this.client.send(command);
  }

  async subscribe(protocol, endpoint) {
    const command = new SubscribeCommand({
      TopicArn: this.topicArn,
      Protocol: protocol,
      Endpoint: endpoint,
      ReturnSubscriptionArn: true,
    });
    return await this.client.send(command);
  }

  async unsubscribe(subscriptionArn) {
    const command = new UnsubscribeCommand({
      SubscriptionArn: subscriptionArn,
    });
    return await this.client.send(command);
  }

  async listSubscriptions() {
    const command = new ListSubscriptionsByTopicCommand({
      TopicArn: this.topicArn,
    });
    return await this.client.send(command);
  }
}

module.exports = { SnsService };
