function errorHandler(err, req, res, next) {
  console.error(err.stack);
  if (err.details && Array.isArray(err.details)) {
    return res.status(400).json({
      error: true,
      message: "Erro de validação",
      details: err.details.map(detail => ({
        campo: detail.path[0],
        mensagem: detail.message,
        valor: detail.context.value
      }))
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: true,
    message: message
  });

}

module.exports = errorHandler;