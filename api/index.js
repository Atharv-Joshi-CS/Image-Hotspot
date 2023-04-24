const constants = require("./constants");
const utils = require("./utils");
const { makeAPICall } = require("./handler");

exports.handler = async ({ queryStringParameters: query, body }) => {
  try {
    console.info(constants.LOGS.QUERY_PARAMS, query);
    console.info(constants.LOGS.REQ_BODY, body);

    if (utils.isEmpty(query)) {
      throw {
        statusCode: constants.HTTP_CODES.BAD_REQ,
        message: constants.HTTP_TEXTS.QUERY_MISSING,
      };
    }

    return utils.getResponseObject(
      constants.HTTP_CODES.OK,
      query,
      (await makeAPICall()) || {}
    );
  } catch (e) {
    // log the stack_api_key which you either get it in query params or in the body
    console.error(`Error: api_key - ${query?.stack_apiKey}`);
    return utils.getResponseObject(
      e?.statusCode || constants.HTTP_CODES.SOMETHING_WRONG,
      query,
      e?.message || constants.HTTP_TEXTS.SOMETHING_WENT_WRONG
    );
  }
};
