function ValidateMethod(methods) {
  return async (event) => {
    const method = event.httpMethod;
    const initialObj = {
      pass: true,
      status: 200,
      data: {}
    };
    const findMethod = methods.some(
      (element) => element.toUpperCase() === method
    );
    if (!findMethod) {
      initialObj.pass = false;
      initialObj.status = 501;
      initialObj.data = {
        error: {
          code: 'NOT_IMPLEMENTED',
          httpStatus: 501,
          message: 'Método no implementado',
          details: ''
        },
        payload: null
      };
    }
    return initialObj;
  };
}

module.exports = {
  ValidateMethod
};
  