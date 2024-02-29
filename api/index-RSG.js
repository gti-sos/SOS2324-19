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
                { country: 'Austria', country_code: 'AT', year_week: '2020-W41', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 7487, tests_done: 124663, population: 8978929, testing_rate: 1388.394985638042, positivity_rate: 6.005791614191861, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W42', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 9898, tests_done: 129647, population: 8978929, testing_rate: 1443.9027193555044, positivity_rate: 7.634576966686464, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W43', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 18262, tests_done: 158997, population: 8978929, testing_rate: 1770.7791207615073, positivity_rate: 11.485751303483713, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W44', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 31613, tests_done: 167926, population: 8978929, testing_rate: 1870.223052214802, positivity_rate: 18.825554113121257, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W45', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 44772, tests_done: 199567, population: 8978929, testing_rate: 2222.6147461462274, positivity_rate: 22.434570845881332, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W46', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 47837, tests_done: 215044, population: 8978929, testing_rate: 2394.9849698109874, positivity_rate: 22.245214932757946, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W47', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 40699, tests_done: 207745, population: 8978929, testing_rate: 2313.6946511103943, positivity_rate: 19.590844544995065, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W48', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 31142, tests_done: 196461, population: 8978929, testing_rate: 2188.022647244454, positivity_rate: 15.851492153658995, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W49', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 23070, tests_done: 163770, population: 8978929, testing_rate: 1823.9369082882824, positivity_rate: 14.086829089576845, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W50', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 18693, tests_done: 162984, population: 8978929, testing_rate: 1815.1830802983295, positivity_rate: 11.469223972905317, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W51', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 14841, tests_done: 185766, population: 8978929, testing_rate: 2068.91044577811, positivity_rate: 7.98908303995349, testing_data_source: 'TESSy COVID-19' },
                { country: 'Austria', country_code: 'AT', year_week: '2020-W52', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 13415, tests_done: 163961, population: 8978929, testing_rate: 1826.0641107642125, positivity_rate: 8.181823726373954, testing_data_source: 'TESSy COVID-19' }
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
        const countryDatos = datos.filter(p => p.ms_name === pais);

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
            if (datos[i].ms_name === pais) {
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
        const nuevoDatos = datos.filter(entry => entry.ms_name !== pais);

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
