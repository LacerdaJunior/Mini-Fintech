const DepositUseCase = require("../../application/use-cases/DepositUseCase");
const AccountRepository = require("../database/AccountRepository");
const TransactionRepository = require("../database/TransactionRepository");

class DepositController {
  async handle(request, response) {
    const { amount } = request.body;
    const accountId = request.user.id;

    const accountRepository = new AccountRepository();
    const transactionRepository = new TransactionRepository();

    const depositUseCase = new DepositUseCase(
      accountRepository,
      transactionRepository
    );

    const result = await depositUseCase.execute(accountId, amount);
    return response.status(200).json(result);
  }
}
module.exports = DepositController;
