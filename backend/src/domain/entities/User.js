class User {
  constructor(id, name, email, password) {
    if (!email.includes("@")) {
      throw new Error("Email inválido. Deve conter '@'.");
    }

    if (password.length < 6) {
      throw new Error("A senha deve conter no minimo 6 caracteres.");
    }

    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  setEncryptedPassword(hashedPassword) {
    this.password = hashedPassword;
  }
}

module.exports = User;
