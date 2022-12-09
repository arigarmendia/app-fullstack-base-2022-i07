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

//app.get('/devices/', function(req, res, next) {
//    devices = [
//        { 
//            'id': 1, 
//            'name': 'Lampara 1', 
//            'description': 'Luz living', 
//            'state': 0, 
//            'type': 1, 
//        },
//        { 
//            'id': 2, 
//            'name': 'Ventilador 1', 
//            'description': 'Ventilador Habitacion', 
//            'state': 1, 
//            'type': 2, 
//        },
//    ]
//    res.send(JSON.stringify(devices)).status(200);
//});


// Funcion para validar los datos
function validateInput(datos) {
    return ((datos.name != "" && datos.hasOwnProperty("name")) && (datos.hasOwnProperty("type")));    
}

// Funcion para hacer la consulta de todos los dispositivos a la DB
function callMeMayBe(rows) {
    utils.query('SELECT * from Devices', (err, rows) => {  
        if (err){ 
            return (false); 
        } else {
            return (true);
        }
        console.log('The data from Devices table are: \n', rows);
        //res.send(JSON.stringify(rows)).status(200);
    });
    //return (rows);
    //return res.send(JSON.stringify(rows)).status(200);
}


//=======[ Obtener solo un dispositivo :ID ]==================================================

app.get('/buscarDispositivo', function (req, res) {
    let deviceID = req.query.deviceID;
    console.log("Pidieron ver un solo dispositivo con el ID: " + deviceID);
    let query = 'SELECT * FROM Devices WHERE id =?';
    utils.query(query, [deviceID], (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        // rows fetch
        console.log(data);
        res.send(JSON.stringify(data)).status(200);
    });
});


//=======[ Obtener la lista de dispositivos ]==================================================
app.get('/devices/', function (req, res) {

    //console.log("pidieron ver la DB");
    //let rows = [];
    //if (callMeMayBe(rows)) {
    //    res.send(JSON.stringyfy(rows)).status(200);
    //} else {
    //    res.send(error).status(400);
    //}

        utils.query('SELECT * from Devices', (err, rows) => {  
            if (err){ 
                throw err; 
                res.send( err).status(400); 
               return
            }
            console.log('The data from Devices table are: \n', rows);
            res.send(JSON.stringify(rows)).status(200);
        });
    //res.send(JSON.stringyfy(callMeMayBe())).status(200);
});



//=======[ Crear nuevo dispositivo ]==================================================
// Inserta un dispositivo nuevo con las caracteristicas ingresadas en el POST
app.post("/nuevoDispositivo", function (req, res) {
    console.log("pidieron insertar en la DB");
        let data = req.body;
        console.log(req.body);
        if (validateInput(data)) {
            let querydescription = ((req.body.hasOwnProperty("description") && (req.body.description != "")) ? req.body.description : "");
            let querystate = ((req.body.hasOwnProperty("state") && (req.body.state === 0 || req.body.state === 1)) ? req.body.state  : 0);
            //let querydimmable = ((req.body.hasOwnProperty("dimmable") && (req.body.dimmable === 0 || req.body.dimmable === 1)) ?  req.body.dimmable : 0);
            //Query build
            query = 'INSERT INTO Devices (name, description, type, state) VALUES ( ?, ?, ?, ?)';
            console.log(query);
            utils.query(query,[req.body.name, querydescription, req.body.type, querystate], (err, response) => {
                if (err) {
                    console.error(err);
                    res.send("Error creating device").status(300);
                    return;
                }
                utils.query('SELECT * from Devices', (err, rows) => {  
                    if (err){ 
                        throw err; 
                        res.send( err).status(400); 
                        return
                    }
                    console.log('The data from Devices table are: \n', rows);
                    res.send(JSON.stringify(rows)).status(200);
                });
                // res.send(JSON.stringify(response)).status(200);
                //callMeMayBe();
            });
        } else {
            res.send("Bad Data").status(300);
        }
});


//=======[ Borrar dispositivo ]==================================================

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
            utils.query('SELECT * from Devices', (err, rows) => {  
                if (err){ 
                    throw err; 
                    res.send( err).status(400); 
                    return
                }
                console.log('The data from Devices table are: \n', rows);
                res.send(JSON.stringify(rows)).status(200);
            });
            //res.send(JSON.stringify(response)).status(200);
        });
});


//=======[ Cambiar el estado ]==================================================
app.post("/cambiarEstadoDispositivo", function (req, res) {
    console.log("pidieron cambiar el estado del dispositivo en la DB a " + req.body.state);
        let data = req.body;
        let query = 'UPDATE Devices SET state = ? WHERE id = ?';
        utils.query(query,[req.body.state, req.body.id], (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            utils.query('SELECT * from Devices', (err, rows) => {  
                if (err){ 
                    throw err; 
                    res.send( err).status(400); 
                    return
                }
                console.log('The data from Devices table are: \n', rows);
                res.send(JSON.stringify(rows)).status(200);
            });
        });
});


//=======[ Editar el dispositivo]==================================================
app.post("/modificarDispositivo", function (req, res) {
    console.log("pidieron modificar un dispositivo en la DB");
        let data = req.body;
        console.log(req.body);
        if (validateInput(data)) {
            let querydescription = ((req.body.hasOwnProperty("description") && (req.body.description != "")) ? req.body.description : "");
            let querystate = ((req.body.hasOwnProperty("state") && (req.body.state === 0 || req.body.state === 1)) ? req.body.state  : 0);
            //let querydimmable = ((req.body.hasOwnProperty("dimmable") && (req.body.dimmable === 0 || req.body.dimmable === 1)) ?  req.body.dimmable : 0);
            //Query build
            query = 'UPDATE Devices SET name = ?, description = ?, state = ?, type = ? WHERE id = ?';
            console.log(query);
            utils.query(query,[req.body.name, req.body.description, req.body.state, req.body.type, req.body.id], (err, response) => {
                if (err) {
                    console.error(err);
                    res.send("Error creating device").status(300);
                    return;
                }
                utils.query('SELECT * from Devices', (err, rows) => {  
                    if (err){ 
                        throw err; 
                        res.send( err).status(400); 
                        return
                    }
                    console.log('The data from Devices table are: \n', rows);
                    res.send(JSON.stringify(rows)).status(200);
                });
                // res.send(JSON.stringify(response)).status(200);
                //callMeMayBe();
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
