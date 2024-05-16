const API_BASE = '/api/v2/covid-testings';

var datos = [];

let datos1 =
    [
        { country: 'Sweden', country_code: 'SE', year_week: '2023-W39', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 595, tests_done: 4717, population: 10452326, testing_rate: 45.12871106392969, positivity_rate: 12.613949544201823, testing_data_source: 'TESSy COVID-19' },
        { country: 'Sweden', country_code: 'SE', year_week: '2023-W46', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 31319, tests_done: 248350, population: 10452326, testing_rate: 2376.0261591534745, positivity_rate: 12.61083148781961, testing_data_source: 'TESSy COVID-19' },
        { country: 'Sweden', country_code: 'SE', year_week: '2024-W02', level: 'national', region: 'SE', region_name: 'Sweden', new_cases: 28935, tests_done: 199075, population: 10452326, testing_rate: 1904.5999904710204, positivity_rate: 14.53472309431119, testing_data_source: 'TESSy COVID-19' },
        { country: 'Norway', country_code: 'NO', year_week: '2024-W01', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 46620, tests_done: 298912, population: 5425270, testing_rate: 5509.624405789942, positivity_rate: 15.59656353709453, testing_data_source: 'TESSy COVID-19' },
        { country: 'Austria', country_code: 'AT', year_week: '2023-W45', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 44772, tests_done: 199567, population: 8978929, testing_rate: 2222.6147461462274, positivity_rate: 22.434570845881332, testing_data_source: 'TESSy COVID-19' },
        { country: 'Austria', country_code: 'AT', year_week: '2020-W46', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 47837, tests_done: 215044, population: 8978929, testing_rate: 2394.9849698109874, positivity_rate: 22.245214932757946, testing_data_source: 'TESSy COVID-19' },
        { country: 'Austria', country_code: 'AT', year_week: '2020-W47', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 40699, tests_done: 207745, population: 8978929, testing_rate: 2313.6946511103943, positivity_rate: 19.590844544995065, testing_data_source: 'TESSy COVID-19' },
        { country: 'Spain', country_code: 'ES', year_week: '2022-W39', level: 'national', region: 'ES', region_name: 'Spain', new_cases: 17740, tests_done: 147653, population: 47432893, testing_rate: 311.2882024716477, positivity_rate: 12.014655983962399, testing_data_source: 'TESSy COVID-19' },
        { country: 'Spain', country_code: 'ES', year_week: '2022-W45', level: 'national', region: 'ES', region_name: 'Spain', new_cases: 20387, tests_done: 153294, population: 47432893, testing_rate: 323.1807935476337, positivity_rate: 13.299281119939463, testing_data_source: 'TESSy COVID-19' },
        { country: 'Slovenia', country_code: 'SI', year_week: '2023-W15', level: 'national', region: 'SI', region_name: 'Slovenia', new_cases: 5523, tests_done: 197068, population: 2107180, testing_rate: 9352.214808416937, positivity_rate: 2.802585909432277, testing_data_source: 'TESSy COVID-19' },
        { country: 'Slovenia', country_code: 'SI', year_week: '2024-W17', level: 'national', region: 'SI', region_name: 'Slovenia', new_cases: 4680, tests_done: 178232, population: 2107180, testing_rate: 8458.318700822902, positivity_rate: 2.62579110372997, testing_data_source: 'TESSy COVID-19' },
        { country: 'Norway', country_code: 'NO', year_week: '2023-W45', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 11822, tests_done: 144861, population: 5425270, testing_rate: 2670.115957362491, positivity_rate: 8.160926681439449, testing_data_source: 'TESSy COVID-19' },
        { country: 'Germany', country_code: 'DE', year_week: '2024-W12', level: 'national', region: 'DE', region_name: 'Germany', new_cases: 28000, tests_done: 200000, population: 83783942, testing_rate: 2387.132, positivity_rate: 14.0, testing_data_source: 'RKI COVID-19' },
        { country: 'Italy', country_code: 'IT', year_week: '2024-W12', level: 'national', region: 'IT', region_name: 'Italy', new_cases: 45000, tests_done: 300000, population: 60367460, testing_rate: 4968.47, positivity_rate: 15.0, testing_data_source: 'Ministry of Health COVID-19' },
        { country: 'Canada', country_code: 'CA', year_week: '2021-W12', level: 'national', region: 'CA', region_name: 'Canada', new_cases: 33020, tests_done: 250000, population: 65233511, testing_rate: 3830.14, positivity_rate: 13.2, testing_data_source: 'Santé publique France COVID-19' },
        { country: 'Canada', country_code: 'CA', year_week: '2021-W13', level: 'national', region: 'CA', region_name: 'Canada', new_cases: 330310, tests_done: 250300, population: 65274511, testing_rate: 3834.14, positivity_rate: 13.72, testing_data_source: 'Santé publique France COVID-19' },
        { country: 'Canada', country_code: 'CA', year_week: '2021-W14', level: 'national', region: 'CA', region_name: 'Canada', new_cases: 330240, tests_done: 252100, population: 65279511, testing_rate: 3831.14, positivity_rate: 13.24, testing_data_source: 'Santé publique France COVID-19' },
        { country: 'Canada', country_code: 'CA', year_week: '2021-W15', level: 'national', region: 'CA', region_name: 'Canada', new_cases: 330610, tests_done: 250360, population: 65273501, testing_rate: 3832.14, positivity_rate: 13.7, testing_data_source: 'Santé publique France COVID-19' },
        { country: 'Norway', country_code: 'NO', year_week: '2024-W01', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 466220, tests_done: 298962, population: 5425270, testing_rate: 5504.624405789942, positivity_rate: 15.59656353709453, testing_data_source: 'TESSy COVID-19' },
        { country: 'Norway', country_code: 'NO', year_week: '2024-W01', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 466210, tests_done: 288912, population: 5425270, testing_rate: 5507.624405789942, positivity_rate: 15.59656353709453, testing_data_source: 'TESSy COVID-19' },
        { country: 'Norway', country_code: 'NO', year_week: '2024-W01', level: 'national', region: 'NO', region_name: 'Norway', new_cases: 416620, tests_done: 298612, population: 5425270, testing_rate: 5509.624405789942, positivity_rate: 15.59656353709453, testing_data_source: 'TESSy COVID-19' },
        { country: "Poland", country_code: "PL", year_week: "2021-W20", level: "national", region: "PL", region_name: "Poland", new_cases: 21234, tests_done: 185700, population: 37970000, testing_rate: 4894.3, positivity_rate: 11.4, testing_data_source: "Ministry of Health, Poland" },
        { country: "Poland", country_code: "PL", year_week: "2021-W25", level: "national", region: "PL", region_name: "Poland", new_cases: 31345, tests_done: 210500, population: 37970000, testing_rate: 5552.9, positivity_rate: 14.9, testing_data_source: "Ministry of Health, Poland" },
        { country: "Poland", country_code: "PL", year_week: "2021-W30", level: "national", region: "PL", region_name: "Poland", new_cases: 41236, tests_done: 235600, population: 37970000, testing_rate: 6201.1, positivity_rate: 18.1, testing_data_source: "Ministry of Health, Poland" },
        { country: "Denmark", country_code: "DK", year_week: "2021-W20", level: "national", region: "DK", region_name: "Denmark", new_cases: 15023, tests_done: 120400, population: 5806000, testing_rate: 2073.4, positivity_rate: 12.5, testing_data_source: "Statens Serum Institut" },
        { country: "Denmark", country_code: "DK", year_week: "2021-W25", level: "national", region: "DK", region_name: "Denmark", new_cases: 21534, tests_done: 145600, population: 5806000, testing_rate: 2504.8, positivity_rate: 14.8, testing_data_source: "Statens Serum Institut" },
        { country: "Denmark", country_code: "DK", year_week: "2021-W30", level: "national", region: "DK", region_name: "Denmark", new_cases: 30201, tests_done: 165700, population: 5806000, testing_rate: 2850.3, positivity_rate: 18.2, testing_data_source: "Statens Serum Institut" },
        { country: "Mexico", country_code: "MX", year_week: "2021-W20", level: "national", region: "MX", region_name: "Mexico", new_cases: 83147, tests_done: 602500, population: 126200000, testing_rate: 4772.8, positivity_rate: 17.2, testing_data_source: "Secretaría de Salud" },
        { country: "Mexico", country_code: "MX", year_week: "2021-W25", level: "national", region: "MX", region_name: "Mexico", new_cases: 105392, tests_done: 712800, population: 126200000, testing_rate: 5649.2, positivity_rate: 18.6, testing_data_source: "Secretaría de Salud" },
        { country: "Mexico", country_code: "MX", year_week: "2021-W30", level: "national", region: "MX", region_name: "Mexico", new_cases: 123045, tests_done: 802500, population: 126200000, testing_rate: 6359.7, positivity_rate: 19.3, testing_data_source: "Secretaría de Salud" }

    ];

function LoadBackendRSGv2(app, db_RSG) {
    //POSTMAN
    app.get(API_BASE + "/docs", (req, res) => {
        console.log("Redirecting to POSTMAN documentation");
        res.redirect("https://documenter.getpostman.com/view/32953626/2sA2xfZZUP");
    });
    //POST1
    app.post(API_BASE + "/", (req, res) => {
        let newdata = req.body;
        const ccc = req.body.positivity_rate;
        const Fields = ["country", "country_code", "year_week", "level", "region", "region_name", "new_cases", "tests_done", "population", "testing_rate", "positivity_rate", "testing_data_source"];
        const recFields = Object.keys(newdata);
        const isvalid = Fields.every(f => recFields.includes(f));
        if (isvalid) {
            db_RSG.find({ positivity_rate: ccc }, (error, existdata) => {
                if (error) {
                    res.status(500).send('Internal Error');
                } else {
                    if (existdata.length > 0) {
                        res.status(409).send('Conflict');
                    } else {
                        db_RSG.insert(newdata);
                        res.status(201).send('Created');
                    }
                }
            });
        } else {
            res.status(400).send('Bad Request');
        }
    });
    
    // Tu otro código de rutas y demás
    
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            res.status(400).send('Bad Request');
        } else {
            next();
        }
    });
    //GET1
    app.get(API_BASE + "/", (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const params = req.query;
        let query = {};

        // Verificar si existen los parámetros 'from' y 'to'
        if (params.from && params.to) {
            // Convertir los valores 'from' y 'to' a números enteros
            const from = parseInt(params.from);
            const to = parseInt(params.to);
            // Agregar condiciones de filtro para los años
            query.year_week = { $gte: `${from}-W01`, $lte: `${to}-W52` };
        }

        //parametros offset y limit
        db_RSG.find(query).skip(offset).limit(limit).exec((error, data) => {
            if (error) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (data.length > 0) {
                    if (data.length === 1) {
                        let c = data[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        res.send(data.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });



    //PUT1
    app.put(API_BASE + "/", (req, res) => {
        //Si se intenta usar alguno de los métodos no permitidos se debe devolver el código 405
        let data = req.body;
        res.sendStatus(405, "Method not allowed");
    });
    //DELETE1
    app.delete(API_BASE + "/", (req, res) => {
        //Borrar todos los datos
        db_RSG.remove({}, { multi: true }, (error, nremov) => {
            if (error) {
                res.sendStatus(500, "Internal Error"); // Error interno del servidoR
            } else {
                if (nremov > 0) {
                    res.sendStatus(200, "OK");
                } else {
                    res.sendStatus(400, "Not Found");
                }
            }
        });
    });

    app.get(API_BASE + "/loadInitialData", (req, res) => {

        db_RSG.count({}, (error, count) => {
            if (error) {
                es.sendStatus(500, "Internal error");
            } else {
                if (count === 0) {
                    db_RSG.insert(datos1, (error, doc) => {
                        if (error) {
                            res.sendStatus(500, "Internal error");
                        } else {
                            res.sendStatus(201, "Created");
                        }
                    });
                }
                else {
                    res.sendStatus(200, "OK");
                }
            }
        });
    });
    //POST22
    app.post(API_BASE + "/:country/:year_week", (req, res) => {
        const pais = req.params.country;
        const year_week = req.params.year_week;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });
    //POST2
    app.post(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });
    //GET22
    app.get(API_BASE + "/:country/:year_week", (req, res) => {
        const pais = req.params.country;
        const ano_sem = req.params.year_week;
        db_RSG.find({ country: pais, year_week: ano_sem }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    if (countrydata.length === 1) {
                        let c = countrydata[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        res.send(countrydata.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
    //GET2
    app.get(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        db_RSG.find({ country: pais }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    if (countrydata.length === 1) {
                        let c = countrydata[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        res.send(countrydata.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
    //PUT22
    app.put(API_BASE + "/:country/:year_week", (req, res) => {
        const pais = req.params.country;
        const ano_sem = req.params.year_week;
        let data = req.body;
        const Fields = ["country", "country_code", "year_week", "level", "region", "region_name", "new_cases", "tests_done", "population", "testing_rate", "positivity_rate", "testing_data_source"];
        const isValidStructure = Fields.every(key => Object.prototype.hasOwnProperty.call(data, key));

        if (!isValidStructure || Object.keys(data).length !== Fields.length) {
            res.sendStatus(400, "Bad Request");

        }
        db_RSG.findOne({ country: pais, year_week: ano_sem }, (err, existingData) => {
            if (err) {
                return res.status(500).send("Internal Server Error");
            } else {
                if (!existingData) {
                    return res.status(404).send("Not Found");
                } else {
                    db_RSG.update({ country: pais, year_week: ano_sem }, data, {}, (error) => {
                        if (error) {
                            res.sendStatus(500, "Internal Server Error");
                        } else {
                            res.sendStatus(200, "Ok");
                        }
                    });
                }
            }
        });

    });
    //PUT2
    app.put(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        const Fields = ["country", "country_code", "year_week", "level", "region", "region_name", "new_cases", "tests_done", "population", "testing_rate", "positivity_rate", "testing_data_source"];
        if (!data || Object.keys(data).length === 0 || data.country !== pais) {
            res.sendStatus(400, "Bad Request");

        } else {
            db_RSG.update({ country: pais }, data, {}, (error) => {
                if (error) {
                    res.sendStatus(500, "Internal Server Error");
                } else {
                    res.sendStatus(200, "Ok");
                }
            });
        }

    });
    //DELETE22
    app.delete(API_BASE + "/:country/:year_week", (req, res) => {
        const pais = req.params.country;
        const ano_sem = req.params.year_week;
        db_RSG.remove({ country: pais, year_week: ano_sem }, { multi: true }, (error, numremov) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (numremov > 0) {
                    //eliminar los datos del filtro espedificado
                    res.sendStatus(200, "Ok");
                } else {
                    //Si se intenta acceder a un recurso 
                    //inexistente se debe devolver el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

    //DELETE2
    app.delete(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        db_RSG.remove({ country: pais }, { multi: true }, (error, numremov) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (numremov > 0) {
                    //eliminar los datos del filtro espedificado
                    res.sendStatus(200, "Ok");
                } else {
                    //Si se intenta acceder a un recurso 
                    //inexistente se debe devolver el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });


}
export { LoadBackendRSGv2 }
