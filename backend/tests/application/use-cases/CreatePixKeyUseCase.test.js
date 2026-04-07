const CreatePixKeyUseCase = require("../../../src/application/use-cases/CreatePixKeyUseCase");
const AppError = require("../../../src/domain/errors/AppError");

describe("CreatePixKeyUseCase", () => {
  it("deve cadastrar uma chave PIX com sucesso", async () => {
    const mockAccountRepository = {
      getById: jest
        .fn()
        .mockResolvedValue({ id: "id-conta-123", ownerName: "Usuário Teste" }),
    };
    const mockPixKeyRepository = {
      findBykey: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(),
    };

    const useCase = new CreatePixKeyUseCase(
      mockPixKeyRepository,
      mockAccountRepository
    );

    const result = await useCase.execute(
      "id-conta-123",
      "EMAIL",
      "teste@fintech.com"
    );

    expect(result.message).toBe("Chave PIX cadastrada com sucesso");
    expect(result.pixKey.keyValue).toBe("teste@fintech.com");
    expect(mockPixKeyRepository.save).toHaveBeenCalledTimes(1);
  });

  it("deve lançar erro 404 se a conta não existir", async () => {
    const mockAccountRepository = {
      getById: jest.fn().mockResolvedValue(null),
    };
    const mockPixKeyRepository = {};

    const useCase = new CreatePixKeyUseCase(
      mockPixKeyRepository,
      mockAccountRepository
    );

    await expect(
      useCase.execute("conta-invalida", "EMAIL", "teste@fintech.com")
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deve lançar erro 409 se a chave PIX já estiver em uso", async () => {
    const mockAccountRepository = {
      getById: jest.fn().mockResolvedValue({ id: "id-conta-123" }),
    };
    const mockPixKeyRepository = {
      findBykey: jest
        .fn()
        .mockResolvedValue({
          id: "chave-antiga",
          key_value: "teste@fintech.com",
        }),
    };

    const useCase = new CreatePixKeyUseCase(
      mockPixKeyRepository,
      mockAccountRepository
    );

    await expect(
      useCase.execute("id-conta-123", "EMAIL", "teste@fintech.com")
    ).rejects.toBeInstanceOf(AppError);
  });
});
