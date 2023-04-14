const {echo,generateFirstToken} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var md5 = require('md5');
var validator = require('validator');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.body.email === undefined || req.body.email === "") {return res.send(echo(null,"Email no ingresado.",true))}
if(req.body.password === undefined || req.body.password === "") {return res.send(echo(null,"Contraseña no ingresada.",true))}
if(!validator.isEmail(req.body.email)) {return res.send(echo(null,"Invalid Email.",true))}

//Inicio Codigo
const users = await models.users.findOne({
	attributes: ['name','role'],
  where: {
    username: req.body.email,
	password: md5(req.body.password),
  },
});
if (users === null) {return res.send(echo(null,"Combinación Correo/Contraseña Inválida.",true))}

//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateFirstToken(req.body.email, req.query.token, ip.split(",")[0], false, req.body.web);
//	var new_token = await generateFirstToken(req.body.email,req.query.token,req.headers['x-forwarded-for'].split(",")[0],false,req.body.web);
if(new_token === false) {return res.send(echo(null,"Invalid Token.",true))}

// respuesta
return res.send(echo(new_token,users));
}
