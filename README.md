# 🚀 Mini-Fintech API | Clean Architecture

Uma API de serviços bancários completa, construída com foco em **integridade financeira**, **segurança** e **escalabilidade**. Este projeto simula o core bancário de uma Fintech moderna.

## 🛠️ Tecnologias e Conceitos
- **Node.js & Express**: Engine principal.
- **PostgreSQL**: Banco de dados relacional com transações ACID.
- **Docker & Docker Compose**: Conteinerização e orquestração de infraestrutura.
- **Clean Architecture**: Separação clara entre Domínio, Casos de Uso e Infraestrutura.
- **Jest**: 100% de cobertura nos fluxos críticos de negócio (22 testes).
- **Swagger (OpenAPI)**: Documentação interativa e guiada.
- **JWT**: Autenticação e proteção de rotas.
- **Idempotency**: Proteção contra duplicidade de transações.

## ⚡ Principais Funcionalidades
- [x] **Gestão de Usuários**: Cadastro e login seguro com Bcrypt.
- [x] **Contas Bancárias**: Abertura de conta vinculada ao usuário.
- [x] **Transações Reais**: Depósitos, TEDs internas e transferências PIX.
- [x] **Segurança Financeira**: Validação de saldo e travas de segurança.
- [x] **Extrato Paginado**: Consulta de histórico com alta performance.

## 🐳 Como rodar (Docker - Recomendado)
O projeto está totalmente conteinerizado. Para subir a API e o Banco de Dados com um único comando:

1. Certifique-se de ter o Docker instalado.
2. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build

3. Acesse http://localhost:4949/api-docs para o guia interativo.

🧪 Testes
Execute os testes automatizados para garantir a integridade do sistema:
```bash
npm test
```
