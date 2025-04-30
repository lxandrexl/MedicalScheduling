const ObjectID = require("bson-objectid");
const moment = require("moment-timezone");
const { Constants, Methods } = require("autoatencion-core");
const { STATUS } = Constants;

class UseCase {
  constructor(eventBridge, invokeLambdaService, dynamoDbService) {
    this._eventBridge = eventBridge;
    this._invokeLambdaService = invokeLambdaService;
    this._dynamoDbService = dynamoDbService;
    this.ExecutionCrudFn = process.env.EXECUTION_CRUD_FN;
    this.EventBusName = process.env.EVENT_BUS_NAME;
    this.TaskTokenTable = process.env.TASK_TOKEN_TABLE;
    this.TimeZone = "America/Santiago";
  }

  async execute(req) {
    let { input } = req;
    const {
      metadata,
      data,
      parameters,
      taskToken,
      taskTokenRule,
      node: _node,
      payload: { response },
      attachments,
    } = input;
    let node = _node;
    if (response?.previewNode)
      node = { ...node, previewNode: response.previewNode };
    if (!attachments) delete metadata.attachments;

    try {
      const typeTemplateHtml = this.constructEmailContent(parameters);
      const communicationId = ObjectID().toString();
      const eventData = this.createEventData(
        metadata,
        data,
        node,
        parameters,
        typeTemplateHtml,
        communicationId,
        taskToken,
        taskTokenRule
      );
      await this.sendEvent(eventData);
      const pushNode = Methods.registerCurrentNode(node, "", communicationId);
      const updateNode = Methods.buildLambdaPayload(metadata, {
        $push: pushNode,
      });
      await this.invokeLambda(this.ExecutionCrudFn, updateNode);
      const pushSegment = Methods.registerSegmentNode(node);
      const updateSegment = Methods.buildLambdaPayload(metadata, {
        $push: pushSegment,
      });
      await this.invokeLambda(this.ExecutionCrudFn, updateSegment);
      await this.registerAutomaticTokenSending(input, eventData);
      const { clientCode, executionId } = metadata;
      return {
        clientCode,
        executionId,
        communicationId,
        previewNode: node.name,
      };
    } catch (error) {
      await this.updateExecutionStatus(metadata, STATUS.Error);
      throw error;
    }
  }

  async registerAutomaticTokenSending(input, event) {
    const { taskToken, limitDate, resendTimes, metadata } = input;
    const { executionId } = metadata;
    const date = this.getDate();
    const ttl = Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60;
    if ([taskToken, limitDate, resendTimes].some((e) => e == null)) return;
    this._dynamoDbService.setTable(this.TaskTokenTable);
    const [hour, minutes] = limitDate.split(":").map(Number);
    const newTime = moment({ hour, minutes }).subtract(resendTimes, "hours");
    const rt = newTime.format("HH:mm");

    const payload = {
      executionId,
      taskToken,
      limitDate,
      resendTimes: rt,
      event,
      date,
      ttl,
    };
    await this._dynamoDbService.put(payload);
  }

  getDate() {
    const timezone = moment.tz(this.TimeZone);
    const date = timezone.format("YYYY-MM-DD");
    return date;
  }

  constructEmailContent(parameters) {
    if (parameters.email.template) {
      return { template: parameters.email.template };
    } else if (parameters.email.html) {
      return { html: parameters.email.html };
    }
    return {};
  }

  createEventData(
    metadata,
    data,
    node,
    parameters,
    typeTemplateHtml,
    communicationId,
    taskToken,
    taskTokenRule
  ) {
    const to = { email: data.EMAIL };
    if (
      parameters.email.to &&
      Object.prototype.hasOwnProperty.call(parameters.email.to, "bcc")
    ) {
      to.bcc = parameters.email.to.bcc;
    }
    return {
      metadata: {
        ...metadata,
        previewNode: node.name,
        origin: "autoatencion_orchestration_sendemail",
        channel: "EMAIL",
        provider: "SES",
        clientCode: metadata.clientCode,
        attributes: data,
        communicationId,
        taskToken,
        taskTokenRule,
        timestamp: new Date().getTime(),
        err_obj: { ERROR_FLAG: 0 },
      },
      data: {
        channel: "EMAIL",
        provider: "SES",
        taskToken,
        taskTokenRule,
        communicationId,
        email: {
          to,
          from: parameters.email.from,
          subject: parameters.email.subject,
          attributes: data,
          ...typeTemplateHtml,
        },
        executionId: metadata.executionId,
        orchestrationId: metadata.orchestrationId,
        workflowId: metadata.workflowId,
        priority: "high",
        requestedAt: new Date().toISOString(),
        scheduledAt:
          Object.prototype.hasOwnProperty.call(data, "scheduleAt") ?? null,
      },
    };
  }

  async sendEvent(eventData) {
    this._eventBridge.setEventBuss(this.EventBusName, "com.jordandev");
    this._eventBridge.addEvent("OutBound", eventData);
    console.log("OutBound", JSON.stringify(eventData));
    await this._eventBridge.send();
  }

  async invokeLambda(functionName, payload) {
    await this._invokeLambdaService.invoke(functionName, payload);
  }

  async updateExecutionStatus(metadata, status) {
    const _content = {
      clientCode: metadata.clientCode,
      executionId: metadata.executionId,
    };
    const payload = Methods.buildLambdaPayload(_content, { status });
    await this.invokeLambda(this.ExecutionCrudFn, payload);
  }
}

module.exports = UseCase;
