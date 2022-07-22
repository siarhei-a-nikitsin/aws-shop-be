import middy from '@middy/core';
import cors from '@middy/http-cors';
import { autoProxyResponse } from 'middy-autoproxyresponse';

import productService from '../services/productService';
import NotFoundError from '../common/errors/notFoundError';
import create404Response from '../common/responses/create404Response';
import create500Response from '../common/responses/create500Response';

export const handler = async (event) => {
  try {
    const {
      pathParameters: { id: productId },
    } = event;
    const product = await productService.getProductById(productId);

    if (!product) {
      throw new NotFoundError(
        `The following product (id: ${productId}) is not found.`,
      );
    }

    return product;
  } catch (error) {
    if (error instanceof NotFoundError) {
      return create404Response(error);
    }

    return create500Response(error);
  }
};

export default middy(handler).use(cors()).use(autoProxyResponse());
