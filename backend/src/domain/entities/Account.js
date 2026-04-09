class Account {
  constructor(id, ownerName, balance = 0) {
    this.id = id;
    this.ownerName = ownerName;
    this.balance = balance;
  }

  credit(amount) {
    if (amount <= 0) throw new Error("O valor deve ser maior que zero.");
    this.balance += amount;
  }

  debit(amount) {
    if (this.balance < amount) throw new Error("Saldo insuficiente.");
    this.balance -= amount;
  }

  getBalance() {
    return this.balance;
  }
}
module.exports = Account;