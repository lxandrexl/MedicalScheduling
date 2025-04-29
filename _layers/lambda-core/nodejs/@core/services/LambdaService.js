const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

class LambdaService {
  constructor() {
    this.client = new LambdaClient();
  }

  async invoke(functionName, payload) {
    const command = new InvokeCommand({
      FunctionName: functionName,
      Payload: Buffer.from(JSON.stringify(payload)),
    });
    const response = await this.client.send(command);
    return JSON.parse(Buffer.from(response.Payload).toString());
  }
}

module.exports = { LambdaService };
