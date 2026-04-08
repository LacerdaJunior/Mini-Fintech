const PixKeyRepository = require("../database/PixKeyRepository");
const AccountRepository = require("../database/AccountRepository");
const TransactionRepository = require("../database/TransactionRepository");
const PixTransferUseCase = require("../../application/use-cases/PixTransferUseCase");

class PixTransferController {
  async handle(request, response) {
    const { pixKey, amount } = request.body;
    const senderId = request.user.id;

    const pixKeyRepository = new PixKeyRepository();
    const accountRepository = new AccountRepository();
    const transactionRepository = new TransactionRepository();

    const pixTransferUseCase = new PixTransferUseCase(
      pixKeyRepository,
      accountRepository,
      transactionRepository
    );

    const result = await pixTransferUseCase.execute(senderId, pixKey, amount);
    return response.status(200).json(result);
  }
}
module.exports = PixTransferController;
