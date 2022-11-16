const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
//Database

connection
  .authenticate()
  .then(() => {
    console.log("Conexao feita com o BD");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

//estou dizendo para o express usar o EJS como view engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.listen(8080, () => {
  console.log("app rodando");
});
