const GetStatementUseCase = require("../../application/use-cases/GetStatementUseCase");
const TransactionRepository = require("../database/TransactionRepository");

class StatementController {
  async handle(request, response) {
    const { originAccountId } = request.user.id;

    const transactionRepository = new TransactionRepository();
    const getStatementUseCase = new GetStatementUseCase(transactionRepository);

    const result = await getStatementUseCase.execute(originAccountId);

    return response.status(200).json(result);
  }
}

module.exports = StatementController;
