//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');


// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================


// Funcion para validar que llegan en el json las propiedades name y type, y que no vienen vacias
function validateInput(datos) {
    //return ((datos.name != "" && datos.hasOwnProperty("name")) && (datos.hasOwnProperty("type")));
    return ((datos.name != "" && datos.type != "" && datos.hasOwnProperty("name")) && (datos.hasOwnProperty("type")));       
}


//=======[ Obtener solo un dispositivo :ID ]==================================================
// API para traer los datos de un dispositivo en particular
// Input: id del dispositivo
// Respuesta: JSON con todos los datos de ese dispositivo (200) / Error (400)

app.get('/buscarDispositivo', function (req, res) {
    let deviceID = req.query.deviceID;
    console.log("Pidieron ver un solo dispositivo con el ID: " + deviceID);
    let query = 'SELECT * FROM Devices WHERE id =?';
    utils.query(query, [deviceID], (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        //console.log(data);
        res.send(JSON.stringify(data)).status(200);
    });
});


//=======[ Obtener la lista de dispositivos ]==================================================
// API para traer todos los datos de la DB
// Input: Ninguna 
// Respuesta: JSON con todos los dispositivos de la tabla (200) / Error (400)
// Nota: Se realiza una validación para asegurar que nombre y tipo de dispositivo están (son obligatorios)

app.get('/devices/', function (req, res) {

        utils.query('SELECT * from Devices', (err, rows) => {  
            if (err){ 
                res.send( err).status(400); 
               return
            }
            console.log('The data from Devices table are: \n', rows);
            res.send(JSON.stringify(rows)).status(200);
        });
   
});



//=======[ Crear nuevo dispositivo ]==================================================
// API para crear un dispositivo
// Input: todos los datos del elemento (name, description, type state) 
// Respuesta: OK (200) / Error (400)
// Nota: Se realiza una validación para asegurar que nombre y tipo de dispositivo están (son obligatorios)

app.post("/nuevoDispositivo", function (req, res) {
    console.log("Se pidio insertar en la DB");
        let data = req.body;
        console.log(req.body);
        if (validateInput(data)) {
            
            query = 'INSERT INTO Devices (name, description, type, state, dimmer) VALUES ( ?, ?, ?, ?, ?)';
            console.log(query);
            utils.query(query,[req.body.name, req.body.description, req.body.type, req.body.state, req.body.dimmer], (err, response) => {
                if (err) {
                    console.error(err);
                    res.send("Error creating device").status(400);
                    return;
                }
                res.status(200)
                });
           
        } else {
            res.send("Bad Data").status(300);
        }
});


//=======[ Borrar dispositivo ]==================================================
// API para borrar un dispositivo
// Input: id del dispositivo
// Respuesta: OK (200) / Error (400)

app.delete("/borrarDispositivo", function (req, res) {
    console.log("Request para remover un dispositivo de la DB");
        let data = req.body;
        let query = 'DELETE from Devices WHERE id = ' + data.id;
        console.log(query);
        utils.query(query, (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            res.status(200);
        });
});


//=======[ Cambiar el estado ]==================================================
// API para cambiar el estado del dispositivo (ON/OFF)
// Input: id del dispositivo, estado actual (state) del dispositivo
// Output: OK (200) / Error (400)

app.put("/cambiarEstadoDispositivo", function (req, res) {
    console.log("Se pidió cambiar el estado del dispositivo en la DB a " + req.body.state);

        let query = 'UPDATE Devices SET state = ? WHERE id = ?';
        utils.query(query,[req.body.state, req.body.id], (err, response) => {
            if (err) {
                res.send(err).status(400);
                return;
            }
            res.status(200);
        });
});


//=======[ Editar el dispositivo]==================================================
// API para editar los datos de un dispositivo
// Input: Todos los datos del dispostivo de acuerdo a su id
// Output: OK (200) / Error (400)

app.put("/modificarDispositivo", function (req, res) {
    console.log("pidieron modificar un dispositivo en la DB");
        let data = req.body;
        
        if (validateInput(data)) {
            console.log(data)
            query = 'UPDATE Devices SET name = ?, description = ?, state = ?, dimmer = ?, type = ? WHERE id = ?';
            console.log(query);
            
            utils.query(query,[data.name, data.description, data.state, data.dimmer, data.type, data.id], (err, response) => {
                if (err) {
                    res.send(err).status(400);
                    console.log("Ejecuto ERROR");
                    return;
                }
                console.log("Ejecuto OK");
                res.status(200);
            });
        } else {
            res.send("Bad Data").status(300);
        }
});



// Mensaje OK para la consola
app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
