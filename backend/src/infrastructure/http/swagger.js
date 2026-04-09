const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Fintech API",
      version: "1.0.0",
      description: `
Documentacao oficial da API do projeto Mini Fintech.

### Guia Rapido de Testes (Fluxo Principal)
Para testar a jornada completa da aplicacao e evitar erros de regras de negocio, siga esta ordem exata:

1. **Criar Usuario:** POST /users
2. **Autenticar:** POST /login (Copie o Token gerado e cole no botao verde **Authorize** acima)
3. **Abrir Conta:** POST /accounts (Obrigatorio para poder movimentar dinheiro)
4. **Depositar:** POST /deposits (Injete saldo inicial na sua conta)
5. **Cadastrar PIX:** POST /pix (Crie sua chave de transferencia)
6. **Transferir:** POST /pix/transfer ou POST /transfers
7. **Ver Extrato:** GET /statements
      `,
    },
    servers: [
      {
        url: "http://localhost:4949",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/users": {
        post: {
          summary: "Cria um novo usuario na Fintech",
          tags: ["Usuarios"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "Guilherme Lacerda" },
                    email: { type: "string", example: "gui@fintech.com" },
                    password: { type: "string", example: "senha123" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Usuario criado com sucesso" },
            400: { description: "Dados invalidos ou email ja cadastrado" },
          },
        },
      },
      "/login": {
        post: {
          summary: "Faz o login e retorna o Token JWT",
          tags: ["Autenticacao"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "gui@fintech.com" },
                    password: { type: "string", example: "senha123" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Login bem sucedido. Retorna o token." },
            401: { description: "Credenciais invalidas" },
          },
        },
      },
      "/accounts": {
        post: {
          summary: "Cria uma nova conta bancaria para o usuario logado",
          tags: ["Contas"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ownerName: { type: "string", example: "Guilherme Lacerda" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Conta criada com sucesso" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
      "/deposits": {
        post: {
          summary: "Deposita dinheiro na conta do usuario",
          tags: ["Transacoes"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    amount: { type: "integer", example: 10000 },
                  },
                  description: "Valor em centavos (Ex: 10000 = R$ 100,00)",
                },
              },
            },
          },
          responses: {
            200: { description: "Deposito realizado com sucesso" },
            400: { description: "Valor invalido" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
      "/transfers": {
        post: {
          summary: "Realiza uma transferencia interna (TED/TEF)",
          tags: ["Transacoes"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    target_account_id: {
                      type: "string",
                      example: "uuid-da-conta-destino",
                    },
                    amount: { type: "integer", example: 15000 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Transferencia realizada com sucesso" },
            400: { description: "Saldo insuficiente ou conta nao encontrada" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
      "/pix": {
        post: {
          summary: "Cadastra uma nova chave PIX para o usuario",
          tags: ["Usuarios"],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    key_type: { type: "string", example: "EMAIL" },
                    key_value: { type: "string", example: "gui@fintech.com" },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Chave PIX cadastrada com sucesso" },
            400: { description: "Chave ja existe ou formato invalido" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
      "/pix/transfer": {
        post: {
          summary: "Realiza uma transferencia PIX",
          tags: ["Transacoes"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "header",
              name: "x-idempotency-key",
              required: true,
              schema: { type: "string", example: "chave-unica-001" },
              description: "Chave de idempotencia para evitar clique duplo",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    key_value: { type: "string", example: "destino@teste.com" },
                    amount: { type: "integer", example: 5000 },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Transferencia realizada com sucesso" },
            400: { description: "Saldo insuficiente ou chave nao encontrada" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
      "/statements": {
        get: {
          summary: "Retorna o extrato paginado da conta",
          tags: ["Extrato"],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "query",
              name: "page",
              schema: { type: "integer", example: 1 },
              description: "Numero da pagina desejada",
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", example: 10 },
              description: "Quantidade de transacoes por pagina",
            },
          ],
          responses: {
            200: { description: "Lista de transacoes retornada com sucesso" },
            401: { description: "Token ausente ou invalido" },
          },
        },
      },
    },
  },
  apis: ["./server.js"],
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
