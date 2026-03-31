const express = require("express");
const TransferController = require("./src/infrastructure/http/TransferController");
const UserController = require("./src/infrastructure/http/UserController");

const app = express();

app.use(express.json());

const transferController = new TransferController();
const userController = new UserController();

app.post("/transfer", (req, res) => transferController.handle(req, res));
app.post("/users", (req, res) => {
  return userController.handle(req, res);
});

const PORT = 4949;
app.listen(PORT, () => {
  console.log(`Mini-Fintech API rodando na porta ${PORT}!`);
});
