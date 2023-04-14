const {echo,generateTokenByToken,getDate,decrypt} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var validator = require('validator');
var md5 = require('md5');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}
if(req.body.name === undefined || req.body.name === "") {return res.send(echo(null,"Nombre no ingresado.",true))}
if(req.body.email === undefined || req.body.email === "") {return res.send(echo(null,"Email no ingresado.",true))}
if(!validator.isEmail(req.body.email)) {return res.send(echo(null,"Email inválido.",true))}
if(req.body.password === undefined || req.body.password === "") {return res.send(echo(null,"Contraseña no ingresada.",true))}
if(req.body.role != "a" && req.body.role != "c" && req.body.role != "s") {return res.send(echo(null,"Rol de usuario inválido.",true))}
if(!validator.isAlpha(req.body.name,"es-ES",{ignore: " "})) {return res.send(echo(null,"No se permiten caracteres especiales en el campo \"Nombre\"",true))}

//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);
//	var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);
if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}
if(decrypt(req.query.token).role != "a") {return res.send(echo(null,"No tienes permisos para acceder a esta página.",true))}


//Inicio Codigo
const user_check = await models.users.count({
  where: {
    username: req.body.email,
  },
});
if (user_check > 0) {return res.send(echo(null,"Este E-mail ya existe.",true))}
try {
await models.users.create({ 
	username: req.body.email,
	password: md5(req.body.password),
	name: req.body.name,
	role: req.body.role,
});
} catch(e) {console.error(e);return res.send(echo(null,"Internal Error.",true))}



// Respuesta
return res.send(echo(null));
}
