const pool = require("./connection");

class TransactionRepository {
  async save(transaction, client) {
    await client.query(
      `INSERT INTO transactions (id, type, account_id, destination_account_id, amount) VALUES ($1, $2, $3, $4, $5)`,
      [
        transaction.id,
        transaction.type,
        transaction.originAccountId,
        transaction.destinationAccountId,
        transaction.amount
      ]
    );
  }

  async getStatement(accountId, limit, offset) {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE account_id = $1 OR destination_account_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [accountId, limit, offset]
    );
    return result.rows;
  }
}
module.exports = TransactionRepository;