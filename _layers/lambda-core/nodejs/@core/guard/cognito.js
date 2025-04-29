const {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const environment = require("../config/env");
const USER_POOL_ID = environment.USER_POOL_ID;
const client = new CognitoIdentityProviderClient();

async function getAllAttrByUsername(username, userPoolId = USER_POOL_ID) {
  const command = new AdminGetUserCommand({
    UserPoolId: userPoolId,
    Username: username,
  });
  const response = await client.send(command);
  const { UserAttributes } = response;
  const attrs = {};
  UserAttributes.forEach((attr) => {
    attrs[attr.Name] = attr.Value;
  });
  return attrs;
}

module.exports = {
  getAllAttrByUsername,
};
