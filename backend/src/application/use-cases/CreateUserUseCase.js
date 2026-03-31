const User = require("../../domain/entities/User");

class CreateUserUseCase {
  constructor(userRepository, passwordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
  }

  async execute(name, email, password) {
    const emailAlreadyExists = await this.userRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new Error("Este email já está em uso");
    }

    const user = new User(Date.now(), name, email, password);

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
