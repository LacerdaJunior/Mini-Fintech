const GetStatementUseCase = require("../../application/use-cases/GetStatementUseCase");
const TransactionRepository = require("../database/TransactionRepository");

class StatementController {
  async handle(request, response) {
    const originAccountId = request.user.id;
    const page = request.query.page ? Number(request.query.page) : 1;
    const limit = request.query.limit ? Number(request.query.limit) : 10;

    const transactionRepository = new TransactionRepository();
    const getStatementUseCase = new GetStatementUseCase(transactionRepository);

    const result = await getStatementUseCase.execute(
      originAccountId,
      page,
      limit
    );

    return response.status(200).json(result);
  }
}

module.exports = StatementController;
