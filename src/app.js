const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const createRoute = require("./routes/create");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true 
}));

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Opaaa');
})

app.use("/create", createRoute);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})