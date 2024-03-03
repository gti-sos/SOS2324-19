const API_BASE = "/api/v1/esif-payments";
let data_JPR = require('../index-JPR');
let data = [];

module.exports = (app) => {
    app.get("/samples/JPR", (req, res) => {
        let pais = "Interreg"
        res.send(`<html> <body> <h1>La media de net pre financing de ${pais} es ${data_JPR.mediaFinancing(data_JPR.data_JPR, pais)}.</h1> </body> </html>`)
    });
    //POST petition
    app.post(API_BASE + "/", (req, res) => {
        let attempt = req.body;
        let invalid = data.some(d => d.cci == attempt.cci && d.title == attempt.title);
        if (invalid) {
            //Can´t post an existing resource, it throws an 409 error
            res.sendStatus(409, "Conflict");
        } else if (!attempt || Object.keys(attempt).length === 0) {
            //Can´t post an object without the expected fields
            res.sendStatus(400, "BAD REQUEST");
        } else {
            //If the object is valid, it will be added to the array
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
    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData que al hacer un GET
    //cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (data.length === 0) {
            data = data_JPR.data_JPR
            res.sendStatus(201, "Data created");
        } else {
            //If initial data is loaded cant be loaded again
            res.sendStatus(405, "Method Not Allowed");
        }
    });
    app.get(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;
        let attempt = data.filter(a => a.ms_name === country);

        if (attempt.length > 0) {
            //If the object exists, it will be sent
            res.send(JSON.stringify(attempt))
            res.sendStatus(200, "Ok");
        } else {
            //Can´t get an object that doesn´t exist
            res.sendStatus(404, "Not Found");
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
        let updated = false;

        for (let i = 0; i < data.length; i++) {
            if (data[i].ms_name === country) {
                //If the object exists, it will be updated
                data[i] = attempt;
                updated = true;
                break;
            }
        }
        if (updated) {
            //If the object is updated, it will be sent
            res.sendStatus(200, "Ok");
        } else {
            //Can´t put an object that doesn´t exist
            res.sendStatus(404, "Not Found");
        }
    });
    //DELETE petition
    app.delete(API_BASE + "/", (req, res) => {
        data = [];
        res.sendStatus(200, "OK");
    });
    app.delete(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;
        let initialLength = data.length;
        data = data.filter(a => a.ms_name !== country);

        if (data.length < initialLength) {
            res.status(200).send("Ok");
        } else {
            res.status(404).send("Not Found");
        }
    });
}
