import AWS from "aws-sdk-mock";

import { handler } from "./importProductsFile";

test("returns correct signedUrl", async () => {
  const fileName = "file1.csv";
  const expectedSignedUrl = "signed url";

  AWS.mock("S3", "getSignedUrl", () => expectedSignedUrl);

  const { signedUrl } = await handler({
    queryStringParameters: { name: fileName },
  });

  expect(signedUrl).toEqual(expectedSignedUrl);
});
