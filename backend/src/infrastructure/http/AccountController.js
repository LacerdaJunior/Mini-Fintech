const AccountRepository = require("../database/AccountRepository");
const Account = require("../../domain/entities/Account");
const crypto = require("crypto");

class AccountController {
  async handle(request, response) {
    const { ownerName } = request.body;
    const userId = request.user.id;

    const accountRepository = new AccountRepository();
    const newAccount = new Account(crypto.randomUUID(), ownerName, 0);

    await accountRepository.save(newAccount, userId);

    return response.status(200).json({ message: "Conta criada!", accountId: newAccount.id });
  }
}
module.exports = AccountController;