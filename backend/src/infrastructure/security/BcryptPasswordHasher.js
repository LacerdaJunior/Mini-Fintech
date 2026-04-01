const bcrypt = require("bcrypt");

class BcryptPasswordHasher {
  async hash(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
  async compare(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }
}

module.exports = BcryptPasswordHasher;
