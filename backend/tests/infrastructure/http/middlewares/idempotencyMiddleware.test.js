jest.mock("../../../../src/infrastructure/database/connection", () => ({
  query: jest.fn(),
}));

const pool = require("../../../../src/infrastructure/database/connection");
const idempotencyMiddleware = require("../../../../src/infrastructure/http/middlewares/idempotencyMiddleware");

describe("IdempotencyMiddleware", () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      path: "/pix/transfer",
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: 200,
    };

    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  it("❌ deve bloquear a requisição se não enviar o cabeçalho 'x-idempotency-key'", async () => {
    await idempotencyMiddleware(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error:
        "O cabeçalho 'x-idempotency-key' é obrigatório para esta operação.",
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("♻️ deve devolver a resposta antiga se a chave já existir no banco (Clique Duplo)", async () => {
    mockRequest.headers["x-idempotency-key"] = "chave-repetida-123";
    const reciboAntigo = { mensagem: "PIX feito com sucesso", valor: 5000 };

    pool.query.mockResolvedValueOnce({
      rows: [{ status_code: 201, response_body: reciboAntigo }],
    });

    // Act
    await idempotencyMiddleware(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(reciboAntigo);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("✅ deve deixar passar e SALVAR a resposta no banco se a chave for NOVA", async () => {
    // Arrange
    mockRequest.headers["x-idempotency-key"] = "chave-nova-999";

    pool.query.mockResolvedValueOnce({ rows: [] });

    pool.query.mockResolvedValueOnce({});

    // Act 1: O Middleware roda
    await idempotencyMiddleware(mockRequest, mockResponse, nextFunction);

    // Assert 1: Deve liberar a passagem pro Controller
    expect(nextFunction).toHaveBeenCalled();

    // Act 2: Simulando o Controller terminando o trabalho e respondendo pro usuário
    const respostaDoController = { sucesso: true, id_transacao: "abc" };
    mockResponse.status(200);
    mockResponse.json(respostaDoController);

    // Assert 2: Verificando se o Middleware disparou o INSERT pro banco de dados por debaixo dos panos
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO idempotency_keys"),
      [
        "chave-nova-999",
        "/pix/transfer",
        200,
        JSON.stringify(respostaDoController),
      ]
    );
  });

  it("deve retornar Erro 500 se o banco de dados explodir", async () => {
    // Arrange
    mockRequest.headers["x-idempotency-key"] = "chave-valida";

    // Simulando o banco caindo
    pool.query.mockRejectedValueOnce(new Error("Conexão perdida"));

    // Act
    await idempotencyMiddleware(mockRequest, mockResponse, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Erro interno no servidor.",
    });
  });
});
