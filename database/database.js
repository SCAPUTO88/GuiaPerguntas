const Sequelize = require("sequelize");

const connection = new Sequelize("guiaperguntas", "root", "Sandro1988", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = connection;
