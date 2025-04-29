const environment = {
  PERMISSION_TABLE_NAME: process.env.PERMISSION_TABLE_NAME,
  SECRET_CODE: process.env.SECRET_CODE,
  USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
};

module.exports = environment;
