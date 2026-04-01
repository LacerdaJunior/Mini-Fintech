const pool  = require("./connection");

class UserRepository {

  async findByEmail(email) {
    const emailInUse = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailInUse.rows.length > 0) {
      return emailInUse.rows[0];
    }
    return null;
  }

  async save(users) {
    await pool.query(
      "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
      [users.id, users.name, users.email, users.password]
    );
  }
}
module.exports = UserRepository;