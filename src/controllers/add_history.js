const {echo,generateTokenByToken,getDate,decrypt} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var validator = require('validator');
var md5 = require('md5');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}
if(req.body.data === undefined || req.body.data === "") {return res.send(echo(null,"Data no ingresada.",true))}

//validar token
var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);
	//var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);
if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}

//Inicio Codigo
try {
await models.resultados.create({ 
	userid: decrypt(req.query.token).user_id,
	fecha: Date.now(),
	data: req.body.data,
});
} catch(e) {console.error(e);return res.send(echo(null,"Internal Error.",true))}



// Respuesta
return res.send(echo(null));
}
