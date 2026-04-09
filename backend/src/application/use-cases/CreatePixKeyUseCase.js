const PixKey = require("../../domain/entities/PixKey");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class CreatePixKeyUseCase {
  constructor(pixKeyRepository, accountRepository) {
    this.pixKeyRepository = pixKeyRepository;
    this.accountRepository = accountRepository;
  }

  async execute(userId, keyType, keyValue) {
    const account = await this.accountRepository.getByUserId(userId);

    if (!account) {
      throw new AppError("Conta não encontrada para este usuário.", 404);
    }

    const pixKeyIsInUse = await this.pixKeyRepository.findByKey(keyValue);

    if (pixKeyIsInUse) {
      throw new AppError("Chave pix informada já está em uso.", 409);
    }

    const pixKey = new PixKey(crypto.randomUUID(), keyType, keyValue, account.id);
    await this.pixKeyRepository.save(pixKey);

    return { message: "Chave PIX cadastrada com sucesso", pixKey };
  }
}
module.exports = CreatePixKeyUseCase;