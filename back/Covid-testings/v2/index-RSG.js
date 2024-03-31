const API_BASE = '/api/v2/covid-testings';

var datos = [];
function LoadBackendRSGv2(app, db_RSG){

        db_RSG.insert(datos1);
        //POSTMAN
        app.get(API_BASE + "/docs", (req, res) => {
            console.log("Redirecting to POSTMAN documentation");
            res.redirect("https://documenter.getpostman.com/view/32953626/2sA2xfZZUP");
        });
        //POST1
        app.post(API_BASE + "/", (req, res) => {
            let newdata = req.body;
            const ccc=req.body.positivity_rate;
            const Fields = ["country","country_code","year_week","level","region","region_name","new_cases","tests_done","population","testing_rate","positivity_rate","testing_data_source"];
            const recFields = Object.keys(newdata);
            const isvalid=Fields.every(f=>recFields.includes(f));
            if (!isvalid) {
                return res.sendStatus(400, "Bad request");
            }else{
                db_RSG.find({positivity_rate: ccc}, (error,existdata)=>{
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
        //POST22
        app.post(API_BASE + "/:country/:year_week", (req, res) => {
            const pais = req.params.country;
            const year_week =req.params.year_week;
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
            const ano_sem =req.params.year_week;
            db_RSG.find({country: pais, year_week:ano_sem}, (error,countrydata)=>{
                if (error) {
                    res.sendStatus(500, "Internal Server Error");
                }else{
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
            db_RSG.find({country: pais}, (error,countrydata)=>{
                if (error) {
                    res.sendStatus(500, "Internal Server Error");
                }else{
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
            const ano_sem =req.params.year_week;
            let data = req.body;
            const Fields = ["country","country_code","year_week","level","region","region_name","new_cases","tests_done","population","testing_rate","positivity_rate","testing_data_source"];
            const isValidStructure = Fields.every(key => Object.prototype.hasOwnProperty.call(data, key));

            if (!isValidStructure||Object.keys(data).length !== Fields.length) {
                    res.sendStatus(400, "Bad Request");
                    
                } 
                db_RSG.findOne({ country: pais, year_week: ano_sem }, (err, existingData) => {
                    if (err) {
                        return res.status(500).send("Internal Server Error");
                    } else {
                        if (!existingData) {
                            return res.status(404).send("Not Found");
                        }else{
                            db_RSG.update({country: pais, year_week: ano_sem}, data, {}, (error)=>{
                                if(error){
                                    res.sendStatus(500, "Internal Server Error");
                                }else{
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
        //DELETE22
        app.delete(API_BASE + "/:country/:year_week", (req, res) => {
            const pais = req.params.country;
            const ano_sem =req.params.year_week;
            db_RSG.remove({country: pais, year_week:ano_sem}, {multi: true}, (error, numremov)=>{
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
            db_RSG.remove({country: pais}, {multi: true}, (error, numremov)=>{
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
    
    
}
export {LoadBackendRSGv2}
