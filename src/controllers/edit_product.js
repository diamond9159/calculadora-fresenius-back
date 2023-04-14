const {echo,generateTokenByToken,getDate,decrypt} = require('../mainFunctions');
var initModels = require("../models/init-models");
const sequelize = require("../../database");
var models = initModels(sequelize);
var validator = require('validator');
var md5 = require('md5');

module.exports = async function (req, res) {
//validar las variables requeridas
if(req.query.token === undefined || req.query.token === "") {return res.send(echo(null,"Invalid Token.",true))}
if(req.body.id >= 12) {
if(req.body.name === undefined || req.body.name === "") {return res.send(echo(null,"Nombre no ingresado.",true))}
if(!(req.body.presentacionGr === undefined)) {if(!validator.isInt(req.body.presentacionGr)) {return res.send(echo(null,"presentacionGr no válido.",true))}} else {return res.send(echo(null,"presentacionGr no válido.",true))}
if(!(req.body.rendimientoPorciones === undefined)) {if(!validator.isFloat(req.body.rendimientoPorciones)) {return res.send(echo(null,"rendimientoPorciones no válido.",true))}} else {return res.send(echo(null,"rendimientoPorciones no válido.",true))}
if(!(req.body.tamanoPorcion === undefined)) {if(!validator.isFloat(req.body.tamanoPorcion)) {return res.send(echo(null,"tamanoPorcion no válido.",true))}} else {return res.send(echo(null,"tamanoPorcion no válido.",true))}
if(!(req.body.porcionLiquida === undefined)) {if(!validator.isInt(req.body.porcionLiquida)) {return res.send(echo(null,"porcionLiquida no válido.",true))}} else {return res.send(echo(null,"porcionLiquida no válido.",true))}
if(!(req.body.cantidadProteinaPorPorcion === undefined)) {if(!validator.isFloat(req.body.cantidadProteinaPorPorcion)) {return res.send(echo(null,"cantidadProteinaPorPorcion no válido.",true))}} else {return res.send(echo(null,"cantidadProteinaPorPorcion no válido.",true))}
if(!(req.body.caloriasPorPorcion === undefined)) {if(!validator.isInt(req.body.caloriasPorPorcion)) {return res.send(echo(null,"caloriasPorPorcion no válido.",true))}} else {return res.send(echo(null,"caloriasPorPorcion no válido.",true))}
if(!(req.body.CaloriasPorMl === undefined)) {if(!validator.isFloat(req.body.CaloriasPorMl)) {return res.send(echo(null,"CaloriasPorMl no válido.",true))}} else {return res.send(echo(null,"CaloriasPorMl no válido.",true))}
if(!(req.body.ProteinaPorMl === undefined)) {if(!validator.isFloat(req.body.ProteinaPorMl)) {return res.send(echo(null,"ProteinaPorMl no válido.",true))}} else {return res.send(echo(null,"ProteinaPorMl no válido.",true))}
if(req.body.type != "fresenius" && req.body.type != "otro") {return res.send(echo(null,"Type inválido.",true))}
if(req.body.suministro != "polvo" && req.body.suministro != "liquido") {return res.send(echo(null,"Suministro inválido.",true))}
} else {
if(!(req.body.suministro === undefined)) {if(!validator.isFloat(req.body.suministro)) {return res.send(echo(null,"Valor no válido.",true))}} else {return res.send(echo(null,"Valor no válido.",true))}
}
if(!validator.isInt(req.body.id)) {return res.send(echo(null,"ID No válido.",true))}
if(req.body.categoria != "pediatrica" && req.body.categoria != "polimerica" && req.body.categoria != "diabetes"){return res.send(echo(null, "Categoria no válida.", true))}


//validar token

var clientip = req.socket.remoteAddress;
var xffip  = req.header('X-Forwarded-For');
var ip = xffip ? xffip : clientip;

var new_token = await generateTokenByToken(req.query.token, ip.split(",")[0]);

//var new_token = await generateTokenByToken(req.query.token, req.headers['x-forwarded-for'].split(",")[0]);
if (new_token === false) {return res.send(echo(null, "Invalid Token.", true))}
if(decrypt(req.query.token).role != "a") {return res.send(echo(null,"No tienes permisos para acceder a esta página.",true))}


//Inicio Codigo
try {
var campos;
if(req.body.id >= 12) {
	campos = { 
		name: req.body.name,
		presentacionGr: req.body.presentacionGr,
		rendimientoPorciones: req.body.rendimientoPorciones,
		tamanoPorcion: req.body.tamanoPorcion,
		porcionLiquida: req.body.porcionLiquida,
		cantidadProteinaPorPorcion: req.body.cantidadProteinaPorPorcion,
		caloriasPorPorcion: req.body.caloriasPorPorcion,
		CaloriasPorMl: req.body.CaloriasPorMl,
		ProteinaPorMl: req.body.ProteinaPorMl,
		type: req.body.type,
		suministro: req.body.suministro,
		TipoEnvase: req.body.TipoEnvase,
		categoria: req.body.categoria,
	};
} else {
	campos = {
		suministro: req.body.suministro,
	}
}

await models.productos.update(campos, {
  where: {
    id: req.body.id,
  }
});
} catch(e) {console.error(e);return res.send(echo(null,"Internal Error.",true))}



// Respuesta
return res.send(echo(null));
}
