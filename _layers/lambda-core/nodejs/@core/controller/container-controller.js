const { InternalError, UnprocessableEntityError } = require("./exception");
const CognitoPoolSrv = require("../guard/cognito");
const CognitoUtil = require("../utils/cognito");
const Qs = require("qs");
const jwt = require("jsonwebtoken");
const { DynamoDbService } = require("../services/DynamoDbService");
const {
  scopeToWhere,
  createIdentification,
} = require("../helpers/scope-helper");
const environment = require("../config/env");

const InputProcess = {
  BODY: 0,
  QUERY: 1,
  RAW: 2,
  REQUEST_CTX: 3,
  RECORDS: 4,
  REQUEST: 5,
  SNS: 6,
};

const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
};

class ContainerControllerExecutor {
  static executeValidator(input, schema) {
    if (typeof input === "string") input = JSON.parse(input);
    const { error } = schema.validate(input);
    if (error) console.error("ERROR CONTAINERCONTROLLEREXECUTOR::", error);
    if (error) throw new UnprocessableEntityError(error);
  }

  static executeInputMethod(input, option) {
    switch (option) {
      case InputProcess.BODY:
        return typeof input.body === "string"
          ? JSON.parse(input.body)
          : input.body;
      case InputProcess.QUERY:
        return Qs.parse(input.queryStringParameters);
      case InputProcess.REQUEST_CTX:
        return typeof input.requestContext === "string"
          ? JSON.parse(input.requestContext)
          : input.requestContext;
      case InputProcess.SNS:
        return Object.prototype.hasOwnProperty.call(input.Records[0], "Sns")
          ? input.Records[0].Sns
          : input.Records[0];
      case InputProcess.RECORDS:
        return input.Records;
      case InputProcess.REQUEST:
        return input;
    }
  }

  static async cognitoAttributes(req, { loadPermissions, loadCognitoAttr }) {
    try {
      let session = {};
      // Set user information
      if (loadCognitoAttr) {
        const username =
          req.requestContext.authorizer.claims["cognito:username"];
        const attributes = await CognitoPoolSrv.getAllAttrByUsername(username);
        session = {
          ...CognitoUtil.transform({
            ...req.requestContext.authorizer.claims,
            ...attributes,
          }),
        };
      } else {
        session = {
          ...CognitoUtil.transform(req.requestContext.authorizer.claims),
        };
      }

      // Load permissions
      if (loadPermissions) {
        const permissionTable = new DynamoDbService();
        permissionTable.setTable(environment.PERMISSION_TABLE_NAME);
        const eventId = session.event_id;
        const permission = await permissionTable.get({
          Id: eventId,
        });

        if (!permission) {
          throw new Error("No se encontraron permisos para el usuario");
        }

        // Agregar la propiedad de permisos al usuario
        session.permission = permission.payload;

        // Crear una nueva propiedad con el scope
        const scope = permission.payload.scope;
        session.scope = scopeToWhere(session, scope);
      }

      // Crear una nueva propiedad con la información combinada
      session.identification = createIdentification(session);

      return session;
    } catch (error) {
      console.log("Error al obtener los atributos de cognito", error);
    }
  }

  static async jwtAttributes(req) {
    try {
      const secretCode = environment.SECRET_CODE;
      const session = jwt.verify(req.headers["apikey"], secretCode);
      if (
        !Object.prototype.hasOwnProperty.call(session, "client") ||
        !Object.prototype.hasOwnProperty.call(session.client, "code")
      ) {
        throw Error("JWT no valido.");
      }
      return {
        ...session.client,
        code: session.client["code"],
      };
    } catch (error) {
      console.log(error);
    }
  }
}

class ContainerController {
  constructor() {
    this._validator = null;
    this._interceptor = null;
    this._status = 200;
    this._container = null;
    this._symbol = null;
    this._inputMethod = InputProcess.BODY;
    this._responseBody = true;
    this._guards = [];
    this._cognitoInfo = false;
    this._loadPermissions = true;
    this._loadCognitoAttr = false;
    this._cognitoData = {};
    this._jwtInfo = false;
    this._jwtData = {};
  }

  setRemoveResponse() {
    this._responseBody = false;
    return this;
  }

  setValidator(schema) {
    this._validator = schema;
    return this;
  }

  setInterceptor(interceptor) {
    this._interceptor = interceptor;
    return this;
  }

  setStatus(status) {
    this._status = status;
    return this;
  }

  setContainerIoC(container, symbol) {
    this._container = container;
    this._symbol = symbol;
    return this;
  }

  setInputMethod(option) {
    this._inputMethod = option;
    return this;
  }

  setGuard(guard) {
    this._guards = [...this._guards, ...guard];
    return this;
  }

  getAuthInfo(
    info = true,
    { loadPermissions = true, loadCognitoAttr = false } = {
      loadPermissions: true,
      loadCognitoAttr: false,
    }
  ) {
    this._loadPermissions = loadPermissions;
    this._loadCognitoAttr = loadCognitoAttr;
    this._cognitoInfo = info;
    return this;
  }

  getJwtInfo(info = true) {
    this._jwtInfo = info;
    return this;
  }

  async call(event, config = {}) {
    console.log("ContainerController::Event", JSON.stringify(event));
    const securityHeaders = this.getSecurityHeaders();
    try {
      const error = await this.executeGuards(event);
      if (error) return this.handleGuardError(error, securityHeaders);
      const request = await this.buildRequestObject(event, config);
      this.validateRequest(request);
      const instance = this._container.get(this._symbol);
      const result = await instance.execute(request);
      console.log("ContainerController::Response", JSON.stringify(result));
      return this.handleResult(result, securityHeaders);
    } catch (e) {
      return this.handleException(e, securityHeaders);
    }
  }

  async buildRequestObject(event, config) {
    const inputRequest = ContainerControllerExecutor.executeInputMethod(
      event,
      this._inputMethod
    );
    let userInfo = {};

    if (this._cognitoInfo) {
      this._cognitoData = await ContainerControllerExecutor.cognitoAttributes(
        event,
        {
          loadPermissions: this._loadPermissions,
          loadCognitoAttr: this._loadCognitoAttr,
        }
      );
      userInfo = this._cognitoData;
    }

    if (this._jwtInfo) {
      this._jwtData = await ContainerControllerExecutor.jwtAttributes(event);
      userInfo = this._jwtData;
    }

    return {
      input: inputRequest,
      params: event.pathParameters ?? {},
      query: event.queryStringParameters ?? {},
      headers: event.headers ?? {},
      user: userInfo,
      config,
    };
  }

  validateRequest(request) {
    if (this._validator) {
      ContainerControllerExecutor.executeValidator(
        request.input,
        this._validator
      );
    }
  }

  async executeGuards(event) {
    for (const guard of this._guards) {
      const { data, pass, status } = await guard(event);
      if (!pass) {
        return { status, data };
      }
    }
    return null;
  }

  handleGuardError(error, securityHeaders) {
    return {
      statusCode: error.status,
      headers: securityHeaders,
      body: JSON.stringify(error.data),
    };
  }

  getCors() {
    return {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    };
  }

  getSecurityHeaders() {
    return {
      "X-Content-Type-Options": "nosniff",
      "X-XSS-Protection": "1; mode=block",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "no-referrer-when-downgrade",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    };
  }

  handleResult(result, securityHeaders) {
    if (this._responseBody) {
      return {
        statusCode: this._status,
        body: JSON.stringify(result),
        headers: {
          ...this.getCors(),
          ...securityHeaders,
        },
      };
    } else {
      return result;
    }
  }

  handleException(e, securityHeaders) {
    console.log("ERROR Controller::", e);
    const error = typeof e.render === "function" ? e.render() : null;
    if (this._interceptor) {
      return this._interceptor(error ?? e, securityHeaders);
    } else if (error) {
      return {
        statusCode: error.code,
        body: JSON.stringify(error.body),
        headers: {
          ...this.getCors(),
          ...securityHeaders,
        },
      };
    } else {
      const internalError = new InternalError(e).render();
      return {
        statusCode: internalError.code,
        body: JSON.stringify(internalError.body),
        headers: {
          ...this.getCors(),
          ...securityHeaders,
        },
      };
    }
  }
}

module.exports = {
  InputProcess,
  HttpMethods,
  ContainerControllerExecutor,
  ContainerController,
};
