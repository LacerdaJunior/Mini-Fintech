const pool = require("./connection");

async function createTables() {
  try {
    await pool.query(`DROP TABLE IF EXISTS transactions;`);
    await pool.query(`DROP TABLE IF EXISTS pix_keys;`);
    await pool.query(`DROP TABLE IF EXISTS accounts;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);
    await pool.query(`DROP TABLE IF EXISTS idempotency_keys;`);
    console.log("Tabelas antigas removidas.");

    await pool.query(`
      CREATE TABLE users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("✅ Tabela 'users' criada (Suporte a UUID).");

    await pool.query(`
      CREATE TABLE accounts (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE, -- ESSA LINHA AQUI!
        owner_name VARCHAR(100) NOT NULL,
        balance INTEGER DEFAULT 0 
      );
    `);
    console.log("✅ Tabela 'accounts' criada.");

    await pool.query(`
      CREATE TABLE transactions (
      id VARCHAR(36) PRIMARY KEY,
      type VARCHAR(50) NOT NULL, 
      account_id VARCHAR(36) REFERENCES accounts(id) ON DELETE CASCADE, 
      destination_account_id VARCHAR(36) REFERENCES accounts(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL, 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `);
    console.log("✅ Tabela 'transactions' criada.");

    await pool.query(`
      CREATE TABLE pix_keys (
        id VARCHAR(36) PRIMARY KEY,
        key_type VARCHAR(20) NOT NULL, 
        key_value VARCHAR(150) UNIQUE NOT NULL, 
        account_id VARCHAR(36) REFERENCES accounts(id) ON DELETE CASCADE
      );
    `);
    console.log("✅ Tabela 'pix_keys' criada (Relacionamento com Accounts).");

    await pool.query(`
      CREATE TABLE idempotency_keys (
        key VARCHAR(100) PRIMARY KEY,
        path VARCHAR(255) NOT NULL,
        status_code INTEGER NOT NULL, 
        response_body JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'idempotency_keys' criada.");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  } finally {
    process.exit(0);
  }
}

createTables();
