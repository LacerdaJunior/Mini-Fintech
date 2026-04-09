const pool = require("./connection");
const Account = require("../../domain/entities/Account");

class AccountRepository {
  async getByUserId(userId) {
    const result = await pool.query("SELECT * FROM accounts WHERE user_id = $1", [userId]);
    const data = result.rows[0];
    return data ? new Account(data.id, data.owner_name, data.balance) : null;
  }

  async save(account, userId) {
    await pool.query(
      "INSERT INTO accounts (id, user_id, owner_name, balance) VALUES ($1, $2, $3, $4)",
      [account.id, userId, account.ownerName, account.balance]
    );
  }

  async depositTransactionally(account, transaction, transactionRepository) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("UPDATE accounts SET balance = $1 WHERE id = $2", [account.getBalance(), account.id]);
      await transactionRepository.save(transaction, client);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}
module.exports = AccountRepository;