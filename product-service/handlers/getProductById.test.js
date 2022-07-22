import create500Response from "../common/responses/create500Response";
import productService from "../services/productService";

import { handler } from "./getProductById";

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

test("calls productService.getProductById", async () => {
  const expectedProductId = 1;
  const getProductByIdMock = jest.spyOn(productService, "getProductById");

  await handler({
    pathParameters: { id: expectedProductId },
  });

  expect(getProductByIdMock).toHaveBeenCalledWith(expectedProductId);
  expect(getProductByIdMock).toHaveBeenCalledTimes(1);
});

test("returns correct product", async () => {
  const expectedProductId = 1;
  const expectedProduct = {
    id: expectedProductId,
    title: "product title",
  };

  jest
    .spyOn(productService, "getProductById")
    .mockImplementation(() => expectedProduct);

  const actualProduct = await handler({
    pathParameters: { id: expectedProductId },
  });

  expect(expectedProduct).toEqual(actualProduct);
});

test("returns 404 error response", async () => {
  const { statusCode } = await handler({
    pathParameters: { id: 1 },
  });

  expect(statusCode).toBe(404);
});

test("returns 500 error response", async () => {
  const error = new Error("test error");
  const expected500ErrorResponse = create500Response(error);

  jest.spyOn(productService, "getProductById").mockImplementation(() => {
    throw error;
  });

  const actualResponse = await handler({
    pathParameters: { id: 1 },
  });

  expect(expected500ErrorResponse).toEqual(actualResponse);
});
