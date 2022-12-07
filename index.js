const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

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

//bodyParser - O body-parser é um módulo capaz de converter o body da requisição para vários formatos, por ex o JSON.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perguntas: perguntas,
    });
  });
});
//raw ira trazer apenas os dados principais | findAll é o metodo responsavel por buscar todas as perguntas da tabela e retornar pra gente. Equivalente ao SELECT * ALL FROM perguntas | Dentro dessa rota estou PESQUISANDO PELAS PERGUNTAS (pergunta.findALL), quando a pesquisa é feita, a lista de pergutnas é mandada pra variavel perguntas (.then((perguntas))), essa variavel é capturada e jogada pro render/frontend.

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

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      //pergunta encontrada pelo id
      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      res.redirect("/");
      // pergunta nao encontrada
    }
  });
});

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(8080, () => {
  console.log("app rodando");
});
