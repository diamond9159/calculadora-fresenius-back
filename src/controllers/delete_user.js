const {echo,generateTokenByToken,getDate,decrypt} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var validator = require('validator');
var md5 = require('md5');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}
if(!validator.isInt(req.body.id)) {return res.send(echo(null,"ID No válido.",true))}

//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);
//	var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);
if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}
if(decrypt(req.query.token).role != "a") {return res.send(echo(null,"No tienes permisos para acceder a esta página.",true))}
if(decrypt(req.query.token).user_id == req.body.id) {return res.send(echo(null,"No puedes borrar tu mismo usuario.",true))}


//Inicio Codigo
var user_check = await models.users.count({
  where: {
    id: req.body.id,
  },
});
if (user_check < 1) {return res.send(echo(null,"Este usuario no es válido.",true))}

try {
await models.users.destroy({
  where: {
    id: req.body.id,
  }
});
} catch(e) {console.error(e);return res.send(echo(null,"Internal Error.",true))}



// Respuesta
return res.send(echo(null));
}
