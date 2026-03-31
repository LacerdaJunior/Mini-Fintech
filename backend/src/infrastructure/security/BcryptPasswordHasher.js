const bcrypt = require("bcrypt");

class BcryptPasswordHasher {
  async hash(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}
module.exports = BcryptPasswordHasher;
