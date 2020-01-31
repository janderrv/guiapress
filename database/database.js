const Sequelize = require("sequelize");

const connection = new Sequelize("guiapressbd", "janderrv", "ypvsdt200", {
    host: "mysql669.umbler.com",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;