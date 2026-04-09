const CreatePixKeyUseCase = require("../../../src/application/use-cases/CreatePixKeyUseCase");
const AppError = require("../../../src/domain/errors/AppError");

describe("CreatePixKeyUseCase", () => {
  let mockPixKeyRepository;
  let mockAccountRepository;
  let useCase;

  beforeEach(() => {
   
    mockAccountRepository = {
      getByUserId: jest.fn(), 
    };

    mockPixKeyRepository = {
      findByKey: jest.fn(),
      save: jest.fn(),
    };

    useCase = new CreatePixKeyUseCase(mockPixKeyRepository, mockAccountRepository);
  });

  it("deve cadastrar uma chave PIX com sucesso", async () => {
    const mockAccount = { id: "acc-123", ownerName: "Guilherme" };
    
   
    mockAccountRepository.getByUserId.mockResolvedValue(mockAccount);
    mockPixKeyRepository.findByKey.mockResolvedValue(null);

    const result = await useCase.execute("user-123", "EMAIL", "gui@fintech.com");

    expect(result.message).toBe("Chave PIX cadastrada com sucesso");
    expect(mockPixKeyRepository.save).toHaveBeenCalled();
  });

  it("deve lançar erro 404 se a conta não existir", async () => {
   
    mockAccountRepository.getByUserId.mockResolvedValue(null);

    await expect(
      useCase.execute("user-invalido", "EMAIL", "teste@fintech.com")
    ).rejects.toThrow("Conta não encontrada para este usuário.");
  });

  it("deve lançar erro 409 se a chave PIX já estiver em uso", async () => {
    mockAccountRepository.getByUserId.mockResolvedValue({ id: "acc-123" });
   
    mockPixKeyRepository.findByKey.mockResolvedValue({ id: "key-old" });

    await expect(
      useCase.execute("user-123", "EMAIL", "teste@fintech.com")
    ).rejects.toThrow("Chave pix informada já está em uso.");
  });
});