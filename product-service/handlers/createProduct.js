import middy from "@middy/core";
import cors from "@middy/http-cors";
import inputOutputLogger from "@middy/input-output-logger";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import createError from "http-errors";

import { createHttpErrorHandler } from "../middlewares/createHttpErrorHandler";
import successfulResponseHandler from "../middlewares/successfulResponseHandler";
import { createProduct } from "../services/productService";

const handler = async (event) => {
  try {
    const newProduct = JSON.parse(event.body);

    const id = await createProduct(newProduct);

    return {
      statusCode: 201,
      body: {
        id,
      },
    };
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new createError.BadRequest(error?.message);
    }

    throw error;
  }
};

export default middy(handler)
  .use(httpHeaderNormalizer())
  .use(inputOutputLogger())
  .use(createHttpErrorHandler())
  .use(cors())
  .use(successfulResponseHandler());
