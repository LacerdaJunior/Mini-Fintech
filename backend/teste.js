const Account = require("./src/domain/entities/Account");
const TransferMoneyUseCase = require("./src/application/use-cases/TransferMoneyUseCase");

const contaGuilherme = new Account(1, "Guilherme", 100);
const contaJoao = new Account(2, "Joao", 50);

const mockRepository = {
  getById: async (id) => {
    if (id === 1) return contaGuilherme;
    if (id === 2) return contaJoao;
    return null;
  },
  save: async (account) => {
    console.log(
      `[BANCO DE DADOS] Salvando conta ${account.owner} com novo saldo de R$${account.balance}`
    );
  },
};

const transferUseCase = new TransferMoneyUseCase(mockRepository);

transferUseCase
  .execute(1, 2, 40)
  .then((resultado) => console.log(resultado))
  .catch((erro) => console.log("ERRO:", erro.message));
