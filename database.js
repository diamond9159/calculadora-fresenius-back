const Sequelize = require('sequelize')

const sequelize = new Sequelize('calculadora', 'test', 'testing15', {
//  host: 'localhost',
host:'127.0.0.1',
  dialect: 'mysql',
//  port: 3306,
//  operationsAliases: false,
//  logging: false
});

module.exports = sequelize;
