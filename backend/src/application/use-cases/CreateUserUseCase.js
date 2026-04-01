const User = require("../../domain/entities/User");
const AppError = require("../../domain/errors/AppError");
const crypto = require("crypto");

class CreateUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(name, email, password) {
    const emailAlreadyExists = await this.userRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new AppError("Este e-mail já está em uso.", 409);
    }
    const generatedId = crypto.randomUUID();

    const user = new User(generatedId, name, email, password);

    const hashedPassword = await this.passwordHasher.hash(user.password);

    user.setEncryptedPassword(hashedPassword);
    await this.userRepository.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      message: "Usuário criado com sucesso",
    };
  }
}
module.exports = CreateUserUseCase;
