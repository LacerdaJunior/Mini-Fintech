const AppError = require("../../domain/errors/AppError");
class GetStatementUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(accountId, page, limit) {
    const offset = (page - 1) * limit;

    const transactionList = await this.transactionRepository.getStatement(
      accountId,
      limit,
      offset
    );

    return transactionList;
  }
}
module.exports = GetStatementUseCase;
