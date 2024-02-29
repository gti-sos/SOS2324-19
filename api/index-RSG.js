let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.json());
const API_BASE = '/api/v1/covid-testings';

var datos = [];


function RSG(app) {
    //POST1
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const cond = datos.some(i => i.country === data.country && i.year_week === data.year_week);
        if (cond) {
            //No se puede hacer un POST con un recurso que ya existe;
            //en el caso contrario se debe devolver el código 409
            res.sendStatus(409, "CONFLICT");
        } else if (!data || Object.keys(data).length === 0) {
            //Si se recibe un dato (JSON) que no tiene los 
            //campos esperados se debe devolver el código 400
            res.sendStatus(400, "BAD REQUEST");
        } else {
            //Crea un nuevo dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });
    //GET1
    app.get(API_BASE + "/", (req, res) => {
        //lista todos los datos
        res.send(JSON.stringify(datos));
        res.sendStatus(200, "OK");
    });
    //PUT1
    app.put(API_BASE + "/", (req, res) => {
        //Si se intenta usar alguno de los métodos no permitidos 
        //por la tabla azul se debe devolver el código 405
        let data = req.body;
        res.sendStatus(405, "Method not allowed");
    });
    //DELETE1
    app.delete(API_BASE + "/", (req, res) => {
        //Borrar todos los datos
        datos.splice(0, datos.length);
        res.sendStatus(200, "Delete all");
    });



    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array
    //de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0) {
            let datos1 =
            [
                { country: 'Sweden', country_code: 'SE', year_week: '2023-W39', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 595, tests_done: 4717, population: 10452326, testing_rate: 45.12871106392969, positivity_rate: 12.613949544201823, testing_data_source: 'TESSy COVID-19' },
                { country: 'Sweden', country_code: 'SE', year_week: '2020-W46', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 31319, tests_done: 248350, population: 10452326, testing_rate: 2376.0261591534745, positivity_rate: 12.61083148781961, testing_data_source: 'TESSy COVID-19' },
                { country: 'Sweden', country_code: 'SE', year_week: '2021-W02', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 28935, tests_done: 199075, population: 10452326, testing_rate: 1904.5999904710204, positivity_rate: 14.53472309431119, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W45', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 44772, tests_done: 199567, population: 8978929, testing_rate: 2222.6147461462274, positivity_rate: 22.434570845881332, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W46', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 47837, tests_done: 215044, population: 8978929, testing_rate: 2394.9849698109874, positivity_rate: 22.245214932757946, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W47', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 40699, tests_done: 207745, population: 8978929, testing_rate: 2313.6946511103943, positivity_rate: 19.590844544995065, testing_data_source: 'TESSy COVID-19' },
                { country: 'Spain', country_code: 'ES', year_week: '2022-W39', level: 'national', region: 'ES', region_name: 'Spain', new_cases: 17740, tests_done: 147653, population: 47432893, testing_rate: 311.2882024716477, positivity_rate: 12.014655983962399, testing_data_source: 'TESSy COVID-19' },
                { country: 'Spain', country_code: 'ES', year_week: '2022-W45', level: 'national', region: 'ES', region_name: 'Spain', new_cases: 20387, tests_done: 153294, population: 47432893, testing_rate: 323.1807935476337, positivity_rate: 13.299281119939463, testing_data_source: 'TESSy COVID-19' },
                { country: 'Slovenia', country_code: 'SI', year_week: '2021-W15', level: 'national', region: 'SI', region_name: 'Slovenia', new_cases: 5523, tests_done: 197068, population: 2107180, testing_rate: 9352.214808416937, positivity_rate: 2.802585909432277, testing_data_source: 'TESSy COVID-19' },
                { country: 'Slovenia', country_code: 'SI', year_week: '2021-W17', level: 'national', region: 'SI', region_name: 'Slovenia', new_cases: 4680, tests_done: 178232, population: 2107180, testing_rate: 8458.318700822902, positivity_rate: 2.62579110372997, testing_data_source: 'TESSy COVID-19' },
                { country: 'Norway', country_code: 'NO', year_week: '2021-W45', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 11822, tests_done: 144861, population: 5425270, testing_rate: 2670.115957362491, positivity_rate: 8.160926681439449, testing_data_source: 'TESSy COVID-19' },
                { country: 'Norway', country_code: 'NO', year_week: '2022-W01', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 46620, tests_done: 298912, population: 5425270, testing_rate: 5509.624405789942, positivity_rate: 15.59656353709453, testing_data_source: 'TESSy COVID-19' }
            
            ]   
            for (let i = 0; i < datos1.length; i++) {
                datos.push(datos1[i]);
            }
            res.sendStatus(201, "Data created");
        } else {
            res.send(JSON.stringify(datos))
            res.sendStatus(200, "OK");
        }
    });
    //POST2
    //Si se intenta usar alguno de los métodos no permitidos por la 
    //tabla azul se debe devolver el código 405
    app.post(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });
    //GET2
    app.get(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        const countryDatos = datos.filter(p => p.country === pais);

        if (countryDatos.length > 0) {
            //muestra los datos con los filtros especificados
            res.send(JSON.stringify(countryDatos))
            res.sendStatus(200, "Ok");
        } else {
            //Si se intenta acceder a un recurso 
            //inexistente se debe devolver el código 404
            res.sendStatus(404, "Not Found");
        }
    });
    //PUT2
    app.put(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;

        let updated = false;
        for (let i = 0; i < datos.length; i++) {
            if (datos[i].country === pais) {
                datos[i] = data;
                updated = true;
                break;
            }
        }

        if (!updated) {
            res.sendStatus(404, "Not Found");
        } else {
            res.sendStatus(200, "Ok");
        }
    });

    //DELETE2
    app.delete(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        const nuevoDatos = datos.filter(entry => entry.country !== pais);

        if (nuevoDatos.length < datos.length) {
            //eliminar los datos del filtro espedificado
            datos = nuevoDatos;
            res.sendStatus(200, "Ok");
        } else {
            //Si se intenta acceder a un recurso 
            //inexistente se debe devolver el código 404
            res.sendStatus(404, "Not Found");
        }
    });


}

module.exports.rsgv1 = RSG;
