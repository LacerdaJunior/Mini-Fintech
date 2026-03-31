const pool = require("./connection");
const Account = require("../../domain/entities/Account");

class AccountRepository {
  async getById(id) {
    const result = await pool.query("SELECT * FROM accounts WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return new Account(row.id, row.owner_name, parseFloat(row.balance));
  }

  async save(account) {
    await pool.query("UPDATE accounts SET balance = $1 WHERE id = $2", [
      account.getBalance(),
      account.id,
    ]);
  }
}

module.exports = AccountRepository;
