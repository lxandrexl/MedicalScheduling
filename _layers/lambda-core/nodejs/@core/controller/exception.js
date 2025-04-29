const { StatusCodes, getReasonPhrase } = require('http-status-codes');

class ErrorBase extends Error {
  render() {
    throw new Error('Method not implemented.');
  }
}

class InvalidRequest extends ErrorBase {
  constructor(error) {
    super(error.message);
    this._error = error;
    Object.setPrototypeOf(this, InvalidRequest.prototype);
  }

  render() {
    return {
      code: StatusCodes.BAD_REQUEST,
      body: {
        error: {
          code: 'INVR',
          httpStatus: StatusCodes.BAD_REQUEST,
          message: getReasonPhrase(StatusCodes.BAD_REQUEST),
          details: [this._error.message],
        },
        payload: null,
      },
    };
  }
}

class InternalError extends ErrorBase {
  constructor(error) {
    super(error.message);
    this._error = error;
    Object.setPrototypeOf(this, InternalError.prototype);
  }

  render() {
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      body: {
        error: {
          code: 'IE',
          httpStatus: StatusCodes.INTERNAL_SERVER_ERROR,
          message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
          details: [this._error.message],
        },
        payload: null,
      },
    };
  }
}

class UnprocessableEntityError extends ErrorBase {
  constructor(error) {
    super(getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY));
    this._error = Array.isArray(error) ? error : [error];
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }

  render() {
    return {
      code: StatusCodes.UNPROCESSABLE_ENTITY,
      body: {
        error: {
          code: 'UPER',
          httpStatus: StatusCodes.UNPROCESSABLE_ENTITY,
          message: getReasonPhrase(StatusCodes.UNPROCESSABLE_ENTITY),
          details: this._error.map((err) => err.message),
        },
        payload: null,
      },
    };
  }
}

module.exports = {
  InvalidRequest,
  InternalError,
  UnprocessableEntityError,
};
