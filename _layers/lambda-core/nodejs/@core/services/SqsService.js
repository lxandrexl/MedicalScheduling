const {
  SQSClient,
  SendMessageCommand,
  SendMessageBatchCommand,
  CreateQueueCommand,
  DeleteQueueCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
  ListQueuesCommand,
} = require("@aws-sdk/client-sqs");

class SqsService {
  constructor() {
    this.client = new SQSClient();
    this.queueUrl = "";
  }

  async setQueueUrlByName(queueName) {
    const command = new GetQueueUrlCommand({ QueueName: queueName });
    const response = await this.client.send(command);
    this.queueUrl = response.QueueUrl;
    return response.QueueUrl;
  }

  setQueueUrl(queueUrl) {
    this.queueUrl = queueUrl;
  }

  async sendMessage(messageBody, delaySeconds = 0) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
      DelaySeconds: delaySeconds,
    });
    return await this.client.send(command);
  }

  async sendBatch(messages) {
    const entries = messages.slice(0, 10).map((message, index) => ({
      Id: `msg-${index}`,
      MessageBody: JSON.stringify(message),
    }));
    const command = new SendMessageBatchCommand({
      QueueUrl: this.queueUrl,
      Entries: entries,
    });
    return await this.client.send(command);
  }

  async receiveMessages(maxNumberOfMessages = 1, waitTimeSeconds = 0) {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: maxNumberOfMessages,
      WaitTimeSeconds: waitTimeSeconds,
    });
    return await this.client.send(command);
  }

  async deleteMessage(receiptHandle) {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });
    return await this.client.send(command);
  }

  async createQueue(queueName) {
    const command = new CreateQueueCommand({ QueueName: queueName });
    const response = await this.client.send(command);
    this.queueUrl = response.QueueUrl;
    return response;
  }

  async deleteQueue(queueUrl = this.queueUrl) {
    const command = new DeleteQueueCommand({ QueueUrl: queueUrl });
    return await this.client.send(command);
  }

  async listQueues() {
    const command = new ListQueuesCommand({});
    return await this.client.send(command);
  }
}

module.exports = { SqsService };
