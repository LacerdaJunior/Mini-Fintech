class Transaction {
  constructor(id, type, accountId, amount) {
    if (!Number.isInteger(amount)) {
      throw new Error(
        "O valor da transação deve ser um número inteiro (em centavos)."
      );
    }

    this.id = id;
    this.type = type;
    this.accountId = accountId;
    this.amount = amount;
    this.createdAt = new Date();
  }
}

module.exports = Transaction;
