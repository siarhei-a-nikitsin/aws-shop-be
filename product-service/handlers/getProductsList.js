import middy from '@middy/core';
import cors from '@middy/http-cors';
import { autoProxyResponse } from 'middy-autoproxyresponse';

import productService from '../services/productService';
import create500Response from '../common/responses/create500Response';

const handler = async () => {
  try {
    const products = await productService.getProducts();

    return products;
  } catch (error) {
    return create500Response(error);
  }
};

export default middy(handler).use(cors()).use(autoProxyResponse());
