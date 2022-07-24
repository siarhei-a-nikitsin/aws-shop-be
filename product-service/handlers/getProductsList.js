import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import inputOutputLogger from "@middy/input-output-logger";

import { createHttpErrorHandler } from "../middlewares/createHttpErrorHandler";
import successfulResponseHandler from "../middlewares/successfulResponseHandler";
import productService from "../services/productService";

export const handler = async () => {
  const products = await productService.getProducts();

  return products;
};

export default middy(handler)
  .use(httpHeaderNormalizer())
  .use(inputOutputLogger())
  .use(createHttpErrorHandler())
  .use(cors())
  .use(successfulResponseHandler());
