const CreatePixKeyUseCase = require("../../application/use-cases/CreatePixKeyUseCase");
const PixKeyRepository = require("../database/PixKeyRepository");
const AccountRepository = require("../database/AccountRepository");

class PixKeyController {
  async handle(request, response) {
    const { key_type, key_value } = request.body;
    const userId = request.user.id;

    const createPixKeyUseCase = new CreatePixKeyUseCase(new PixKeyRepository(), new AccountRepository());
    const result = await createPixKeyUseCase.execute(userId, key_type, key_value);

    return response.status(201).json(result);
  }
}
module.exports = PixKeyController;