const express = require("express");
const TransferController = require("./src/infrastructure/http/TransferController");
const UserController = require("./src/infrastructure/http/UserController");
const LoginController = require("./src/infrastructure/http/LoginController");
const authMiddleware = require("./src/infrastructure/http/middlewares/AuthMiddleware");
const StatementController = require("./src/infrastructure/http/StatementController");
require("dotenv").config();

const app = express();

app.use(express.json());

const transferController = new TransferController();
const userController = new UserController();
const loginController = new LoginController();
const statementController = new StatementController();

app.post("/transfers", authMiddleware, (request, response) => {
  return transferController.handle(request, response);
});

app.post("/users", (req, res) => {
  return userController.handle(req, res);
});

app.post("/login", (request, response) => {
  return loginController.handle(request, response);
});

app.get("/statements", authMiddleware, (request, response) => {
  return statementController.handle(request, response);
});
//--------------------------------------------------------------------------//

const PORT = 4949;
app.listen(PORT, () => {
  console.log(`Mini-Fintech API rodando na porta ${PORT}!`);
});
