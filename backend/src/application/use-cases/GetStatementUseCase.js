const AppError = require("../../domain/errors/AppError");
class GetSatementUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(accountId) {
    const transactionList = await this.transactionRepository.getStatement(
      accountId
    );

    if (!accountId) {
      throw new AppError("Transações do usuário não encontradas.");
    }

    return transactionList;
  }
}
module.exports = GetSatementUseCase;
