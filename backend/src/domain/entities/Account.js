class Account {
  constructor(id, ownerName, initialBalance = 0) {
    (this.id = id), (this.ownerName = ownerName);
    this.balance = initialBalance;
  }

  getBalance() {
    return this.balance;
  }

  credit(amount) {
    if (amount <= 0) {
      throw new Error("O valor a se depositar, deve ser maior que 0!");
    }

    this.balance += amount;
  }

  debit(amount) {
    if (amount <= 0) {
      throw new Error("O valor de saque deve ser maior que zero.");
    }
    if (amount > this.balance) {
      throw new Error("Saldo insuficiente.");
    }

    this.balance -= amount;
  }
}

module.exports = Account;
