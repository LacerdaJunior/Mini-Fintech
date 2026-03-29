
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
      throw new Error("Conta de origem não encontrada.");
    }
    if (!destinationAccount) {
      throw new Error("Conta de destino não encontrada.");
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
