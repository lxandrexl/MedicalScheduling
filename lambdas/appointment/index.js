require("reflect-metadata");
const dispatch = require("./helpers/dispatcher");

module.exports.handler = async (event) => {
  return await dispatch(event);
};
