const pool = require("./connection");

class PixKeyRepository {
  async findByKey(keyValue) {
    const result = await pool.query("SELECT * FROM pix_keys WHERE key_value = $1", [keyValue]);
    return result.rows[0] || null;
  }

  async save(pixKey) {
    await pool.query(
      "INSERT INTO pix_keys (id, key_type, key_value, account_id) VALUES ($1, $2, $3, $4)",
      [pixKey.id, pixKey.keyType, pixKey.keyValue, pixKey.accountId]
    );
  }
}
module.exports = PixKeyRepository;