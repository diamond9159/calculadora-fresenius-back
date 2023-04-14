const {echo,generateFirstToken,getDate,decrypt} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var validator = require('validator');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}
if(req.body.name === undefined || req.body.name === "") {return res.send(echo(null,"Nombre no ingresado.",true))}
if(req.body.email === undefined || req.body.email === "") {return res.send(echo(null,"Email no ingresado.",true))}
if(!validator.isEmail(req.body.email)) {return res.send(echo(null,"Invalid Email.",true))}
if(req.body.password === undefined || req.body.password === "") {return res.send(echo(null,"Contraseña no ingresada.",true))}
if(req.body.check_password === undefined || req.body.check_password === "") {return res.send(echo(null,"Confirmación de contraseña no ingresada.",true))}
if(req.body.password != req.body.check_password) {return res.send(echo(null,"Contraseña y confirmación de contraseña no son las mismas.",true))}
if(req.body.type_user != "a" && req.body.type_user != "c" && req.body.type_user != "s") {return res.send(echo(null,"Invalid type user.",true))}
if(!validator.isAlpha(req.body.name,"es-ES",{ignore: " "})) {return res.send(echo(null,"No se permiten caracteres especiales en el campo \"Nombre\"",true))}

//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);

//var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);
if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}
if(decrypt(req.query.token).role != "a") {return res.send(echo(null,"No tienes permisos para acceder a esta página.",true))}


//Inicio Codigo
const user_check = await models.users.count({
  where: {
    username: req.body.email,
  },
});
if (user_check > 0) {return res.send(echo(null,"Este E-mail ya existe.",true))}
if(req.body.type == "google") {
	req.body.password = payload.sub + "12" + Math.floor(Math.random() * 1000000000);
}
let new_user = null;
try {
new_user = await models.users.create({ 
	email: req.body.email,
	password: md5(req.body.password),
	name: req.body.name,
	role: req.body.type_user,
});
} catch(e) {return res.send(echo(null,"Invalid register.",true))}	



// Respuesta
return res.send(echo(new_token,{name: req.body.name, role: req.body.type_user}));
}
