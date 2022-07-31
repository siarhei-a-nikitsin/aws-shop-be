import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import inputOutputLogger from "@middy/input-output-logger";
import csv from "csv-parser";

import { createHttpErrorHandler } from "../middlewares/createHttpErrorHandler";
import successfulResponseHandler from "../middlewares/successfulResponseHandler";
import { getS3 } from "../utils/s3Factory";
import { BUCKET, UPLOADED_FOLDER, PARSED_FOLDER } from "../constants";

const handler = async (event) => {
  const s3 = getS3();

  const promises = event.Records.map((record) => {
    const fileKey = record.s3.object.key;

    const promise = new Promise((resolve, reject) => {
      const s3Stream = s3
        .getObject({
          Bucket: BUCKET,
          Key: fileKey,
        })
        .createReadStream();

      s3Stream
        .pipe(csv())
        .on("data", (newProduct) => {
          console.log("Parse new product: ", newProduct);
        })
        .on("end", async () => {
          console.log("End file reading.");

          console.log(`Copy from ${BUCKET}/${fileKey}`);

          const newFileKey = fileKey.replace(UPLOADED_FOLDER, PARSED_FOLDER);

          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${fileKey}`,
              Key: newFileKey,
            })
            .promise();

          console.log(`Copied into ${BUCKET}/${newFileKey}`);

          await s3
            .deleteObject({
              Bucket: BUCKET,
              Key: fileKey,
            })
            .promise();

          console.log(`File ${BUCKET}/${fileKey} is deleted.`);

          resolve();
        })
        .on("error", (error) => reject(error));
    });

    return promise;
  });

  await Promise.all(promises);

  return {};
};

export default middy(handler)
  .use(httpHeaderNormalizer())
  .use(inputOutputLogger())
  .use(createHttpErrorHandler())
  .use(successfulResponseHandler());
