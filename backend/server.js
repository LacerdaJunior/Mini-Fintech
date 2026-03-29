
const express = require("express");
const TransferController = require("./src/infrastructure/http/TransferController");

const app = express();


app.use(express.json());


const transferController = new TransferController();


app.post("/transfer", (req, res) => transferController.handle(req, res));


const PORT = 4949;
app.listen(PORT, () => {
  console.log(`Mini-Fintech API rodando na porta ${PORT}!`);
});
