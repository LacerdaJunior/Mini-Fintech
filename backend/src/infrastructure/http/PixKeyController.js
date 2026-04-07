const CreatePixKeyUseCase = require("../../application/use-cases/CreatePixKeyUseCase");
const PixKeyRepository = require("../database/PixKeyRepository");
const AccountRepository = require("../database/AccountRepository");

class PixKeyController {
  async handle(request, response) {
    const { keyType, keyValue } = request.body;
    const accountId = request.user.id;

    const pixKeyRepository = new PixKeyRepository();
    const accountRepository = new AccountRepository();

    const createPixKeyUseCase = new CreatePixKeyUseCase(
      pixKeyRepository,
      accountRepository
    );

    const result = await createPixKeyUseCase.execute(
      accountId,
      keyType,
      keyValue
    );
    return response.status(200).json(result);
  }
}
module.exports = PixKeyController;
