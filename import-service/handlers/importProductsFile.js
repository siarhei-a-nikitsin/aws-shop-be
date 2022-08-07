import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import inputOutputLogger from "@middy/input-output-logger";

import { getS3 } from "../utils/s3Factory";
import { BUCKET, UPLOADED_FOLDER } from "../constants";
import { createHttpErrorHandler } from "../middlewares/createHttpErrorHandler";
import successfulResponseHandler from "../middlewares/successfulResponseHandler";

export const handler = async (event) => {
  const {
    queryStringParameters: { name },
  } = event;

  const s3 = getS3();

  const params = {
    Bucket: BUCKET,
    Key: `${UPLOADED_FOLDER}${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  const signedUrl = await new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", params, (error, signedUrl) => {
      if (error) {
        return reject(err);
      }

      resolve(signedUrl);
    });
  });

  return {
    signedUrl,
  };
};

export default middy(handler)
  .use(httpHeaderNormalizer())
  .use(inputOutputLogger())
  .use(createHttpErrorHandler())
  .use(cors())
  .use(successfulResponseHandler());
