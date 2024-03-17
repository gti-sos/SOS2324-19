
const API_BASE = '/api/v1/eu-payment-info';

var datos = [];

module.exports = (app, db_PHT) => {
    //REDIRECT PORTAL DOCUMENTACION
    app.get(API_BASE + "/docs", (req, res) => {
        console.log("Redirection to Postman documentation");
        res.redirect("https://documenter.getpostman.com/view/32952835/2sA2xfXCsh");
    });

    //Post1
    app.post(API_BASE + "/", (req, res) => {
        let newdata = req.body;
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
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const params = req.query;
        let query = {};

        Object.keys(params).forEach(key => {
            if (key !== 'limit' && key !== 'offset') {
                let value = req.query[key];
                // Verifica si el valor es numérico
                if (!isNaN(value)) {
                    // Si es numérico, comprueba si es entero o flotante
                    if (Number.isInteger(parseFloat(value))) {
                        // Si es entero, conviértelo a entero
                        value = parseInt(value);
                    } else {
                        // Si es flotante, conviértelo a flotante
                        value = parseFloat(value);
                    }
                }
                // Agrega el parámetro a la consulta
                query[key] = value;
            }
        });

        db_PHT.find(query).skip(offset).limit(limit).exec((error, data) => {
            if (error) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (data.length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    // Devuelve los datos sin el campo _id
                    res.status(200).json(data.map(c => {
                        delete c._id;
                        return c;
                    }));
                }
            }
        });
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
        let datoss =
            [{
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR008', title: 'Thessalia – ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 121971450,
                transfers: 0, actual_plan_eu_amt_latest_adop: 121971450, pre_fin: 3049286.25, recovery_of_pre_financing: 0,
                net_pre_financing: 3049286.25, interim_payments: 3056694.49, recovery_of_expenses: 0, net_interim_payments: 3056694.49,
                total_net_payments: 6105980.74, eu_payment_rate_init_plan_eu_amt: 0.0500607374922574, eu_payment_rate_actual_plan_eu_amt: 0.0500607374922574
            },

            {
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR018', title: 'Notio Aigaio – ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 36901682,
                transfers: 0, actual_plan_eu_amt_latest_adop: 36901682, pre_fin: 922542.05, recovery_of_pre_financing: 0,
                net_pre_financing: 922542.05, interim_payments: 2331102.22, recovery_of_expenses: 0, net_interim_payments: 2331102.22,
                total_net_payments: 3253644.27, eu_payment_rate_init_plan_eu_amt: 0.0881706224122792, eu_payment_rate_actual_plan_eu_amt: 0.0881706224122792
            },

            {
                ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR014', title: 'Ionia Nisia – ERDF/ESF+', fund: 'ESF+',
                category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 63331330,
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
                ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65ISPR001', title: 'Cyprus - ISF', fund: 'ISF',
                category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 24982738,
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
                category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 401454687,
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
                ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR003', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
                category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 31575000,
                transfers: 0, actual_plan_eu_amt_latest_adop: 31575000, pre_fin: 789375, recovery_of_pre_financing: 0,
                net_pre_financing: 789375, interim_payments: 1896252.83, recovery_of_expenses: 0, net_interim_payments: 1896252.83, total_net_payments: 2685627.83,
                eu_payment_rate_init_plan_eu_amt: 0.0850555132224861, eu_payment_rate_actual_plan_eu_amt: 0.0850555132224861
            }]
        db_PHT.count({}, (error, count) => {
            if (error) {
                res.sendStatus(500, "Internal error");
            } else {
                if (count === 0) {
                    db_PHT.insert(datoss, (error, doc) => {
                        if (error) {
                            res.sendStatus(500, "Internal error");
                        } else {
                            // Actualiza la variable datos después de insertar en la base de datos
                            datos = datoss;
                            res.sendStatus(200, "OK");
                        }
                    });
                } else {
                    // Si ya hay datos en la base de datos, simplemente actualiza la variable datos
                    db_PHT.find({}, (error, data) => {
                        if (error) {
                            res.sendStatus(500, "Internal Error");
                        } else {
                            datos = data;
                            res.status(200).json(data);
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
    //GET2
    app.get(API_BASE + "/:country", (req, res) => {
        const pais = req.params.country;
        db_PHT.find({ ms_name: pais }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    //muestra los datos con los filtros especificados
                    res.send(JSON.stringify(countrydata.map((c) => {
                        delete c._id;
                        return c;
                    })));
                } else {
                    //Si se intenta acceder a un recurso 
                    //inexistente se debe devolver el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

    // Get para buscar por país y año
    app.get(API_BASE + "/:country/:year", (req, res) => {
        const country = req.params.country;
        const year = parseInt(req.params.year);

        // Realizar la búsqueda en la base de datos con los parámetros proporcionados
        db_PHT.find({ ms_name: country, year: year }, (error, countrydata) => {
            if (error) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (countrydata.length > 0) {
                    //muestra los datos con los filtros especificados
                    res.send(JSON.stringify(countrydata.map((c) => {
                        delete c._id;
                        return c;
                    })));
                } else {
                    //Si se intenta acceder a un recurso 
                    //inexistente se debe devolver el código 404
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

    
// PUT año y pais
app.put(API_BASE + "/:country/:year", (req, res) => {
    const country = req.params.country;
    const year = parseInt(req.params.year);
    const data = req.body;

    const Fields = ["ms", "ms_name", "cci", "title", "fund", "category_of_region", "year", "init_plan_eu_amt_1_adoption", "transfers", "actual_plan_eu_amt_latest_adop", "pre_fin", "recovery_of_pre_financing", "net_pre_financing", "interim_payments", "recovery_of_expenses", "net_interim_payments", "total_net_payments", "eu_payment_rate_init_plan_eu_amt", "eu_payment_rate_actual_plan_eu_amt"];
    
    // Verificar si la estructura de los datos es válida
    const isValidStructure = Fields.every(key => Object.prototype.hasOwnProperty.call(data, key));

    if (!isValidStructure || Object.keys(data).length !== Fields.length) {
        // No se pueden actualizar los datos si la estructura no es válida
        return res.status(400).send("Bad Request");
    }

    // Verificar si el país y el año existen antes de actualizar
    db_PHT.findOne({ ms_name: country, year: year }, (err, existingData) => {
        if (err) {
            return res.status(500).send("Internal Server Error");
        } else {
            if (!existingData) {
                // El país y el año no existen en la base de datos
                return res.status(404).send("Not Found");
            } else {
                // El país y el año existen, proceder con la actualización
                db_PHT.update({ ms_name: country, year: year }, { $set: data }, {}, (err) => {
                    if (err) {
                        return res.status(500).send("Internal Server Error");
                    } else {
                        return res.status(200).send("OK");
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
app.delete(API_BASE+"/:country/:year", (req, res) => {
    const country = req.params.country;
    const year =parseInt(req.params.year);
    db_PHT.remove({ms_name: country,year:year}, {multi: true}, (error, numremov)=>{
        if(error){
            res.sendStatus(500, "Internal Server Error");
        }else{
            if(numremov>0){
                //eliminar los datos del filtro espedificado
                res.sendStatus(200, "Ok");
            }else{
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
        db_PHT.remove({ ms_name: pais }, { multi: true }, (error, numremov) => {
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






/*
function PHT(app) {
    //POST1
    app.post(API_BASE + "/", (req, res) => {
        let data = req.body;
        const datose = datos.some(j => j.ms_name === data.ms_name && j.year === data.year);
        if (datose) {
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
            let datoss =
                [{
                    ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR008', title: 'Thessalia – ERDF/ESF+', fund: 'ESF+',
                    category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 121971450,
                    transfers: 0, actual_plan_eu_amt_latest_adop: 121971450, pre_fin: 3049286.25, recovery_of_pre_financing: 0,
                    net_pre_financing: 3049286.25, interim_payments: 3056694.49, recovery_of_expenses: 0, net_interim_payments: 3056694.49,
                    total_net_payments: 6105980.74, eu_payment_rate_init_plan_eu_amt: 0.0500607374922574, eu_payment_rate_actual_plan_eu_amt: 0.0500607374922574
                },

                {
                    ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR018', title: 'Notio Aigaio – ERDF/ESF+', fund: 'ESF+',
                    category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 36901682,
                    transfers: 0, actual_plan_eu_amt_latest_adop: 36901682, pre_fin: 922542.05, recovery_of_pre_financing: 0,
                    net_pre_financing: 922542.05, interim_payments: 2331102.22, recovery_of_expenses: 0, net_interim_payments: 2331102.22,
                    total_net_payments: 3253644.27, eu_payment_rate_init_plan_eu_amt: 0.0881706224122792, eu_payment_rate_actual_plan_eu_amt: 0.0881706224122792
                },

                {
                    ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR014', title: 'Ionia Nisia – ERDF/ESF+', fund: 'ESF+',
                    category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 63331330,
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
                    ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65ISPR001', title: 'Cyprus - ISF', fund: 'ISF',
                    category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 24982738,
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
                    category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 401454687,
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
                    ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR003', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
                    category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 31575000,
                    transfers: 0, actual_plan_eu_amt_latest_adop: 31575000, pre_fin: 789375, recovery_of_pre_financing: 0,
                    net_pre_financing: 789375, interim_payments: 1896252.83, recovery_of_expenses: 0, net_interim_payments: 1896252.83, total_net_payments: 2685627.83,
                    eu_payment_rate_init_plan_eu_amt: 0.0850555132224861, eu_payment_rate_actual_plan_eu_amt: 0.0850555132224861
                }]
            for (let i = 0; i < datoss.length; i++) {
                datos.push(datoss[i]);
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
            res.sendStatus(400, "Bad Request");
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



}*/

