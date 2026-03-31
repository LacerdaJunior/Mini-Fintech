const pool = require("./connection");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log(" Tabela 'users' criada com sucesso.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        owner_name VARCHAR(100) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `);
    console.log(" Tabela 'accounts' criada com sucesso.");
  } catch (error) {
    console.error(" Erro ao criar tabelas:", error);
  } finally {
    process.exit(0);
  }
}

createTables();
