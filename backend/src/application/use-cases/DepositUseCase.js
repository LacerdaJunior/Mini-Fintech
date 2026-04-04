const Account = require("../../domain/entities/Account");
const Transaction = require("../../domain/entities/Transaction");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class DepositUseCase {
  constructor(accountRepository, transactionRepository) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute(accountId, amount) {
    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new AppError("Conta não encontrada", 404);
    }

    account.credit(amount);

    const transaction = new Transaction(
      crypto.randomUUID(),
      "SISTEMA_DEPOSITO",
      account.id,
      amount
    );

    await this.accountRepository.depositTransactionally(
      account,
      transaction,
      this.transactionRepository
    );

    return {
      id: account.id,
      balance: account.getBalance(),
      message: "Depósito realizado com sucesso!",
    };
  }
}

module.exports = DepositUseCase;
