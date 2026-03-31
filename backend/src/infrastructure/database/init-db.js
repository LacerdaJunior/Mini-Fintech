const pool = require("./connection");

async function createTables() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        owner_name VARCHAR(100) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `);
    console.log("Tabela 'accounts' verificada/criada com sucesso.");

    await pool.query(`TRUNCATE TABLE accounts RESTART IDENTITY;`);
    await pool.query(`
      INSERT INTO accounts (owner_name, balance) VALUES 
      ('Guilherme', 100.00),
      ('Joao', 50.00);
    `);
    console.log("Contas do Guilherme (R$100) e Joao (R$50) criadas!");
  } catch (error) {
    console.error("Erro ao criar tabelas:", error);
  } finally {
    process.exit(0);
  }
}

createTables();
