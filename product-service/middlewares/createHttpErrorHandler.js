import httpErrorHandler from "@middy/http-error-handler";

export const createHttpErrorHandler = () =>
  httpErrorHandler({ fallbackMessage: "Internal server error" });
