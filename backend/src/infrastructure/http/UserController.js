const CreateUserUseCase = require("../../application/use-cases/CreateUserUseCase");
const UserRepository = require("../database/UserRepository");
const BcryptPasswordHasher = require("../security/BcryptPasswordHasher");

class UserController {
  async handle(request, response) {
    try {
      const { name, email, password } = request.body;
      const userRepository = new UserRepository();
      const passwordHasher = new BcryptPasswordHasher();

      const createUserUseCase = new CreateUserUseCase(
        userRepository,
        passwordHasher
      );
      const result = await createUserUseCase.execute(name, email, password);

      return response.status(201).json(result);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
