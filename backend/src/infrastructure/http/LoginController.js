const LoginUseCase = require("../../application/use-cases/LoginUseCase");
const UserRepository = require("../database/UserRepository");
const BcryptPasswordHasher = require("../security/BcryptPasswordHasher");
const JwtTokenGenerator = require("../security/JwtTokenGenerator");

class LoginController {
  async handle(request, response) {
    const { email, password } = request.body;

    const bcryptPasswordHasher = new BcryptPasswordHasher();
    const jwtTokenGenerator = new JwtTokenGenerator();
    const userRepository = new UserRepository();
    const loginUseCase = new LoginUseCase(
      userRepository,
      bcryptPasswordHasher,
      jwtTokenGenerator
    );

    const result = await loginUseCase.execute(email, password);
    return response.status(200).json(result);
  }
}
module.exports = LoginController;
