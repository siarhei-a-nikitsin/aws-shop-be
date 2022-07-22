export default (error) => ({
  statusCode: 500,
  body: JSON.stringify({ error: 'Internal server error', details: error && error.message }),
});
