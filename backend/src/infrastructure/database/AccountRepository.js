const pool = require("./connection");

class AccountRepository {
  async updateBalancesTransactionally(originAccount, destinationAccount) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query("UPDATE accounts SET balance = $1 WHERE id = $2", [
        originAccount.getBalance(),
        originAccount.id,
      ]);

      await client.query("UPDATE accounts SET balance = $1 WHERE id = $2", [
        destinationAccount.getBalance(),
        destinationAccount.id,
      ]);

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
