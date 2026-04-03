const AccountRepository = require("../database/AccountRepository");
const CreateAccountUseCase = require("../../application/use-cases/CreateAccountUseCase");

class AccountController {
  async handle(request, response) {
    const { ownerName } = request.body;
    const loggedUserId = request.user.id;

    const accountRepository = new AccountRepository();
    const createAccountUseCase = new CreateAccountUseCase(accountRepository);

    const result = await createAccountUseCase.execute(loggedUserId, ownerName);
    return response.status(200).json(result);
  }
}
module.exports = AccountController;
