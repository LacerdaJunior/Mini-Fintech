const Account = require("../../../src/domain/entities/Account");

describe("Account Entity", () => {
  it("deve conseguir depositar um valor corretamente", () => {
    const account = new Account("123", "Guilherme Lacerda", 100.0);

    account.credit(50.0);

    expect(account.getBalance()).toBe(150.0);
  });

  it("deve lançar um erro ao tentar sacar mais do que o saldo", () => {
    const account = new Account("123", "Guilherme Lacerda", 100.0);

    expect(() => {
      account.debit(500.0);
    }).toThrow("Saldo insuficiente.");
  });
});
