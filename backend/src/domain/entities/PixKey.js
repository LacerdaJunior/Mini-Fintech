const AppError = require("../errors/AppError");

class PixKey {
  constructor(id, keyType, keyValue, accountId) {
    const validTypes = ["CPF", "EMAIL"];

    if (!validTypes.includes(keyType.toUpperCase())) {
      throw new Error("Tipo de chave Pix inválido. Use CPF ou EMAIL.");
    }

    this.id = id;
    this.keyType = keyType.toUpperCase();
    this.keyValue = keyValue;
    this.accountId = accountId;
  }
}
module.exports = PixKey;
