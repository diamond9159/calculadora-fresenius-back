const { echo, generateTokenByToken, decrypt } = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}

//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);

//var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);

if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}
if(decrypt(req.query.token).role != "a" && decrypt(req.query.token).role != "s") {return res.send(echo(null,"No tienes permisos para acceder a esta página.",true))}

//Inicio
const result = await models.resultados.findAll();
if (result === null) {return res.send(echo(null, "Invalid Token.", true))}



//Respuesta
return res.send(echo(new_token, result));
}
