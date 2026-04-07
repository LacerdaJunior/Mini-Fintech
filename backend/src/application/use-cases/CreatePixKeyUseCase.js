const PixKey = require("../../domain/entities/PixKey");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class CreatePixKeyUseCase {
  constructor(pixKeyRepository, accountRepository) {
    this.pixKeyRepository = pixKeyRepository;
    this.accountRepository = accountRepository;
  }

  async execute(accountId, keyType, keyValue) {
    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new AppError("Conta não encontrada", 404);
    }

    const pixKeyIsInUse = await this.pixKeyRepository.findBykey(keyValue);

    if (pixKeyIsInUse) {
      throw new AppError("Chave pix informada já está em uso.", 409);
    }

    const pixKey = new PixKey(
      crypto.randomUUID(),
      keyType,
      keyValue,
      accountId
    );

    await this.pixKeyRepository.save(pixKey);

    return {
      message: "Chave PIX cadastrada com sucesso",
      pixKey: pixKey,
    };
  }
}

module.exports = CreatePixKeyUseCase;
