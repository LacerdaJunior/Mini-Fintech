
const Account = require('../../domain/entities/Account');
const TransferMoneyUseCase = require('../../application/use-cases/TransferMoneyUseCase');


const mockDatabase = [
    new Account(1, "Guilherme", 100),
    new Account(2, "Joao", 50)
];

const mockRepository = {
    getById: async (id) => mockDatabase.find(acc => acc.id === id),
    save: async (account) => {
        const index = mockDatabase.findIndex(acc => acc.id === account.id);
        mockDatabase[index] = account;
    }
};

class TransferController {
    async handle(request, response) {
        try {
            
            const { originAccountId, destinationAccountId, amount } = request.body;

            
            const transferUseCase = new TransferMoneyUseCase(mockRepository);

            
            const result = await transferUseCase.execute(originAccountId, destinationAccountId, amount);

           
            return response.status(200).json(result);

        } catch (error) {
      
            return response.status(400).json({ error: error.message });
        }
    }
}

module.exports = TransferController;