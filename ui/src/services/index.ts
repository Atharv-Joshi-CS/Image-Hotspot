import axios from "axios";
/* Import React modules */
/* Import other node modules */
/* Import our modules */

const makeAnApiCall = async (url: any, method: any, data: any = undefined) => {
  try {
    const response = await axios({
      url,
      method,
      data,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        // you can add you custom headers here
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response?.data;
  } catch (e: any) {
    console.error(e);
    const { status, data: resData } = e?.response || {};

    // Error handling can be done here
    // return appropriate data for each case accoring to the app's needs
    if (status === 500) {
      return resData;
    }
    if (status === 429) {
      return "Rate-limiting error";
    }
    return "something went wrong...";
  }
};

/* Below is just an example function which can be called
from any of the app container pages to make an API call. */
const getDataFromAPI = (data: any = undefined) =>
  makeAnApiCall("https://jsonplaceholder.typicode.com/todos/1", "GET", data);

export default {
  getDataFromAPI,
};
