const pool = require("../../database/connection");

async function idempotencyMiddleware(request, response, next) {
  const idempotencyKey = request.headers["x-idempotency-key"];

  if (!idempotencyKey) {
    return response.status(400).json({
      error:
        "O cabeçalho 'x-idempotency-key' é obrigatório para esta operação.",
    });
  }

  try {
    const existingRequest = await pool.query(
      "SELECT status_code, response_body FROM idempotency_keys WHERE key = $1",
      [idempotencyKey]
    );

    if (existingRequest.rows.length > 0) {
      console.log(
        `Idempotência Ativada: Reenviando resposta antiga para a chave ${idempotencyKey}`
      );
      const cachedResponse = existingRequest.rows[0];

      return response
        .status(cachedResponse.status_code)
        .json(cachedResponse.response_body);
    }

    const originalJson = response.json;

    response.json = function (body) {
      pool
        .query(
          "INSERT INTO idempotency_keys (key, path, status_code, response_body) VALUES ($1, $2, $3, $4)",
          [
            idempotencyKey,
            request.path,
            response.statusCode,
            JSON.stringify(body),
          ]
        )
        .catch((err) =>
          console.error(" Erro ao salvar chave de idempotência:", err)
        );

      return originalJson.call(this, body);
    };

    next();
  } catch (error) {
    console.error(" Erro no middleware de idempotência:", error);
    return response.status(500).json({ error: "Erro interno no servidor." });
  }
}

module.exports = idempotencyMiddleware;
