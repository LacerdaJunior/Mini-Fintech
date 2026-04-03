const User = require("../../../src/domain/entities/User");

describe("User Entity", () => {
  it("deve criar um usuário corretamente com dados válidos", () => {
    const user = new User("123-uuid", "Guilherme Lacerda", "gui@fintech.com", "senha_segura");
    
    expect(user.name).toBe("Guilherme Lacerda");
    expect(user.email).toBe("gui@fintech.com");
  });

  it("deve barrar a criação se o email não contiver '@'", () => {
    expect(() => {
      new User("123", "Guilherme", "email_sem_arroba.com", "123456");
    }).toThrow("Email inválido. Deve conter '@'.");
  });

  it("deve barrar a criação se a senha tiver menos de 6 caracteres", () => {
    expect(() => {
      new User("123", "Guilherme", "gui@fintech.com", "12345");
    }).toThrow("A senha deve conter no minimo 6 caracteres.");
  });
});