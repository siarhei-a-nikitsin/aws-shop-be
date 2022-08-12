import create500Response from "../common/responses/create500Response";
import productService from "../services/productService";

import { handler } from "./getProductsList";

test("calls productService.getProducts", async () => {
  const getProductsMock = jest.spyOn(productService, "getProducts");

  await handler();

  expect(getProductsMock).toHaveBeenCalled();
});

test("returns correct products", async () => {
  const expectedProducts = await productService.getProducts();

  const actualProducts = await handler();

  expect(expectedProducts).toEqual(actualProducts);
});

test("returns 500 response", async () => {
  const error = new Error("test error");
  const expected500ErrorResponse = create500Response(error);

  jest.spyOn(productService, "getProducts").mockImplementation(() => {
    throw error;
  });

  const actualResponse = await handler();

  expect(expected500ErrorResponse).toEqual(actualResponse);
});
 