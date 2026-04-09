class Transaction {
  constructor(id, type, originAccountId, amount, destinationAccountId = null) {
    this.id = id;
    this.type = type;
    this.originAccountId = originAccountId;
    this.destinationAccountId = destinationAccountId;
    this.amount = amount;
    this.createdAt = new Date();
  }
}
module.exports = Transaction;