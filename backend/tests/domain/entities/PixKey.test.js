const PixKey = require("../../../src/domain/entities/PixKey");

describe("PixKey Entity", () => {
  it("deve criar uma chave Pix com tipo EMAIL válido", () => {
    const pixKey = new PixKey("uuid-123", "EMAIL", "teste@fintech.com", "id-conta-123");
    
    expect(pixKey.keyType).toBe("EMAIL");
    expect(pixKey.keyValue).toBe("teste@fintech.com");
  });

  it("deve criar uma chave Pix com tipo CPF válido aceitando letras minúsculas", () => {

    const pixKey = new PixKey("uuid-123", "cpf", "11122233344", "id-conta-123");
    
    expect(pixKey.keyType).toBe("CPF");
  });

  it("deve lançar erro genérico se o tipo da chave for diferente de CPF ou EMAIL", () => {
    expect(() => {
      new PixKey("uuid-123", "CELULAR", "999999999", "id-conta-123");
    }).toThrow("Tipo de chave Pix inválido. Use CPF ou EMAIL.");
  });
});