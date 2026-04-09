const PixTransferUseCase = require("../../../src/application/use-cases/PixTransferUseCase");
const AppError = require("../../../src/domain/errors/AppError");

describe("PixTransferUseCase", () => {
  let mockPixKeyRepository;
  let mockAccountRepository;
  let mockTransactionRepository;
  let pixTransferUseCase;

  beforeEach(() => {
    mockPixKeyRepository = { findByKey: jest.fn() };
    mockAccountRepository = { 
      getById: jest.fn(), 
      updateBalancesTransactionally: jest.fn() 
    };
    mockTransactionRepository = { save: jest.fn() };

    pixTransferUseCase = new PixTransferUseCase(
      mockPixKeyRepository,
      mockAccountRepository,
      mockTransactionRepository
    );
  });

  it("deve realizar um PIX com sucesso", async () => {
    const senderAccount = { id: "user-1", balance: 1000, debit: jest.fn(), credit: jest.fn(), getBalance: () => 500 };
    const receiverAccount = { id: "user-2", balance: 0, debit: jest.fn(), credit: jest.fn(), getBalance: () => 500 };
    const pixKey = { accountId: "user-2", keyValue: "dest@teste.com" };

    mockAccountRepository.getById.mockResolvedValue(senderAccount);
    mockPixKeyRepository.findByKey.mockResolvedValue(pixKey);
    // Segunda chamada do getById retorna a conta do recebedor
    mockAccountRepository.getById.mockResolvedValueOnce(senderAccount).mockResolvedValueOnce(receiverAccount);

    const result = await pixTransferUseCase.execute("user-1", "dest@teste.com", 500);

    expect(result.message).toBe("Pix realizado com sucesso!");
    expect(senderAccount.debit).toHaveBeenCalledWith(500);
    expect(receiverAccount.credit).toHaveBeenCalledWith(500);
    expect(mockAccountRepository.updateBalancesTransactionally).toHaveBeenCalled();
  });

  it("deve falhar se a chave PIX nao existir", async () => {
    mockAccountRepository.getById.mockResolvedValue({ id: "user-1" });
    mockPixKeyRepository.findByKey.mockResolvedValue(null);

    await expect(
      pixTransferUseCase.execute("user-1", "inexistente@teste.com", 100)
    ).rejects.toThrow("Chave pix inválida/não encontrada.");
  });
});