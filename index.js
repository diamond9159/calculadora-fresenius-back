const https = require('https');
const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors')
const sequelize = require("./database");
var mainRoutes = require('./src/mainRoutes');
var helmet = require('helmet');
var multer = require('multer');
var forms = multer({
  limits: { fieldSize: 50000000 }
});
var compression = require('compression');
//Iniciando express
const app = express();

//Static files
app.use('/assets',express.static('./assets'));


//Configuraciones
app.set('port',4002);

//Middlewares
app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({extended: false}));
app.use(forms.array()); 
app.use(bodyParser.json());
var corsOptions = {
    credentials: true,
    origin:'*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

//Variables globales
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Content-type', 'application/json');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

app.get('/', function(req, res) {
  res.send('API REST 1.0');
});

/*
const sslServer = https.createServer ({
 key: fs.readFileSync('/var/www/privkey.pem'),
 cert: fs.readFileSync('/var/www/fullchain.pem')
}, app); */

//const server = http.createServer(app);
//Inicializar base de datos y asginar las rutas
sequelize.authenticate()
  .then(() => {
	app.use('/api', mainRoutes);
	console.log("Conectado Correctamente a la base de datos");
  })
  .catch(err => {
	app.use('/api', function (req, res) {return res.send({"response":"error","error":"Internal Error."})});
	console.log("Error de conexión a la base de datos");
  })
  

app.listen(app.get('port'), () => {
//sslServer.listen(app.get('port'), "0.0.0.0", () => {
    console.log('Servidor en puerto', app.get('port'));
})
