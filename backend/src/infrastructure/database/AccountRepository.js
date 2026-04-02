const pool = require("./connection");

const Account = require("../../domain/entities/Account");

class AccountRepository {
  async getById(accountId) {
    const result = await pool.query(`SELECT * FROM accounts WHERE id = $1`, [
      accountId,
    ]);

    const accountData = result.rows[0];

    if (!accountData) {
      return null;
    }
    return new Account(
      accountData.id,
      accountData.user_id,
      accountData.balance
    );
  }

  async updateBalancesTransactionally(
    originAccount,
    destinationAccount,
    transaction,
    transactionRepository
  ) {
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
