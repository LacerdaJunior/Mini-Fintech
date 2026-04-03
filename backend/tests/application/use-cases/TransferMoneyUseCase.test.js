const TransferMoneyUseCase = require("../../../src/application/use-cases/TransferMoneyUseCase");
const Account = require("../../../src/domain/entities/Account");
const AppError = require("../../../src/domain/errors/AppError");

describe("TransferMoneyUseCase", () => {
  it("deve realizar uma transferência com sucesso e atualizar os saldos", async () => {
    const mockOriginAccount = new Account("id-origem", "Guilherme", 1000.0);
    const mockDestAccount = new Account("id-destino", "Investidor", 0.0);

    const mockAccountRepository = {
      getById: jest.fn(async (id) => {
        if (id === "id-origem") return mockOriginAccount;
        if (id === "id-destino") return mockDestAccount;
        return null;
      }),
      updateBalancesTransactionally: jest.fn(),
    };

    const mockTransactionRepository = { save: jest.fn() };

    const useCase = new TransferMoneyUseCase(
      mockAccountRepository,
      mockTransactionRepository
    );

    const result = await useCase.execute("id-origem", "id-destino", 200.0);

    expect(result.message).toBe("Transferência realizada com sucesso!");
    expect(mockOriginAccount.getBalance()).toBe(800.0); 
    expect(mockDestAccount.getBalance()).toBe(200.0); 

    expect(
      mockAccountRepository.updateBalancesTransactionally
    ).toHaveBeenCalledTimes(1);
  });

  it("deve lançar um erro 404 se a conta de origem não existir", async () => {
    const mockAccountRepository = {
      getById: jest.fn().mockResolvedValue(null),
    };
    const mockTransactionRepository = {};

    const useCase = new TransferMoneyUseCase(
      mockAccountRepository,
      mockTransactionRepository
    );

    await expect(
      useCase.execute("conta-fantasma", "id-destino", 100.0)
    ).rejects.toBeInstanceOf(AppError);
  });
});
