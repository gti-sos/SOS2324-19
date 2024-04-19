
const API_BASE = '/api/v2/eu-payment-info';

var datos = [];


function LoadBackendPHT2(app, db_PHT) {



    //REDIRECT PORTAL DOCUMENTACION
    app.get(API_BASE + "/docs", (req, res) => {
        console.log("Redirection to Postman documentation");
        res.redirect("https://documenter.getpostman.com/view/32952835/2sA35G4hHE");
    });

    //Post1
    app.post(API_BASE + "/", (req, res) => {
        let newdata = req.body;
        //console.log("New post de :"+JSON.stringify(req.body,null,2))
        const ccc = req.body.cci;
        const Fields = ["ms", "ms_name", "cci", "title", "fund", "category_of_region", "year", "init_plan_eu_amt_1_adoption", "transfers", "actual_plan_eu_amt_latest_adop", "pre_fin", "recovery_of_pre_financing", "net_pre_financing", "interim_payments", "recovery_of_expenses", "net_interim_payments", "total_net_payments", "eu_payment_rate_init_plan_eu_amt", "eu_payment_rate_actual_plan_eu_amt"];
        const recFields = Object.keys(newdata);
        const isvalid = Fields.every(f => recFields.includes(f));
        // Verificar si se recibieron campos adicionales no esperados
        if (!isvalid) {
            return res.sendStatus(400, "Bad request");
        } else {
            db_PHT.find({ cci: ccc }, (error, existdata) => {
                if (error) {
                    res.sendStatus(500, "Internal Error");
                } else {
                    if (existdata.length > 0) {
                        //No se puede hacer un POST con un recurso que ya existe;
                        //en el caso contrario se debe devolver el código 409
                        res.sendStatus(409, "Conflict");
                    } else {
                        db_PHT.insert(newdata);
                        res.sendStatus(201, "Created");

                    }
                }
            });
        }
    });

    //GET1
    app.get(API_BASE + "/", (req, res) => {
        const params = req.query;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        let from = req.query.from;
        let to = req.query.to;
        let query = {};

        if (from !== undefined && to !== undefined) {
            const fromYear = parseInt(from);
            const toYear = parseInt(to);
            console.log(fromYear, toYear);
            if (isNaN(fromYear) || isNaN(toYear)) {
                return res.status(400).send("Formato no valido");
            }
            // Si los años son válidos, construye la consulta para filtrar por el rango de años
            params.year = { $gte: fromYear, $lte: toYear };
        }

        Object.keys(params).forEach(key => {
            if (key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to') {
                const value = !isNaN(params[key]) ? parseFloat(params[key]) : params[key];
                if (typeof value === 'string') {
                    query[key] = new RegExp(value, 'i');
                } else {
                    query[key] = value;
                }
                
            }
        });
        const hasSearchParameters = Object.keys(params).some(key => key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to');


        if (!hasSearchParameters) {
            db_PHT.count({}, (err, count) => {
                if (err) {
                    res.sendStatus(500).json("error carga datos 1");
                } else {
                    if (count === 0) {
                        console.error("Data vacio");
                        res.status(200).json([]);
                    } else {
                        db_PHT.find({}).skip(offset).limit(limit).exec((err, data) => {
                            if (err) {
                                console.error("Error when inserting data:", err);
                                res.sendStatus(500, "Internal Error");
                                return ;
                            } else {
                                const resultsWithoutId = data.map(d => { // Delete default generated id
                                    const { _id, ...datWithoutId } = d;
                                    return datWithoutId;
                                });
                                console.log("Sending the data");
                                res.status(200).json(resultsWithoutId);
                            }
                        });
                    }
                }
            });
        } else {
            db_PHT.find(query).skip(offset).limit(limit).exec((err, data) => {
                if (err) {
                    console.error("Database error:", err);
                    res.sendStatus(500, "Internal Error");
                    return;
                } else {
                    // Always return an array, even if there's only one data
                    const formattedData = data.map((d) => {
                        const { _id, ...formatted } = d;
                        return formatted;
                    });
                    console.log("Sending the data");
                    res.status(200).json(formattedData);
                }
            });
        }
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
        db_PHT.remove({}, { multi: true }, (error, nremov) => {
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

    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array
    //de NodeJS si está vacío.
    

    app.get(API_BASE + "/loadInitialData", (req, res) => {
        // Verifica si los datos iniciales ya han sido cargados
        
        let datoss =
            [{
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR008', title: 'Thessalia - ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Less developed', year: 2020, init_plan_eu_amt_1_adoption: 121971450,
                transfers: 0, actual_plan_eu_amt_latest_adop: 121971450, pre_fin: 3049286.25, recovery_of_pre_financing: 0,
                net_pre_financing: 3049286.25, interim_payments: 3056694.49, recovery_of_expenses: 0, net_interim_payments: 3056694.49,
                total_net_payments: 6105980.74, eu_payment_rate_init_plan_eu_amt: 0.0500607374922574, eu_payment_rate_actual_plan_eu_amt: 0.0500607374922574
            },

            {
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR018', title: 'Notio Aigaio - ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Transition', year: 2021, init_plan_eu_amt_1_adoption: 36901682,
                transfers: 0, actual_plan_eu_amt_latest_adop: 36901682, pre_fin: 922542.05, recovery_of_pre_financing: 0,
                net_pre_financing: 922542.05, interim_payments: 2331102.22, recovery_of_expenses: 0, net_interim_payments: 2331102.22,
                total_net_payments: 3253644.27, eu_payment_rate_init_plan_eu_amt: 0.0881706224122792, eu_payment_rate_actual_plan_eu_amt: 0.0881706224122792
            },

            {
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR014', title: 'Ionia Nisia - ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Less developed', year: 2022, init_plan_eu_amt_1_adoption: 63331330,
                transfers: 0, actual_plan_eu_amt_latest_adop: 63331330, pre_fin: 1583283.25, recovery_of_pre_financing: 0,
                net_pre_financing: 1583283.25, interim_payments: 1868313.45, recovery_of_expenses: 0, net_interim_payments: 1868313.45,
                total_net_payments: 3451596.7, eu_payment_rate_init_plan_eu_amt: 0.0545006192037969, eu_payment_rate_actual_plan_eu_amt: 0.0545006192037969
            },

            {
                ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65BVPR001', title: 'Cyprus - BMVI', fund: 'BMVI',
                category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 49884805,
                transfers: 595528, actual_plan_eu_amt_latest_adop: 50480333, pre_fin: 5986176.6, recovery_of_pre_financing: 0,
                net_pre_financing: 5986176.6, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 5986176.6,
                eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.118584332635048
            },

            {
                ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65ISPR002', title: 'Cyprus - ISF', fund: 'ISF',
                category_of_region: 'VOID', year: 2022, init_plan_eu_amt_1_adoption: 24982738,
                transfers: 611.646, actual_plan_eu_amt_latest_adop: 25594384.12, pre_fin: 2997928.56, recovery_of_pre_financing: 0,
                net_pre_financing: 2997928.56, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 2997928.56,
                eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.117132279719806
            },

            {
                ms: 'ES', ms_name: 'Spain', cci: '2021ES65AMPR001', title: 'Spain - AMIF', fund: 'AMIF',
                category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 514341793,
                transfers: 16960000, actual_plan_eu_amt_latest_adop: 531301793, pre_fin: 61721015.16, recovery_of_pre_financing: 0,
                net_pre_financing: 61721015.16, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 61721015.16,
                eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.116169408748824
            },

            {
                ms: 'FR', ms_name: 'France', cci: '2021FR65AMPR001', title: 'France - AMIF', fund: 'AMIF',
                category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 910485391,
                transfers: 15900000, actual_plan_eu_amt_latest_adop: 926385391, pre_fin: 109258246.92, recovery_of_pre_financing: 0,
                net_pre_financing: 109258246.92, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 109258246.92,
                eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.117940382028326
            },

            {
                ms: 'FR', ms_name: 'France', cci: '2021FR16FFPR017', title: 'Bourgogne-Franche-Comté - ERDF - ESF + ', fund: 'ERDF',
                category_of_region: 'Transition', year: 2022, init_plan_eu_amt_1_adoption: 401454687,
                transfers: 0, actual_plan_eu_amt_latest_adop: 401454687, pre_fin: 10036367.2, recovery_of_pre_financing: 0,
                net_pre_financing: 10036367.2, interim_payments: 7915467.06, recovery_of_expenses: 0, net_interim_payments: 7915467.06, total_net_payments: 17951834.26,
                eu_payment_rate_init_plan_eu_amt: 0.0447169626892412, eu_payment_rate_actual_plan_eu_amt: 0.0447169626892412
            },

            {
                ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR003', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
                category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 157875000,
                transfers: 0, actual_plan_eu_amt_latest_adop: 157875000, pre_fin: 3946875, recovery_of_pre_financing: 0,
                net_pre_financing: 3946875, interim_payments: 10299266.83, recovery_of_expenses: 0, net_interim_payments: 10299266.83, total_net_payments: 14246141.83,
                eu_payment_rate_init_plan_eu_amt: 0.0902368445288995, eu_payment_rate_actual_plan_eu_amt: 0.0902368445288995
            },

            {
                ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR004', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
                category_of_region: 'Transition', year: 2022, init_plan_eu_amt_1_adoption: 31575000,
                transfers: 0, actual_plan_eu_amt_latest_adop: 31575000, pre_fin: 789375, recovery_of_pre_financing: 0,
                net_pre_financing: 789375, interim_payments: 1896252.83, recovery_of_expenses: 0, net_interim_payments: 1896252.83, total_net_payments: 2685627.83,
                eu_payment_rate_init_plan_eu_amt: 0.0850555132224861, eu_payment_rate_actual_plan_eu_amt: 0.0850555132224861
            }, {
                ms: 'DE',
                ms_name: 'Germany',
                cci: '2021DE123456789',
                title: 'Germany - ERDF',
                fund: 'ERDF',
                category_of_region: 'Urban',
                year: 2023,
                init_plan_eu_amt_1_adoption: 750000000,
                transfers: 20000000,
                actual_plan_eu_amt_latest_adop: 770000000,
                pre_fin: 88000000,
                recovery_of_pre_financing: 1000000,
                net_pre_financing: 87000000,
                interim_payments: 5000000,
                recovery_of_expenses: 200000,
                net_interim_payments: 4800000,
                total_net_payments: 91800000,
                eu_payment_rate_init_plan_eu_amt: 0.1,
                eu_payment_rate_actual_plan_eu_amt: 0.11857142857
            },
            {
                ms: 'IT',
                ms_name: 'Italy',
                cci: '2021ITABCDE001',
                title: 'Italy - ESF',
                fund: 'ESF',
                category_of_region: 'Rural',
                year: 2023,
                init_plan_eu_amt_1_adoption: 500000000,
                transfers: 15000000,
                actual_plan_eu_amt_latest_adop: 515000000,
                pre_fin: 60000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 60000000,
                interim_payments: 2000000,
                recovery_of_expenses: 0,
                net_interim_payments: 2000000,
                total_net_payments: 62000000,
                eu_payment_rate_init_plan_eu_amt: 0.12,
                eu_payment_rate_actual_plan_eu_amt: 0.12
            },
            {
                ms: 'ES',
                ms_name: 'Spain',
                cci: '2021ESXYZ001',
                title: 'Spain - Cohesion Fund',
                fund: 'Cohesion Fund',
                category_of_region: 'Transitional',
                year: 2020,
                init_plan_eu_amt_1_adoption: 1024100,
                transfers: 25000000,
                actual_plan_eu_amt_latest_adop: 1025000000,
                pre_fin: 120000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 120000000,
                interim_payments: 10000000,
                recovery_of_expenses: 500000,
                net_interim_payments: 9500000,
                total_net_payments: 129500000,
                eu_payment_rate_init_plan_eu_amt: 0.12,
                eu_payment_rate_actual_plan_eu_amt: 0.12682926829
            }, {
                ms: 'UK',
                ms_name: 'United Kingdom',
                cci: '2021UKWXYZ001',
                title: 'UK - EAFRD',
                fund: 'EAFRD',
                category_of_region: 'Remote',
                year: 2023,
                init_plan_eu_amt_1_adoption: 850000000,
                transfers: 18000000,
                actual_plan_eu_amt_latest_adop: 868000000,
                pre_fin: 100000000,
                recovery_of_pre_financing: 5000000,
                net_pre_financing: 95000000,
                interim_payments: 7000000,
                recovery_of_expenses: 0,
                net_interim_payments: 7000000,
                total_net_payments: 102000000,
                eu_payment_rate_init_plan_eu_amt: 0.11,
                eu_payment_rate_actual_plan_eu_amt: 0.11764705882
            }, {
                ms: 'PT',
                ms_name: 'Portugal',
                cci: '2021PTFGHIJ001',
                title: 'Portugal - AMIF',
                fund: 'AMIF',
                category_of_region: 'Islands',
                year: 2023,
                init_plan_eu_amt_1_adoption: 450000000,
                transfers: 12000000,
                actual_plan_eu_amt_latest_adop: 462000000,
                pre_fin: 55000000,
                recovery_of_pre_financing: 100000,
                net_pre_financing: 54900000,
                interim_payments: 3000000,
                recovery_of_expenses: 0,
                net_interim_payments: 3000000,
                total_net_payments: 57900000,
                eu_payment_rate_init_plan_eu_amt: 0.12,
                eu_payment_rate_actual_plan_eu_amt: 0.12580645161
            }, {
                ms: 'SE',
                ms_name: 'Sweden',
                cci: '2021SEUVWXYZ001',
                title: 'Sweden - EMFF',
                fund: 'EMFF',
                category_of_region: 'Coastal',
                year: 2023,
                init_plan_eu_amt_1_adoption: 600000000,
                transfers: 10000000,
                actual_plan_eu_amt_latest_adop: 610000000,
                pre_fin: 70000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 70000000,
                interim_payments: 4000000,
                recovery_of_expenses: 0,
                net_interim_payments: 4000000,
                total_net_payments: 74000000,
                eu_payment_rate_init_plan_eu_amt: 0.115,
                eu_payment_rate_actual_plan_eu_amt: 0.12131147541
            }, {
                ms: 'NL',
                ms_name: 'Netherlands',
                cci: '2021NL123ABC001',
                title: 'Netherlands - EAFRD',
                fund: 'EAFRD',
                category_of_region: 'Urban',
                year: 2023,
                init_plan_eu_amt_1_adoption: 380000000,
                transfers: 8000000,
                actual_plan_eu_amt_latest_adop: 388000000,
                pre_fin: 45000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 45000000,
                interim_payments: 2000000,
                recovery_of_expenses: 0,
                net_interim_payments: 2000000,
                total_net_payments: 47000000,
                eu_payment_rate_init_plan_eu_amt: 0.118,
                eu_payment_rate_actual_plan_eu_amt: 0.1206185567
            }
            /*{
                ms: 'PL',
                ms_name: 'Poland',
                cci: '2021PLQWERTY001',
                title: 'Poland - ESF+',
                fund: 'ESF+',
                category_of_region: 'Rural',
                year: 2023,
                init_plan_eu_amt_1_adoption: 920000000,
                transfers: 22000000,
                actual_plan_eu_amt_latest_adop: 942000000,
                pre_fin: 110000000,
                recovery_of_pre_financing: 1000000,
                net_pre_financing: 109000000,
                interim_payments: 6000000,
                recovery_of_expenses: 0,
                net_interim_payments: 6000000,
                total_net_payments: 115000000,
                eu_payment_rate_init_plan_eu_amt: 0.12,
                eu_payment_rate_actual_plan_eu_amt: 0.12234042553
            },
            {
                ms: 'FI',
                ms_name: 'Finland',
                cci: '2021FIJKLMNOP001',
                title: 'Finland - ERDF',
                fund: 'ERDF',
                category_of_region: 'Remote',
                year: 2023,
                init_plan_eu_amt_1_adoption: 420000000,
                transfers: 9000000,
                actual_plan_eu_amt_latest_adop: 429000000,
                pre_fin: 50000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 50000000,
                interim_payments: 3000000,
                recovery_of_expenses: 0,
                net_interim_payments: 3000000,
                total_net_payments: 53000000,
                eu_payment_rate_init_plan_eu_amt: 0.119,
                eu_payment_rate_actual_plan_eu_amt: 0.12505866953
            },
            {
                ms: 'AT',
                ms_name: 'Austria',
                cci: '2021ATA1B2C3D4E5',
                title: 'Austria - REACT-EU',
                fund: 'REACT-EU',
                category_of_region: 'Urban',
                year: 2023,
                init_plan_eu_amt_1_adoption: 320000000,
                transfers: 7000000,
                actual_plan_eu_amt_latest_adop: 327000000,
                pre_fin: 38000000,
                recovery_of_pre_financing: 0,
                net_pre_financing: 38000000,
                interim_payments: 2500000,
                recovery_of_expenses: 0,
                net_interim_payments: 2500000,
                total_net_payments: 40500000,
                eu_payment_rate_init_plan_eu_amt: 0.115,
                eu_payment_rate_actual_plan_eu_amt: 0.12345679012
            }*/]

        db_PHT.count({}, (error, count) => {
            if (error) {
                res.sendStatus(500, "Internal error");
            } else {
                if (count === 0) {
                    db_PHT.insert(datoss, (error, doc) => {
                        if (error) {
                            res.sendStatus(500, "Internal error");
                        } else {
                            
                            res.sendStatus(200, "OK");
                        }
                    });
                } 
            }
        });
    });

    //Post2
    //Si se intenta usar alguno de los métodos no permitidos por la 
    //tabla azul se debe devolver el código 405
    app.post(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });

    //get cci
    app.get(API_BASE + "/:cci", (req, res) => {
        const pais = req.params.cci;
        db_PHT.find({ cci: pais }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    if (countrydata.length === 1) {
                        // Si solo hay un dato, devuelve ese dato directamente
                        const singleData = countrydata[0];
                        delete singleData._id;
                        res.send((singleData));
                    } else {
                        // Muestra los datos con los filtros especificados
                        res.send((countrydata.map((c) => {
                            delete c._id;
                            return c;
                        })));
                    }
                } else {
                    // Si se intenta acceder a un recurso inexistente, devuelve el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });


    //Get country y year
    app.get(API_BASE + "/:country/:year", (req, res) => {
        const country = req.params.country;
        const year = parseInt(req.params.year);

        // Realizar la búsqueda en la base de datos con los parámetros proporcionados
        db_PHT.find({ ms_name: country, year: year }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    if (countrydata.length === 1) {
                        // Si solo hay un dato, devuelve ese dato directamente
                        const singleData = countrydata[0];
                        delete singleData._id;
                        res.send((singleData));
                    } else {
                        // Muestra los datos con los filtros especificados
                        res.send((countrydata.map((c) => {
                            delete c._id;
                            return c;
                        })));
                    }
                } else {
                    // Si se intenta acceder a un recurso inexistente, devuelve el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });


    //put conuntry year
    app.put(API_BASE + "/:country/:year", (req, res) => {
        const pais = req.params.country;
        const ano = parseInt(req.params.year);
        let data = req.body;
        const Fields = ["ms", "ms_name", "cci", "title", "fund", "category_of_region", "year", "init_plan_eu_amt_1_adoption", "transfers", "actual_plan_eu_amt_latest_adop", "pre_fin", "recovery_of_pre_financing", "net_pre_financing", "interim_payments", "recovery_of_expenses", "net_interim_payments", "total_net_payments", "eu_payment_rate_init_plan_eu_amt", "eu_payment_rate_actual_plan_eu_amt"];

        // Verificar si la estructura de los datos es válida
        const isValidStructure = Fields.every(key => Object.prototype.hasOwnProperty.call(data, key));

        if (!isValidStructure || Object.keys(data).length !== Fields.length) {
            return res.status(400).send("Bad Request");
        }

        // Verificar si se intenta cambiar el país o el año
        if (data.ms_name !== pais || data.year !== ano) {
            return res.status(400).send("Bad Request: Cannot change country or year");
        }

        // Verificar si el país y el año existen antes de actualizar
        db_PHT.findOne({ ms_name: pais, year: ano }, (err, existingData) => {
            if (err) {
                return res.status(500).send("Internal Server Error");
            } else {
                if (!existingData) {
                    return res.status(404).send("Not Found");
                } else {
                    // Verificar si hay otro dato con el mismo cci (excluyendo el del propio dato)
                    db_PHT.findOne({ cci: data.cci, _id: { $ne: existingData._id } }, (err, existingCCI) => {
                        if (err) {
                            return res.status(500).send("Internal Server Error");
                        } else {
                            if (existingCCI) {
                                return res.status(409).send("Conflict: Duplicated CCI");
                            } else {
                                // No hay otro dato con el mismo cci (excluyendo el del propio dato), proceder con la actualización
                                db_PHT.update({ _id: existingData._id }, data, {}, (error) => {
                                    if (error) {
                                        return res.status(500).send("Internal Server Error");
                                    } else {
                                        return res.status(200).send("OK");
                                    }
                                });
                            }
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
        const Fields = ["ms", "ms_name", "cci", "title", "fund", "category_of_region", "year", "init_plan_eu_amt_1_adoption", "transfers", "actual_plan_eu_amt_latest_adop", "pre_fin", "recovery_of_pre_financing", "net_pre_financing", "interim_payments", "recovery_of_expenses", "net_interim_payments", "total_net_payments", "eu_payment_rate_init_plan_eu_amt", "eu_payment_rate_actual_plan_eu_amt"];
        if (!data || Object.keys(data).length === 0 || data.ms_name !== pais) {
            res.sendStatus(400, "Bad Request");

        } else {
            db_PHT.update({ ms_name: pais }, data, {}, (error) => {
                if (error) {
                    res.sendStatus(500, "Internal Server Error");
                } else {
                    res.sendStatus(200, "Ok");
                }
            });
        }

    });


    //DELETE año y pais
    app.delete(API_BASE + "/:country/:year", (req, res) => {
        const country = req.params.country;
        const year = parseInt(req.params.year);
        db_PHT.remove({ ms_name: country, year: year }, { multi: true }, (error, numremov) => {
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



    //DELETE3
    app.delete(API_BASE + "/:cci", (req, res) => {
        const pepe = req.params.cci;
        db_PHT.remove({ cci: pepe }, { multi: true }, (error, numremov) => {
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
export { LoadBackendPHT2 }




