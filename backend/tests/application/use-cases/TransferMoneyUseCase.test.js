const TransferMoneyUseCase = require("../../../src/application/use-cases/TransferMoneyUseCase");
describe("TransferMoneyUseCase", () => {
  let mockAccountRepository;
  let mockTransactionRepository;
  let transferMoneyUseCase;

  beforeEach(() => {
    mockAccountRepository = { 
      getById: jest.fn(), 
      updateBalancesTransactionally: jest.fn() 
    };
    mockTransactionRepository = { save: jest.fn() };
    transferMoneyUseCase = new TransferMoneyUseCase(mockAccountRepository, mockTransactionRepository);
  });

  it("deve transferir dinheiro entre contas (TED)", async () => {
    const acc1 = { id: "acc-1", balance: 200, debit: jest.fn(), credit: jest.fn(), getBalance: () => 100 };
    const acc2 = { id: "acc-2", balance: 0, debit: jest.fn(), credit: jest.fn(), getBalance: () => 100 };

    mockAccountRepository.getById
      .mockResolvedValueOnce(acc1)
      .mockResolvedValueOnce(acc2);

    const result = await transferMoneyUseCase.execute("acc-1", "acc-2", 100);

    expect(result.message).toBe("Transferência realizada com sucesso!");
    expect(acc1.debit).toHaveBeenCalledWith(100);
    expect(acc2.credit).toHaveBeenCalledWith(100);
  });

  it("deve impedir transferencia com saldo insuficiente", async () => {
    const acc1 = { 
        id: "acc-1", 
        balance: 50, 
        debit: () => { throw new Error("Saldo insuficiente.") } 
    };
    mockAccountRepository.getById.mockResolvedValueOnce(acc1).mockResolvedValueOnce({ id: "acc-2" });

    await expect(
      transferMoneyUseCase.execute("acc-1", "acc-2", 100)
    ).rejects.toThrow("Saldo insuficiente.");
  });
});