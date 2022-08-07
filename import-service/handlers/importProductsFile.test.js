import AWS from "aws-sdk-mock";

import { handler } from "./importProductsFile";

test("returns correct signedUrl", async () => {
  const fileName = "file1.csv";
  const key = `uploaded/${fileName}`;
  const generateSignedUrl = (key) => `signed url - ${key}`;

  AWS.mock("S3", "getSignedUrl", (_method, params, callback) => {
    const signedUrl = generateSignedUrl(params.Key);

    callback(null, signedUrl);
  });

  const { signedUrl } = await handler({
    queryStringParameters: { name: fileName },
  });

  expect(signedUrl).toEqual(generateSignedUrl(key));
});
