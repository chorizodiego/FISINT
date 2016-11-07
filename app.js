var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Binding express app to port 3000
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});

//Static Routes
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/FISINT',  express.static(__dirname + '/FISINT'));


//Connect to MYSQL
var logged = false;
var usuario = "";
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'fisw'
})

connection.connect(function(err) {
	if (err) throw err
	console.log('You are now connected... Valores a Chequear')
})


///////////////////////////////////
// RETURN WEBPAGES
///////////////////////////////////

//Return Home GET
app.get('/',function(req,res){
    res.sendFile('login.html',{'root': __dirname + '/FISINT'});
})

//Return Home POST
app.post('/',function(req,res){
    res.sendFile('login.html',{'root': __dirname + '/FISINT'});
})

//Login
app.post('/Login', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   response = {
       first_name:req.body.user,
       last_name:req.body.password
   };

	connection.query('select count(*) as valor,grupo as grupo from (select nombre_u, pass, grupo from usuarios where nombre_u = ? and pass = ?) as T', [req.body.user,req.body.password], function(err, result) {

	if (err) throw err
	if (result[0].valor == 1){
		logged = true;
		usuario = req.body.user;
		console.log(result);
		if(result[0].grupo == 0) res.sendFile('encuesta.html',{'root': __dirname + '/FISINT'});
		else res.sendFile('index.html',{'root': __dirname + '/FISINT'});
		
	} 
	else res.sendFile('error_login.html',{'root': __dirname + '/FISINT'});
	})
   //res.end(JSON.stringify(response))
})

app.get('/asdf.html',function(req,res){
	if(logged) res.sendFile('index.html',{'root': __dirname + '/FISINT'});
	else res.sendFile('login.html',{'root': __dirname + '/FISINT'});
	
})

app.post('/Registro', urlencodedParser, function (req, res) {
	res.sendFile('registro.html',{'root': __dirname + '/FISINT'});
})

app.post('/RegistrarCuenta', urlencodedParser, function (req, res) {
	

   // Prepare output in JSON format
   response = {
       usuario:req.body.user,
       contrasenha:req.body.password,
	   correo:req.body.correo	   
   };
	//res.end(JSON.stringify(response))
	connection.query('select count(*) as valor from (select nombre_u, pass from usuarios where nombre_u = ?) as T', [req.body.user], function(err, result) {
		if (err) throw err
		
		if (result[0].valor == 0){
			console.log(result);
			
			connection.query('insert into usuarios values (?,?,?,0,0)',[req.body.user,req.body.password,req.body.correo], function(err, result) {
				if (err) throw err
				res.sendFile('registro_exitoso.html',{'root': __dirname + '/FISINT'});
			})			
		} 
		
		else res.sendFile('error_registro.html',{'root': __dirname + '/FISINT'});
		})
})

app.post('/EnviarEncuesta', urlencodedParser, function (req, res) {
	

	//res.end(JSON.stringify(response))
	connection.query('update usuarios set grupo = 1 where usuarios.nombre_u = ?', [usuario], function(err, result) {
		if (err) throw err
		res.sendFile('index.html',{'root': __dirname + '/FISINT'});
	})
})
