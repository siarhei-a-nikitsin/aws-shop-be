const successfulResponseHandler = () => {
  const after = async (request) => {
    const { response } = request;

    const { statusCode, body } = response;

    request.response = {
      statusCode: statusCode ?? 200,
      body: JSON.stringify(body ?? response),
    };
  };

  return {
    after,
  };
};

export default successfulResponseHandler;
