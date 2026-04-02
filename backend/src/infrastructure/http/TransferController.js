const TransferMoneyUseCase = require("../../application/use-cases/TransferMoneyUseCase");
const AccountRepository = require("../database/AccountRepository");
const TransactionRepository = require("../database/TransactionRepository");

class TransferController {
  async handle(request, response) {
    const { destinationAccountId, amount } = request.body;

    const originAccountId = request.user.id;

    const accountRepository = new AccountRepository();

    const transactionRepository = new TransactionRepository();

    
    const transferUseCase = new TransferMoneyUseCase(
      accountRepository,
      transactionRepository
    );

    const result = await transferUseCase.execute(
      originAccountId,
      destinationAccountId,
      amount
    );

    return response.status(200).json(result);
  }
}

module.exports = TransferController;
