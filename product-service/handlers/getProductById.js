import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import inputOutputLogger from "@middy/input-output-logger";
import createError from "http-errors";

import { createHttpErrorHandler } from "../middlewares/createHttpErrorHandler";
import successfulResponseHandler from "../middlewares/successfulResponseHandler";
import productService from "../services/productService";

export const handler = async (event) => {
  const {
    pathParameters: { id: productId },
  } = event;
  const product = await productService.getProductById(productId);

  if (!product) {
    throw new createError.NotFound(
      `The following product (id: ${productId}) is not found.`
    );
  }

  return product;
};

export default middy(handler)
  .use(httpHeaderNormalizer())
  .use(inputOutputLogger())
  .use(createHttpErrorHandler())
  .use(cors())
  .use(successfulResponseHandler());
