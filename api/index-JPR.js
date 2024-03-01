const API_BASE = "/api/v1/esif-payments";
let data_JPR = require('../index-JPR');
let data = [];

module.exports = (app) => {
    //POST petition
    app.post(API_BASE + "/", (req, res) => {
        let attempt = req.body;
        let invalid = attempt.any(a => a.cci == cci && a.title == title);
        if (invalid) {
            //Can´t post an existing resource, it throws an 409 error
            res.sendStatus(409, "Conflict");
        } else if (!attempt || Object.keys(attempt).length === 0) {
            //Can´t post an object without the expected fields
            res.sendStatus(400, "BAD REQUEST");
        } else {
            data.push(attempt);
            res.sendStatus(201, "CREATED");
        }
    });
    app.post(API_BASE + "/:country", (req, res) => {
        //Can´t post in a resource
        res.sendStatus(405, "Method Not Allowed");
    });
    //GET petition
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(data));
        res.sendStatus(200, "OK");
    });
    app.get(API_BASE + "/:country", (req, res) => {
        const country = req.params.country;
        const attempt = data.filter(a => a.ms_name === country);

        if (attempt.length > 0) {
            res.send(JSON.stringify(data))
            res.sendStatus(200, "Ok");
        } else {
            //Can´t get an object that doesn´t exist
            res.sendStatus(404, "Not Found");
        }
    });
    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData que al hacer un GET
    //cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0) {
            data = data_JPR
            res.sendStatus(201, "Data created");
        } else {
            //If initial data is loaded cant be loaded again
            res.sendStatus(405, "Method Not Allowed");
        }
    });
    //PUT petition
    app.put(API_BASE + "/", (req, res) => {
        //Can´t put in the base api
        let data = req.body;
        res.sendStatus(405, "Method not allowed");
    });
    app.put(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;
        let attempt = req.body;

        for (let i = 0; i < attempt.length; i++) {
            if (data[i].country !== country || Object.keys(attempt) === 0) {
                //Can´t update something that doesn´t exist
                res.sendStatus(400, "Bad Request");
                break;
            } else {
                data[i] = attempt;
                res.sendStatus(200, "OK");
                break;
            }
        }
    });
    //DELETE petition
    app.delete(API_BASE + "/", (req, res) => {
        data.splice(0, data.length);
        res.sendStatus(200, "OK");
    });
    app.delete(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;
        let attempt = data.filter(a => a.country === country);

        if (!attempt || Object.keys(attempt).length === 0) {
            //Can´t delete an object that doesn´t exist
            res.sendStatus(404, "Not Found");
        } else {
            data = data.remove(attempt);
            res.sendStatus(200, "Ok");
        }
    });
}
