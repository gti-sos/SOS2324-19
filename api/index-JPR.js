const API_BASE = "/api/v1/esif-payments";
let data_JPR = require('../index-JPR');
let data = [];

module.exports = (app) => {
    //GET petition
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(data));
        res.sendStatus(200, "OK");
    });
    //POST petition
    app.post(API_BASE+"/", (req,res)=>{
        let attempt = req.body;
        let invalid = attempt.any(a => a.cci == cci && a.title == title);
        if(invalid){
            //Can´t post an existing resource, it throws an 409 error
            res.sendStatus(409,"Conflict");
        }else if(!data || Object.keys(data).length === 0){
            //Si se recibe un dato (JSON) que no tiene los 
            //campos esperados se debe devolver el código 400
            res.sendStatus(400, "BAD REQUEST");
        }else{
            //Crea un nuevo dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });
    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData que al hacer un GET 
    //cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (data.length === 0) {
            data = data_JPR;
            res.sendStatus(201, "Data created");
        }else{
            //Una vez cargados los datos, si se vuelve a hacer una petición
            //loadInitialData saltará un error con código 405 Method Not Allowed.
            res.sendStatus(405, "Method Not Allowed");
        }
    });
}