var DataTypes = require("sequelize").DataTypes;
var _productos = require("./productos");
var _resultados = require("./resultados");
var _tokens = require("./tokens");
var _users = require("./users");

function initModels(sequelize) {
  var productos = _productos(sequelize, DataTypes);
  var resultados = _resultados(sequelize, DataTypes);
  var tokens = _tokens(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    productos,
    resultados,
    tokens,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
