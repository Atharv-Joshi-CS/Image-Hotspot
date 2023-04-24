const axios = require("axios");
const constants = require("../constants");

const _makeThirdPartyApiCall = async (url, method, data) => {
  try {
    const res = await axios({
      url,
      method,
      data,
      headers: {
        /* custom headers can be added here */
      },
    });
    return res?.data;
  } catch (e) {
    console.error(constants.HTTP_TEXTS.SOMETHING_WENT_WRONG);
    console.error(e);
    throw e;
  }
};

const makeAPICall = () =>
  _makeThirdPartyApiCall(constants.EXAMPLE_API_URL, "GET");

module.exports = {
  makeAPICall,
};
