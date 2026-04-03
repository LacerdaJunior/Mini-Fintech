const crypto = require("crypto");
const Account = require("../../domain/entities/Account");
class CreateAccountUseCase {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async execute(loggedUserId, ownerName) {
    const account = new Account(loggedUserId, ownerName, 0.0);

    await this.accountRepository.save(account);

    return {
      id: account.id,
      owner_name: account.ownerName,
      balance: account.balance,
      message: "Conta criada com sucesso",
    };
  }
}
module.exports = CreateAccountUseCase;
