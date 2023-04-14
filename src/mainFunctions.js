const moment = require('moment');
var md5 = require('md5');
var initModels = require("./models/init-models");
const sequelize = require("../database");
var models = initModels(sequelize);
const { randomUUID } = require('crypto');
const main_key = "Sa06ww5z%Ton";
var AES = require('../aes');

var mainFunctions = {};

mainFunctions.validationsA = async function (user_id) {
let result;
try{
result = await models.users.findOne({
	attributes: ['role','complete_profile','email_verified','phone_verified'],
  where: {
    id: user_id,
  },
});
} catch (e) {return "Token"}
if (result === null) {return "Token"}
if (result.role != "l") {return "Role"}
if (result.complete_profile == false) {return "Profile Verified"}
// if (result.documents_verified == false) {return "Documents Verified"}
// if (result.complete_profile == false) {return "Phone Verified"}
// if (result.email_verified == false) {return "Email Verified"}
return false;
}

mainFunctions.encrypt = function (string) {
	AES.size(192);
    var enc = AES.enc(string, main_key);
	return encodeURIComponent(enc);
}

mainFunctions.decrypt = function (string) {
	AES.size(192);
    var dec = AES.dec(string, main_key);
	var final_string = JSON.parse(dec);
	return final_string;
}

mainFunctions.echo = function (token=null,Return=null,error=false) {
	var errorRes = error ? "error" : "ok";

	var array = {
	"response" : errorRes
	};
	if(Return!=null) {
		array["data"] = Return;
	}
	if(error==true) {
		delete array.data;
		array["error"] = Return;
	}
	if(token!=null) {
		array["token"] = token;
	}

	return JSON.stringify(array,null,2)
}

mainFunctions.getDate = function () {
	return moment().utc().format('Y-M-D');
}

mainFunctions.generateTokenByToken = async function (last_token,ip) {
	try {var decrypt = mainFunctions.decrypt(last_token);} catch (e) {return false;}
	if(decrypt == false) {return false;}
	const result = await models.tokens.findOne({
		attributes: ['id'],
	  where: {
		user_id: decrypt.user_id,
		token_md5: decrypt.token,
		session_id: decrypt.session_id,
	  },
	});
	if(result === null) {return false};
	// var token = md5(Date.now()+randomUUID());
	// var array = {
	// "session_id" : decrypt.session_id,
	// "user_id" : decrypt.user_id,
	// "role" : decrypt.role,
	// "token" : token
	// };
	// var token_array = JSON.stringify(array);
	// var final_token = mainFunctions.encrypt(token_array);
	// await models.tokens.update({ 
		// token_md5: token,
		// ip: ip
	// }, {
	  // where: {
		// session_id: decrypt.session_id
	  // }
	// });
	
	return encodeURIComponent(last_token);
}

mainFunctions.generateFirstToken = async function (email,token,user_ip,user_id=false,type) {
	var type_user;
	if(user_id == false) {
		const result = await models.users.findOne({
			attributes: ['id','role'],
		  where: {
			username: email,
		  },
		});
		user_id = result.id;
		type_user = result.role;
	} else {
		const result = await models.users.findOne({
			attributes: ['id','role'],
		  where: {
			id: user_id,
		  },
		});
		user_id = result.id;
		type_user = result.role;
	}
	var session_id = user_id + randomUUID();
	var new_token = md5(Date.now()+randomUUID());
	array = {
	"session_id" : session_id,
	"user_id" : user_id,
	"role" : type_user,
	"token" : new_token
	};
	var token_array = JSON.stringify(array);
	var final_token = mainFunctions.encrypt(token_array);
	await models.tokens.create({ user_id: user_id, token_md5: new_token, ip: user_ip, session_id: session_id, last_date: moment().utc().format('Y-M-D')});
	return final_token;
}

module.exports = mainFunctions;