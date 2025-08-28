class NotFoundExceptionError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundExceptionError";
    this.statusCode = 404; 
  }
}

module.exports = NotFoundExceptionError;