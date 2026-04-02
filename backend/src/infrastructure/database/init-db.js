const pool = require("./connection");

async function createTables() {
  try {
    await pool.query(`DROP TABLE IF EXISTS transactions;`);
    await pool.query(`DROP TABLE IF EXISTS accounts;`);
    await pool.query(`DROP TABLE IF EXISTS users;`);
    console.log("🗑️ Tabelas antigas removidas.");

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
        owner_name VARCHAR(100) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `);
    console.log("✅ Tabela 'accounts' criada (Suporte a UUID).");

    await pool.query(`
      CREATE TABLE transactions(
        id VARCHAR(36) PRIMARY KEY,
        origin_account_id VARCHAR(36) NOT NULL,
        destination_account_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Tabela 'transactions' criada (Suporte a UUID).");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  } finally {
    process.exit(0);
  }
}

createTables();
