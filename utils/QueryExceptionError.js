class QueryExceptionError extends Error {
  constructor(message) {
    super(message);
    this.name = "QueryExceptionError";
    this.statusCode = 400; // Bad Request
  }
}

module.exports = QueryExceptionError;