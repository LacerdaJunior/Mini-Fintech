const express = require("express");
const TransferController = require("./src/infrastructure/http/TransferController");
const UserController = require("./src/infrastructure/http/UserController");
const LoginController = require("./src/infrastructure/http/LoginController");
const authMiddleware = require("./src/infrastructure/http/middlewares/AuthMiddleware");
const StatementController = require("./src/infrastructure/http/StatementController");
const AccountController = require("./src/infrastructure/http/AccountController");
const DepositController = require("./src/infrastructure/http/DepositController");
const PixKeyController = require("./src/infrastructure/http/PixKeyController");
const PixTransferController = require("./src/infrastructure/http/PixTransferController");

require("dotenv").config();

const app = express();

app.use(express.json());

const transferController = new TransferController();
const userController = new UserController();
const loginController = new LoginController();
const statementController = new StatementController();
const accountController = new AccountController();
const depositController = new DepositController();
const pixKeyController = new PixKeyController();
const pixTransferController = new PixTransferController();

app.post("/users", (req, res) => {
  return userController.handle(req, res);
});

app.post("/login", (request, response) => {
  return loginController.handle(request, response);
});

app.post("/accounts", authMiddleware, (request, response) => {
  return accountController.handle(request, response);
});

app.post("/deposits", authMiddleware, (request, response) => {
  return depositController.handle(request, response);
});

app.post("/transfers", authMiddleware, (request, response) => {
  return transferController.handle(request, response);
});

app.post("/pix", authMiddleware, (request, response) => {
  return pixKeyController.handle(request, response);
});

app.post("/pix/transfer", authMiddleware, (request, response) => {
  return pixTransferController.handle(request, response);
});

app.get("/statements", authMiddleware, (request, response) => {
  return statementController.handle(request, response);
});
//--------------------------------------------------------------------------//

const PORT = 4949;
app.listen(PORT, () => {
  console.log(`Mini-Fintech API rodando na porta ${PORT}!`);
});
