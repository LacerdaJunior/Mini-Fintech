const AppError = require("../../domain/errors/AppError");
const Transaction = require("../../domain/entities/Transaction");
const crypto = require("crypto");


class TransferMoneyUseCase {
  constructor(accountRepository, transactionRepository) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute(originAccountId, destinationAccountId, amount) {
    const originAccount = await this.accountRepository.getById(originAccountId);
    const destinationAccount = await this.accountRepository.getById(
      destinationAccountId
    );

    if (!originAccount) {
      throw new AppError("Conta de origem não encontrada.", 404);
    }
    if (!destinationAccount) {
      throw new AppError("Conta de destino não encontrada.", 404);
    }

    originAccount.debit(amount);
    destinationAccount.credit(amount);

    const transactionId = crypto.randomUUID();
    const transaction = new Transaction(transactionId, originAccount.id, destinationAccount.id, amount);

    await this.accountRepository.updateBalancesTransactionally(
      originAccount.id,
      destinationAccount.id,
      transaction,
      this.transactionRepository
    );

    return {
      message: "Transferência realizada com sucesso!",
      originBalance: originAccount.getBalance(),
      destinationBalance: destinationAccount.getBalance(),
    };
  }
}

module.exports = TransferMoneyUseCase;
