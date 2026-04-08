const PixTransferUseCase = require("../../../src/application/use-cases/PixTransferUseCase");
const AppError = require("../../../src/domain/errors/AppError");

describe("PixTransferUseCase", () => {
  let mockAccountRepository;
  let mockPixKeyRepository;
  let mockTransactionRepository;
  let useCase;

  beforeEach(() => {
    mockAccountRepository = {
      getById: jest.fn(),
      updateBalancesTransactionally: jest.fn(),
    };
    mockPixKeyRepository = {
      findByKey: jest.fn(),
    };
    mockTransactionRepository = {
      save: jest.fn(),
    };

    useCase = new PixTransferUseCase(
      mockPixKeyRepository,
      mockAccountRepository,
      mockTransactionRepository
    );
  });

  it("deve realizar um PIX com sucesso", async () => {
    const senderAccount = {
      id: "sender-123",
      debit: jest.fn(),
      getBalance: jest.fn().mockReturnValue(5000),
    };
    const receiverAccount = {
      id: "receiver-456",
      credit: jest.fn(),
      getBalance: jest.fn().mockReturnValue(15000),
    };
    const pixKey = {
      accountId: "receiver-456",
      keyType: "EMAIL",
      keyValue: "amigo@fintech.com",
    };

    mockAccountRepository.getById.mockImplementation((id) => {
      if (id === "sender-123") return senderAccount;
      if (id === "receiver-456") return receiverAccount;
      return null;
    });
    mockPixKeyRepository.findByKey.mockResolvedValue(pixKey);

    const result = await useCase.execute(
      "sender-123",
      "amigo@fintech.com",
      5000
    );

    expect(result.message).toBe("Pix realizado com sucesso!");
    expect(senderAccount.debit).toHaveBeenCalledWith(5000);
    expect(receiverAccount.credit).toHaveBeenCalledWith(5000);
    expect(
      mockAccountRepository.updateBalancesTransactionally
    ).toHaveBeenCalledTimes(1);
  });

  it("deve lançar erro 404 se a conta de origem não existir", async () => {
    mockAccountRepository.getById.mockResolvedValue(null);

    await expect(
      useCase.execute("id-invalido", "amigo@fintech.com", 5000)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deve lançar erro 404 se a chave Pix não for encontrada", async () => {
    mockAccountRepository.getById.mockResolvedValue({ id: "sender-123" });
    mockPixKeyRepository.findByKey.mockResolvedValue(null);

    await expect(
      useCase.execute("sender-123", "chave-fantasma@fintech.com", 5000)
    ).rejects.toBeInstanceOf(AppError);
  });

  it("deve lançar erro 400 se tentar fazer PIX para a própria conta (Auto-Pix)", async () => {
    const senderAccount = { id: "sender-123" };
    const pixKey = { accountId: "sender-123" };

    mockAccountRepository.getById.mockResolvedValue(senderAccount);
    mockPixKeyRepository.findByKey.mockResolvedValue(pixKey);

    await expect(
      useCase.execute("sender-123", "meu-email@fintech.com", 5000)
    ).rejects.toBeInstanceOf(AppError);
  });
});
