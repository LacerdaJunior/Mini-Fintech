const AppError = require("../../../domain/errors/AppError");

function errorHandler(err, request, response, next) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("🚨 ERRO CRÍTICO NÃO TRATADO:", err);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error.",
  });
}

module.exports = errorHandler;
