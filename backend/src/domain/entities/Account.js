class Account {
  constructor(id, ownerName, balance = 0) {
    this.id = id;
    this.ownerName = ownerName;
    this.balance = balance;
  }

  credit(amount) {
    if (!Number.isInteger(amount)) {
      throw new Error("O valor deve ser um número inteiro (em centavos).");
    }
    if (amount <= 0) {
      throw new Error("O valor do depósito deve ser maior que zero.");
    }
    this.balance += amount;
  }

  debit(amount) {
    if (!Number.isInteger(amount)) {
      throw new Error("O valor deve ser um número inteiro (em centavos).");
    }
    if (amount <= 0) {
      throw new Error("O valor de saque deve ser maior que zero.");
    }
    if (this.balance < amount) {
      throw new Error("Saldo insuficiente.");
    }
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}

module.exports = Account;
