const AppError = require("../../domain/errors/AppError");
class TransferMoneyUseCase {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
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
      throw new AppError("Conta de destino não encontrada.", 404)
    }

    originAccount.debit(amount);
    destinationAccount.credit(amount);

    await this.accountRepository.save(originAccount);
    await this.accountRepository.save(destinationAccount);

    return {
      message: "Transferência realizada com sucesso!",
      originBalance: originAccount.getBalance(),
      destinationBalance: destinationAccount.getBalance(),
    };
  }
}

module.exports = TransferMoneyUseCase;
