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
      accountData.owner_name,
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

  async save(account) {
    const newAccount = await pool.query(
      "INSERT INTO accounts (id, owner_name, balance) VALUES ($1, $2, $3)",
      [account.id, account.ownerName, account.balance]
    );
    return newAccount;
  }
}

module.exports = AccountRepository;
