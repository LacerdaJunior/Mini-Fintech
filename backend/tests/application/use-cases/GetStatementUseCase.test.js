const GetStatementUseCase = require("../../../src/application/use-cases/GetStatementUseCase");

describe("GetStatementUseCase (Paginação)", () => {
  let mockTransactionRepository;
  let useCase;

  beforeEach(() => {
    mockTransactionRepository = {
      getStatement: jest.fn(),
    };

    useCase = new GetStatementUseCase(mockTransactionRepository);
  });

  it("deve calcular o OFFSET corretamente para a Página 1 (deve ser 0)", async () => {
    // 1. Arrange
    const accountId = "user-123";
    const page = 1;
    const limit = 10;
    const mockTransacoes = [
      { id: "t1", amount: 5000 },
      { id: "t2", amount: 15000 },
    ];

    mockTransactionRepository.getStatement.mockResolvedValue(mockTransacoes);

    const result = await useCase.execute(accountId, page, limit);

    expect(result).toEqual(mockTransacoes); // Garante que repassou os dados

    expect(mockTransactionRepository.getStatement).toHaveBeenCalledWith(
      "user-123",
      10,
      0
    );
  });

  it("deve calcular o OFFSET matematicamente correto para a Página 4", async () => {
    const accountId = "user-123";
    const page = 4;
    const limit = 5;

    mockTransactionRepository.getStatement.mockResolvedValue([]);

    await useCase.execute(accountId, page, limit);

    expect(mockTransactionRepository.getStatement).toHaveBeenCalledWith(
      "user-123",
      5,
      15
    );
  });

  it("deve retornar um array vazio se o usuário não tiver transações (ou a página não existir)", async () => {
    const accountId = "user-123";

    mockTransactionRepository.getStatement.mockResolvedValue([]);

    const result = await useCase.execute(accountId, 100, 10);

    expect(result).toEqual([]);
  });
});