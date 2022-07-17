export default (error) => ({
  statusCode: 404,
  body: JSON.stringify({ error: error && error.message }),
});
