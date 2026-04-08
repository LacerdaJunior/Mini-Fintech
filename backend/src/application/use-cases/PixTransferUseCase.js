const PixKey = require("../../domain/entities/PixKey");
const Transaction = require("../../domain/entities/Transaction");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class PixTransferUseCase {
  constructor(pixKeyRepository, accountRepository, transactionRepository) {
    this.pixKeyRepository = pixKeyRepository;
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute(senderId, pixKeyValue, amount) {
    const senderAccount = await this.accountRepository.getById(senderId);

    if (!senderAccount) {
      throw new AppError("Conta de origem não encontrada.", 404);
    }

    const pixKey = await this.pixKeyRepository.findByKey(pixKeyValue);

    if (!pixKey) {
      throw new AppError("Chave pix inválida/não encontrada.", 404);
    }

    if (senderId === pixKey.accountId) {
      throw new AppError("Você não pode realizar um pix para si mesmo.", 400);
    }

    const receiverAccount = await this.accountRepository.getById(
      pixKey.accountId
    );

    senderAccount.debit(amount);
    receiverAccount.credit(amount);

    const transaction = new Transaction(
      crypto.randomUUID(),
      "PIX_ENVIADO",
      senderAccount.id,
      amount
    );

    await this.accountRepository.updateBalancesTransactionally(
      senderAccount,
      receiverAccount,
      transaction,
      this.transactionRepository
    );

    return {
      message: "Pix realizado com sucesso!",
      senderBalance: senderAccount.getBalance(),
      receiverBalance: receiverAccount.getBalance(),
    };
  }
}

module.exports = PixTransferUseCase;
