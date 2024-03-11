const API_BASE = '/api/v1/covid-testings';

var datos = [];
module.exports = (app, db_RSG) =>  {
        //POSTMAN
        app.get(API_BASE + "/docs", (req, res) => {
            console.log("Redirecting to POSTMAN documentation");
            res.redirect("https://documenter.getpostman.com/view/32953626/2sA2xfZZUP");
        });
        //POST1
        app.post(API_BASE + "/", (req, res) => {
            let newdata = req.body;
            const ccc=req.body.cci;
            const Fields = ["country","country_code","year_week","level","region","region_name","new_cases","tests_done","population","testing_rate","positivity_rate","testing_data_source"];
            const recFields = Object.keys(newdata);
            const isvalid=Fields.every(f=>recFields.includes(f));
            if (!isvalid) {
                return res.sendStatus(400, "Bad request");
            }else{
                db_RSG.find({cci: ccc}, (error,existdata)=>{
                    if(error){
                        res.sendStatus(500, "Internal Error");
                    }else{
                        if(existdata.length>0){
                            res.sendStatus(409, "Conflict");
                        }else{
                            db_RSG.insert(newdata);
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
                        if (Number.isInteger(parseFloat(value))) {
                            value = parseInt(value);
                        } else {
                            // Si es flotante, transforma a flotante
                            value = parseFloat(value);
                        }
                    }
                    // Agrega el parámetro a la consulta
                    query[key] = value;
                }
            });
        
            db_RSG.find(query).skip(offset).limit(limit).exec((error, data) => {
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
            //Si se intenta usar alguno de los métodos no permitidos se debe devolver el código 405
            let data = req.body;
            res.sendStatus(405, "Method not allowed");
        });
        //DELETE1
        app.delete(API_BASE + "/", (req, res) => {
            //Borrar todos los datos
            db_RSG.remove({},{multi: true},(error,nremov)=>{
                if(error){
                    res.sendStatus(500, "Internal Error"); // Error interno del servidoR
                }else{
                    if(nremov>0){
                        res.sendStatus(200,"OK");
                    }else{
                        res.sendStatus(400, "Not Found");
                    }
                }
            });
        });
    
        app.get(API_BASE + "/loadInitialData", (req, res) => {
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
            db_RSG.count({}, (error,count) =>{
                if(error) {
                    es.sendStatus(500,"Internal error");
                }else{
                    if(count === 0){
                        db_RSG.insert(datos1,(error,doc)=>{
                            if(error) {
                                res.sendStatus(500,"Internal error");
                            }else{
                                res.sendStatus(201,"Created"); 
                            }
                        });
                    }
                    else {
                        res.sendStatus(200,"OK"); 
                    }
                }
            });
        });
        //POST2
        app.post(API_BASE + "/:country", (req, res) => {
            const pais = req.params.country;
            let data = req.body;
            res.sendStatus(405, "Method Not Allowed");
        });
        //GET2
        app.get(API_BASE + "/:country", (req, res) => {
            const pais = req.params.country;
            db_RSG.find({country: pais}, (error,countrydata)=>{
                if (error) {
                    res.sendStatus(500, "Internal Server Error");
                }else{
                    if(countrydata.length>0){
                        //muestra los datos con los filtros especificados
                        res.send(JSON.stringify(countrydata.map((c)=>{
                            delete c._id;
                            return c;
                        })));
                    }else{
                        res.sendStatus(404, "Not Found");
                    }
                }
            });
        });
        //PUT2
        app.put(API_BASE + "/:country", (req, res) => {
            const pais = req.params.country;
            let data = req.body;
            const Fields = ["country","country_code","year_week","level","region","region_name","new_cases","tests_done","population","testing_rate","positivity_rate","testing_data_source"];
            if (!data||Object.keys(data).length === 0 || data.country !== pais) {
                    res.sendStatus(400, "Bad Request");
                    
                } else {
                    db_RSG.update({country: pais}, data, {}, (error)=>{
                        if(error){
                            res.sendStatus(500, "Internal Server Error");
                        }else{
                            res.sendStatus(200, "Ok");
                        }
                    });
                }
            
        });
        //DELETE2
        app.delete(API_BASE + "/:country", (req, res) => {
            const pais = req.params.country;
            db_RSG.remove({country: pais}, {multi: true}, (error, numremov)=>{
                if(error){
                    res.sendStatus(500, "Internal Server Error");
                }else{
                    if(numremov>0){
                        //eliminar los datos del filtro espedificado
                        res.sendStatus(200, "Ok");
                    }else{
                        res.sendStatus(404, "Not Found");
                    }
                }
            });
        });
    
    
}
