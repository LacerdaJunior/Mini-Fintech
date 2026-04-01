const jwt = require("jsonwebtoken");
const AppError = require("../../../domain/errors/AppError");

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não fornecido.", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    request.user = decodedPayload;

    return next();
  } catch (error) {
    throw new AppError("Token inválido ou expirado.", 401);
  }
}

module.exports = authMiddleware;
