const TransferMoneyUseCase = require("../../application/use-cases/TransferMoneyUseCase");
const AccountRepository = require("../database/AccountRepository");

class TransferController {
  async handle(request, response) {
    const { originAccountId, destinationAccountId, amount } = request.body;

    const accountRepository = new AccountRepository();
    const transferUseCase = new TransferMoneyUseCase(accountRepository);

    const result = await transferUseCase.execute(
      originAccountId,
      destinationAccountId,
      amount
    );

    return response.status(200).json(result);
  }
}

module.exports = TransferController;
