const Transaction = require("../../domain/entities/Transaction");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class DepositUseCase {
  constructor(accountRepository, transactionRepository) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute(userId, amount) {
    const account = await this.accountRepository.getByUserId(userId);

    if (!account) {
      throw new AppError("Conta não encontrada.", 404);
    }

    account.credit(amount);

    const transaction = new Transaction(
      crypto.randomUUID(),
      "DEPOSIT",
      account.id,
      amount
    );

    await this.accountRepository.depositTransactionally(account, transaction, this.transactionRepository);

    return { balance: account.getBalance(), message: "Depósito realizado com sucesso!" };
  }
}
module.exports = DepositUseCase;