const pool = require("./connection");

class TransactionRepository {
  async save(transaction, client) {
    await client.query(
      `
        INSERT INTO transactions (
          id,
          origin_account_id,
          destination_account_id,
          amount
        )
        VALUES ($1, $2, $3, $4)
        `,
      [
        transaction.id,
        transaction.originAccountId,
        transaction.destinationAccountId,
        transaction.amount,
      ]
    );
  }

  async getStatement(accountId) {
    const result = await pool.query(
      `
        SELECT *
        FROM transactions
        WHERE origin_account_id = $1
           OR destination_account_id = $1
        ORDER BY created_at DESC
        `,
      [accountId]
    );

    return result.rows;
  }
}

module.exports = TransactionRepository;
