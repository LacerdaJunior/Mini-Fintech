class Transaction {
  constructor(id, originAccountId, destinationAccountId, amount) {
    (this.id = id),
      (this.originAccountId = originAccountId),
      (this.destinationAccountId = destinationAccountId),
      (this.amount = amount);
  }
}
module.exports = Transaction;
