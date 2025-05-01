const {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

function generateUpdateExpression(attributeValues) {
  const updateExpressions = Object.keys(attributeValues).map(
    (key) => `${key} = :${key.replace("#", "")}`
  );
  return `SET ${updateExpressions.join(", ")}`;
}

function toDictionaryOfValue(attributeValues, isUpdate = false) {
  const expression = {};
  Object.keys(attributeValues).forEach((key) => {
    const type = typeof attributeValues[key] === "object";
    if (!type || isUpdate) {
      const expKey = `:${key.replace("#", "")}`;
      expression[expKey] = attributeValues[key];
      return;
    }
    Object.keys(attributeValues[key]).forEach((attr) => {
      const expKey = `:${attr.replace("#", "")}`;
      expression[expKey] = attributeValues[key][attr];
    });
  });
  return expression;
}

function toDictionaryOfName(attributeValues) {
  const dictionaryOfName = {};
  Object.keys(attributeValues).forEach((key) => {
    if (key.indexOf("#") > -1) {
      dictionaryOfName[`${key}`] = key.replace("#", "");
    }
  });
  return dictionaryOfName;
}

function generateQueryExpression(attributeValues) {
  const updateExpressions = Object.keys(attributeValues).map((key) => {
    const type = typeof attributeValues[key] === "object";
    if (!type) return `${key} = :${key.replace("#", "")}`;
    const btw = Object.keys(attributeValues[key]).map(
      (attr) => `:${attr.replace("#", "")}`
    );
    return `${key} between ${btw.join(" and ")}`;
  });
  return `${updateExpressions.join(" and ")}`;
}

class DynamoDbService {
  constructor() {
    this.tableName = null;
  }

  setTable(tableName) {
    this.tableName = tableName;
  }

  async get(where) {
    const resultGet = await client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall(where),
      })
    );
    return resultGet.Item == undefined ? null : unmarshall(resultGet.Item);
  }

  async query(where, indexName = null) {
    const dictionaryOfValue = toDictionaryOfValue(where);
    const dictionaryOfName = toDictionaryOfName(where);

    const params = {
      ExpressionAttributeValues: marshall(dictionaryOfValue),
      TableName: this.tableName,
      KeyConditionExpression: generateQueryExpression(where),
    };
    if (indexName) {
      params.IndexName = indexName;
    }
    if (Object.keys(dictionaryOfName).length > 0) {
      params.ExpressionAttributeNames = dictionaryOfName;
    }
    console.log("dynamoDb@query", JSON.stringify(params));
    const resultQuery = await client.send(new QueryCommand(params));
    return resultQuery.Items.map((item) => unmarshall(item));
  }

  async scan(where = {}, indexName = null, limit = null) {
    const hasFilter = where && Object.keys(where).length > 0;
    const params = {
      TableName: this.tableName,
      ConsistentRead: true,
    };
    if (hasFilter) {
      const dictionaryOfValue = toDictionaryOfValue(where);
      const dictionaryOfName = toDictionaryOfName(where);
      params.ExpressionAttributeValues = marshall(dictionaryOfValue);
      params.FilterExpression = generateQueryExpression(where);
      if (Object.keys(dictionaryOfName).length > 0) {
        params.ExpressionAttributeNames = dictionaryOfName;
      }
    }
    console.log("llego1");

    if (indexName) params.IndexName = indexName;
    if (limit) params.Limit = limit;
    console.log("llego2");

    const resultScan = await client.send(new ScanCommand(params));
    console.log("llego3");
    return resultScan.Items.map((item) => unmarshall(item));
  }

  async put(data) {
    const resultCreate = await client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(data, { removeUndefinedValues: true }),
      })
    );
    return resultCreate;
  }

  async update(where, data) {
    const whereValues = marshall(where);
    const updateExpression = generateUpdateExpression(data);
    const dictionaryOfValue = toDictionaryOfValue(data, true);
    const dictionaryOfName = toDictionaryOfName(data);

    const params = {
      TableName: this.tableName,
      Key: whereValues,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: marshall(dictionaryOfValue),
    };

    if (Object.keys(dictionaryOfName).length > 0) {
      params.ExpressionAttributeNames = dictionaryOfName;
    }

    const command = new UpdateItemCommand(params);
    const resultCreate = await client.send(command);
    return resultCreate;
  }

  async delete(data) {
    const resultDelete = await client.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall(data),
      })
    );
    return resultDelete;
  }
}

module.exports = { DynamoDbService };
