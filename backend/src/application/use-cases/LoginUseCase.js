class LoginUseCase {
  constructor(userRepository, bcryptPasswordHasher, tokenGenerator) {
    this.userRepository = userRepository;
    this.bcryptPasswordHasher = bcryptPasswordHasher;
    this.tokenGenerator = tokenGenerator;
  }

  async execute(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas.");
    }

    const userPassword = await this.bcryptPasswordHasher.compare(
      password,
      user.password
    );
    if (!userPassword) {
      throw new Error("Credenciais inválidas.");
    }

    const token = this.tokenGenerator.generate({ id: user.id, email: user.email });

    return { token: token };
  }
}
module.exports = LoginUseCase;
