var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(multer({dest:__dirname+'/FISINT/media'}).any());


// Binding express app to port 3000
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});

//Static Routes
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/FISINT',  express.static(__dirname + '/FISINT'));
app.use(express.static(__dirname + '/angular'));

//Connect to MYSQL
var logged = false;
var usuario = "";
var mysql = require('mysql')
var tema = 1;

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

	connection.query('select count(*) as valor,grupo as grupo,tipo  from (select nombre_u, pass, grupo,tipo from usuarios where nombre_u = ? and pass = ?) as T', [req.body.user,req.body.password], function(err, result) {

	if (err) throw err
	if (result[0].valor == 1){
		logged = true;
		usuario = req.body.user;
		console.log(result);
		if (result[0].tipo == 0) res.sendFile('index_admin.html',{'root': __dirname + '/FISINT'});
		else if(result[0].grupo == 0) res.sendFile('encuesta.html',{'root': __dirname + '/FISINT'});
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
			
			connection.query('insert into usuarios values (?,?,?,1,0)',[req.body.user,req.body.password,req.body.correo], function(err, result) {
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


app.get('/load',function(req,res){
  connection.query("SELECT * from contenido",function(err,rows){
    if(err)
      {
        console.log("Problem with MySQL"+err);
      }
      else
        {
		  //console.log(JSON.stringify(rows))
          res.end(JSON.stringify(rows));
        }
  });
});

//Angular Stuff
app.get('/loadUsers',function(req,res){
  connection.query("SELECT * from usuarios",function(err,rows){
    if(err)
      {
        console.log("Problem with MySQL"+err);
      }
      else
        {
		  //console.log(JSON.stringify(rows))
          res.end(JSON.stringify(rows));
        }
  });
});

app.get('/loadUnidades',function(req,res){
  connection.query("SELECT * from temas",function(err,rows){
    if(err)
      {
        console.log("Problem with MySQL"+err);
      }
      else
        {
		  //console.log(JSON.stringify(rows))
          res.end(JSON.stringify(rows));
        }
  });
});

//Ver Contenido
app.post('/VerContenido',function(req,res){
  res.sendFile('/FISINT/contenido_viewer.html',{'root': __dirname});
});

app.post('/MostrarUnidades',function(req,res){
  connection.query("SELECT * from temas",function(err,rows){
    if(err)
      {
        console.log("Problem with MySQL"+err);
      }
      else
        {
		  //console.log(JSON.stringify(rows))
		  
          res.end(JSON.stringify(rows));
        }
  });
});

app.post('/MostrarUsuarios',function(req,res){
  connection.query("SELECT * from usuarios",function(err,rows){
    if(err)
      {
        console.log("Problem with MySQL"+err);
      }
      else
        {
		  //console.log(JSON.stringify(rows))
		  console.log(JSON.stringify(rows));
          res.end(JSON.stringify(rows));
        }
  });
});

//Modificar Contenido
app.post('/ModificarContenido', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   response = {
       id:req.body.id_borrar,
   };
	
	
   console.log(response);
   connection.query('delete from contenido where id=?',[req.body.id_borrar], function(err, result) {
				if (err) throw err
				res.sendFile('/FISINT/contenido_viewer.html',{'root': __dirname});
	})

//res.end(JSON.stringify(response))
})

//Modificar Unidades
app.post('/ModificarUnidades', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   response = {
       id:req.body.id_borrar,
   };
	
	//console.log(req);
   //console.log(req);
   connection.query('delete from temas where id=?',[req.body.id_borrar], function(err, result) {
				if (err) throw err
				res.sendFile('/FISINT/unidades_viewer.html',{'root': __dirname});
	})

//res.end(JSON.stringify(response))
})

//Modificar Usuarios
app.post('/ModificarUsuarios', urlencodedParser, function (req, res) {
	
   // Prepare output in JSON format
   response = {
       id:req.body.correo,
   };
	
	
   //console.log("Estoy Aca");
   //console.log(req);
   connection.query('delete from usuarios where correo=?',[req.body.correo], function(err, result) {
				if (err) throw err
				res.sendFile('/FISINT/usuarios_viewer.html',{'root': __dirname});
	})


})


//Mostrar COntenido Usuario
app.post('/MostrarContenidoAux',urlencodedParser,function(req,res){
	response = {
       id:req.body.id_tema,
	};
	
	console.log(res);
	
	connection.query('select * from contenido where temasid = ?',[req.body.id_tema], function(err, result) {
				if (err) throw err
				tema = req.body.id_tema;
				//console.log("Nueva Variable:")
				//console.log(req.body.id_tema)
				//console.log(tema)
				//console.log(res);
				
				res.sendFile('/FISINT/mostrar_contenido.html',{'root': __dirname});
	})		
  
});

app.post('/MostrarContenido',urlencodedParser,function(req,res){
	connection.query('select * from contenido where temasid = ?',[tema], function(err, result) {
				if (err) throw err
				console.log("Estoy enviando:");
				console.log(JSON.stringify(result));
				res.end(JSON.stringify(result));
	})		
  
});

app.post('/AdminPanel',urlencodedParser,function(req,res){ 
	res.sendFile('/FISINT/index_admin.html',{'root': __dirname});
})

app.post('/AgregarUnidad',urlencodedParser,function(req,res){ 
	
	response = {
       nombre:req.body.nombre,
	   descripcion:req.body.descripcion
	   
	};
	connection.query('insert into temas values (default,?,1,?)',[req.body.nombre,req.body.descripcion], function(err, result) {
				if (err) throw err

				
	})	
	res.sendFile('/FISINT/unidades_viewer.html',{'root': __dirname});
})

app.post('/SubirArchivo',urlencodedParser,function(req,res){ 
	console.log(req.files[0]);
	console.log(req.files[0].path);
	console.log(req.files[0].destination+'/'+req.files[0].originalname);
	response = {
       id:req.body.id_unidad
	   
	};
	console.log(response);
	fs.rename(req.files[0].path, req.files[0].destination+'\\'+req.files[0].originalname, function(err){})
	
	connection.query('insert into contenido values (default,?,?,10,?,1)',[req.files[0].originalname,'../FISINT/media/'+req.files[0].originalname,req.body.id_unidad], function(err, result) {
				if (err) throw err
				console.log("Estoy enviando:");
				console.log(JSON.stringify(result));
	})
	
	res.sendFile('/FISINT/contenido_viewer.html',{'root': __dirname});
})


app.get('/chupalo.html',urlencodedParser,function(req,res){ 
	res.sendFile('/FISINT/media/max.jpg',{'root': __dirname});
})