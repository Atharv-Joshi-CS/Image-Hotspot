const constants = require("../constants");

export const isEmpty = (val) =>
  val === undefined ||
  val === null ||
  (typeof val === "object" && !Object.keys(val)?.length) ||
  (typeof val === "string" && !val.trim().length);

export const getResponseObject = (statusCode, query, body = {}) => {
  const res = {
    statusCode,
    headers: {
      ...constants.HTTP_RESPONSE_HEADERS,
      authToken: query?.authToken ?? "",
    },
    body: JSON.stringify(body),
  };

  console.info(constants.LOGS.RESPONSE, res);
  return res;
};

export const isAllowedAssetType = (asset) => {
  const allowedAssetTypes = ["image"]
  const assetContentType = asset?.content_type || ""
  return allowedAssetTypes.some((type) => assetContentType.includes(type))
}
