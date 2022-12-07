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

//=======[ Obtener la lista de dispositivos ]==================================================
app.get('/devices/', function (req, res) {

    console.log("pidieron ver la DB");
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

// Funcion para validar los datos
function validateInput(datos) {
    return ((datos.name != "" && datos.hasOwnProperty("name")) && (datos.hasOwnProperty("type")));
}

//=======[ Crear nuevo dispositivo ]==================================================
// Inserta un dispositivo con los datos enviados en el cuerpo del POST
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
            });
        } else {
            res.send("Bad Data").status(300);
        }
});




app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
