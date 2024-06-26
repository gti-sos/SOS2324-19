const API_BASE = '/api/v2/policy-program-stats';

var datos = [];
function LoadBackendAFI2(app, db_AFI){
        //POSTMAN
        app.get(API_BASE + "/docs", (req, res) => {
            console.log("Redirection to Postman documentation");
            //hacer uno con v2
            res.redirect("https://documenter.getpostman.com/view/32953689/2sA35G4Mse");
        });
        //POST1
        app.post(API_BASE + "/", (req, res) => {
            let newdata = req.body;
            const co=req.body.country;
            const ye=req.body.year;
            const Fields = ["country", "cci", "short_title", "year", "priority", "fund", "too", "fi_name", "fi_address", "is_set_up_at_union_level", "fi_type", 
            "ex_ante_completion_date", "funding_agreement_signature_date", "total_amount_committed_to_fi", "esif_amount_committed_to_fi", "total_amount_paid_to_fi", 
            "esif_amount_paid_to_fi", "management_costs_amount", "base_renumeration_amount", "performance_based_renumeration_paid_amount", 
            "total_amount_committed_to_final_recipients", "esif_amount_committed_to_final_recipients","total_amount_paid_to_final_recipients","esif_amount_paid_to_final_recipients", 
            "to_code_short_title", "to_long_title"];
            const recFields = Object.keys(newdata);
            const isvalid=Fields.every(f=>recFields.includes(f));
            // Verificar si se recibieron campos adicionales no esperados
            if (!isvalid) {
                return res.sendStatus(400, "Bad request");
            }else{ 
                db_AFI.find({country:co, year:ye}, (error,existdata)=>{
                    if(error){
                        res.sendStatus(500, "Internal Error");
                    }else{
                        if(existdata.length>0){
                            //No se puede hacer un POST con un recurso que ya existe;
                             //en el caso contrario se debe devolver el código 409
                            res.sendStatus(409, "Conflict");
                        }else{
                            db_AFI.insert(newdata);
                             res.sendStatus(201, "Created");
                            
                        }
                    }
                });
            }
        });
        //GET1
        app.get(API_BASE + "/", (req, res) => {
            const params = req.query;
            const offset = parseInt(req.query.offset) || 0;
            const limit = parseInt(req.query.limit) || 20;
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
                    // let value = req.query[key];
                    // //Verifica si el valor es numérico
                    // if (!isNaN(value)) {
                    //     // Si es numérico, comprueba si es entero o flotante
                    //     if (Number.isInteger(parseFloat(value))) {
                    //         // Si es entero, conviértelo a entero
                    //         value = parseInt(value);
                    //     } else {
                    //         // Si es flotante, conviértelo a flotante
                    //         value = parseFloat(value);
                    //     }
                    //}
                    //Agrega el parámetro a la consulta
                    //query[key] = value;
                }
            });
            const hasSearchParameters = Object.keys(params).some(key => key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to');
    
        if (!hasSearchParameters) {
            db_AFI.count({}, (err, count) => {
                if (err) {
                    res.sendStatus(500).json("error carga datos 1");
                } else {
                    if (count === 0) {
                        console.error("Data vacio");
                        res.status(200).json([]);
                    } else {
                        db_AFI.find({}).skip(offset).limit(limit).exec((err, data) => {
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
            db_AFI.find(query).skip(offset).limit(limit).exec((err, data) => {
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
        //     db_AFI.find(query).skip(offset).limit(limit).exec((error, retur) => {
        //         if (error) {
        //             res.sendStatus(500);
        //         }else if (from && to && !error) {
        //             const pagi = retur.filter(x => {return x.year >= from && x.year <= to}); 
        //             if (from >= to) {
        //                 res.status(400).json("El rango de años especificado es inválido");
                    
        //             }else{
        //                 res.status(200);
        //                 res.json(pagi.map((c)=>{
        //                     delete c._id;
        //                     return c;
        //                 }));
        //                 console.log(`GET en /policy-program-stats?from=${from}&to=${to}`); 
        //             }
        //         } else if (retur.length === 0) {
        //             res.sendStatus(404);
        //         } else {
        //             db_AFI.count(query, (countError, totalCount) => {
        //                 if (countError) {
        //                     res.sendStatus(500);
        //                 } else {
        //                     // Enviar resultados paginados y el total de resultados
        //                     res.status(200).json({ data: retur, total: totalCount });
        //                 }
        //             });
        //         }
        //     });
        // });
        // if (data.length > 0) {
        //     if (data.length === 1) {
        //         let c = data[0];
        //         delete c._id;
        //         res.send(c);
        //     } else {
        //         res.send(data.map((c)=> {
        //             delete c._id;
        //             return c;
        //         }));
        //     }
        // } else {
        //     res.sendStatus(404, "Not Found");
        // }
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
            db_AFI.remove({},{multi: true},(error,nremov)=>{
                if(error){
                    res.sendStatus(500, "Internal Error"); // Error interno del servidoR
                }else{
                    res.sendStatus(200);
                }
            });
        });
    
        //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
        //que al hacer un GET cree 10 o más datos en el array
        //de NodeJS si está vacío.
        app.get(API_BASE + "/loadInitialData", (req, res) => {
            let datoss =
            [
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2015, priority: "A.1", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "BetlehemstraÃŸe 3, 4020 Linz, Austria", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2016-02-25T00:00:00.000", funding_agreement_signature_date: "2015-06-30T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 133081.00, base_renumeration_amount: 133081.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 450000.00, esif_amount_committed_to_final_recipients: 150000.00, total_amount_paid_to_final_recipients: 450000.00, esif_amount_paid_to_final_recipients: 150000.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2016, priority: "A.2", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-06-30T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 304000.00, base_renumeration_amount: 304000.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 950000.00, esif_amount_committed_to_final_recipients: 316667.00, total_amount_paid_to_final_recipients: 950000.00, esif_amount_paid_to_final_recipients: 316667.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2017, priority: "A.2", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-06-30T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 448000.00, base_renumeration_amount: 445000.00, performance_based_renumeration_paid_amount: 2000.00, total_amount_committed_to_final_recipients: 1522555.00, esif_amount_committed_to_final_recipients: 507518.00, total_amount_paid_to_final_recipients: 1522555.00, esif_amount_paid_to_final_recipients: 507518.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2018, priority: "A.2", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "-", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-06-30T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 8250000.00, esif_amount_paid_to_fi: 2250000.00, management_costs_amount: 631000.00, base_renumeration_amount: 535000.00, performance_based_renumeration_paid_amount: 96000.00, total_amount_committed_to_final_recipients: 6236298.00, esif_amount_committed_to_final_recipients: 2078766.00, total_amount_paid_to_final_recipients: 5569510.20, esif_amount_paid_to_final_recipients: 1856503.40, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2019, priority: "A.3", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-07-01T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 6886814.75, esif_amount_committed_to_final_recipients: 2295604.92, total_amount_paid_to_final_recipients: 6430814.75, esif_amount_paid_to_final_recipients: 2143604.92, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2020, priority: "A.2", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-07-01T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 7756185.76, esif_amount_committed_to_final_recipients: 2585395.25, total_amount_paid_to_final_recipients: 7456185.76, esif_amount_paid_to_final_recipients: 2485395.25, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2021, priority: "A.4", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-07-01T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 7256185.76, esif_amount_committed_to_final_recipients: 2418728.59, total_amount_paid_to_final_recipients: 7256185.76, esif_amount_paid_to_final_recipients: 2418728.59, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "AT", cci: "2014AT16RFOP001", short_title: "Investments in Growth and Employment - AT - ERDF", year: 2022, priority: "A.2", fund: "ERDF", too: 3, fi_name: "OÃ–. Hightechfonds", fi_address: "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2015-01-15T00:00:00.000", funding_agreement_signature_date: "2015-07-01T00:00:00.000", total_amount_committed_to_fi: 9000000.00, esif_amount_committed_to_fi: 3000000.00, total_amount_paid_to_fi: 9000000.00, esif_amount_paid_to_fi: 3000000.00, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 7756185.76, esif_amount_committed_to_final_recipients: 2585395.25, total_amount_paid_to_final_recipients: 7756185.76, esif_amount_paid_to_final_recipients: 2585395.25, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "BE", cci: "2014BE16RFOP001", short_title: "Brussels Capital Region - ERDF", year: 2018, priority: "Axe 1", fund: "ERDF", too: 1, fi_name: "Outil de prise de capital pour entreprises innovantes en early-stage", fi_address: "Belgique, Bruxelles", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2017-05-31T00:00:00.000", funding_agreement_signature_date: "2018-05-23T00:00:00.000", total_amount_committed_to_fi: 6085703.00, esif_amount_committed_to_fi: 2253964.00, total_amount_paid_to_fi: 1803171.20, esif_amount_paid_to_fi: 901585.60, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 0.00, esif_amount_committed_to_final_recipients: 0.00, total_amount_paid_to_final_recipients: 0.00, esif_amount_paid_to_final_recipients: 0.00, to_code_short_title: "TO 1 RTDI", to_long_title: "Strengthening research, technological development and innovation" },
                { country: "BE", cci: "2014BE16RFOP001", short_title: "Brussels Capital Region - ERDF", year: 2019, priority: "Axe 2", fund: "ERDF", too: 3, fi_name: "Outil de microcrÃ©dits", fi_address: "Belgique, Bruxelles", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2017-05-31T00:00:00.000", funding_agreement_signature_date: "2018-05-23T00:00:00.000", total_amount_committed_to_fi: 4554057.00, esif_amount_committed_to_fi: 1830857.00, total_amount_paid_to_fi: 1647771.30, esif_amount_paid_to_fi: 823885.65, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 0.00, esif_amount_committed_to_final_recipients: 0.00, total_amount_paid_to_final_recipients: 0.00, esif_amount_paid_to_final_recipients: 0.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "BE", cci: "2014BE16RFOP001", short_title: "Brussels Capital Region - ERDF", year: 2020, priority: "Axe 2", fund: "ERDF", too: 3, fi_name: "Outil de prÃªts avantageux Ã destination des entreprises de l'Ã©conomie sociale, d'insertion ou coopÃ©rative", fi_address: "Belgique, Bruxelles", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2017-05-31T00:00:00.000", funding_agreement_signature_date: "2018-05-23T00:00:00.000", total_amount_committed_to_fi: 6591086.00, esif_amount_committed_to_fi: 2746286.00, total_amount_paid_to_fi: 2526583.12, esif_amount_paid_to_fi: 1263291.56, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 0.00, esif_amount_committed_to_final_recipients: 0.00, total_amount_paid_to_final_recipients: 0.00, esif_amount_paid_to_final_recipients: 0.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" },
                { country: "BE", cci: "2014BE16RFOP001", short_title: "Brussels Capital Region - ERDF", year: 2021, priority: "Axe 1", fund: "ERDF", too: 1, fi_name: "Outil de prise de capital pour entreprises innovantes en early-stage", fi_address: "Belgique, Bruxelles", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2017-05-31T00:00:00.000", funding_agreement_signature_date: "2018-05-23T00:00:00.000", total_amount_committed_to_fi: 6085703.00, esif_amount_committed_to_fi: 2253964.00, total_amount_paid_to_fi: 2704756.80, esif_amount_paid_to_fi: 1352378.40, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 0.00, esif_amount_committed_to_final_recipients: 1550000.00, total_amount_paid_to_final_recipients: 775000.00, esif_amount_paid_to_final_recipients: 0.00, to_code_short_title: "TO 1 RTDI", to_long_title: "Strengthening research, technological development and innovation" },
                { country: "BE", cci: "2014BE16RFOP001", short_title: "Brussels Capital Region - ERDF", year: 2022, priority: "Axe 3", fund: "ERDF", too: 3, fi_name: "Outil de microcrÃ©dits", fi_address: "Belgique, Bruxelles", is_set_up_at_union_level: "N", fi_type: "Specific fund", ex_ante_completion_date: "2017-05-31T00:00:00.000", funding_agreement_signature_date: "2018-05-23T00:00:00.000", total_amount_committed_to_fi: 4554057.00, esif_amount_committed_to_fi: 1830857.00, total_amount_paid_to_fi: 1647771.30, esif_amount_paid_to_fi: 823885.65, management_costs_amount: 0.00, base_renumeration_amount: 0.00, performance_based_renumeration_paid_amount: 0.00, total_amount_committed_to_final_recipients: 494400.00, esif_amount_committed_to_final_recipients: 247200.00, total_amount_paid_to_final_recipients: 494400.00, esif_amount_paid_to_final_recipients: 247200.00, to_code_short_title: "TO 3 SMEs", to_long_title: "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)" }
            ]
        db_AFI.count({}, (error,count) =>{
            if(error) {
                res.sendStatus(500,"Internal error");
            }else{
                if(count === 0){
                    db_AFI.insert(datoss,(error,doc)=>{
                        if(error) {
                            res.sendStatus(500,"Internal error");
                        }else{
                            res.sendStatus(200,"OK"); 
                        }
                    });
                }
            }
        });
        });
        //POST22
        //Si se intenta usar alguno de los métodos no permitidos por la
        //tabla azul se debe devolver el código 405
        app.post(API_BASE + "/:country/:year", (req, res) => {
            const pais = req.params.country;
            const year =parseInt(req.params.year);
            let data = req.body;
            res.sendStatus(405, "Method Not Allowed");
        });
        //POST2
        //Si se intenta usar alguno de los métodos no permitidos por la
        //tabla azul se debe devolver el código 405
        app.post(API_BASE + "/:country", (req, res) => {
            const pais = req.params.country;
            let data = req.body;
            res.sendStatus(405, "Method Not Allowed");
        });
        //GET22
        app.get(API_BASE + "/:country/:year", (req, res) => {
            const pais = req.params.country;
            const ano =parseInt(req.params.year);
            db_AFI.find({country: pais, year:ano}, (error,countrydata)=>{
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
            db_AFI.find({country: pais}, (error,countrydata)=>{
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
        app.put(API_BASE + "/:country/:year", (req, res) => {
            const pais = req.params.country;
            const ano =parseInt(req.params.year);
            let data = req.body;
            const Fields = ["country", "cci", "short_title", "year", "priority", "fund", "too", "fi_name", "fi_address", "is_set_up_at_union_level", "fi_type", "ex_ante_completion_date", "funding_agreement_signature_date", "total_amount_committed_to_fi", "esif_amount_committed_to_fi", "total_amount_paid_to_fi", "esif_amount_paid_to_fi", "management_costs_amount", "base_renumeration_amount", "performance_based_renumeration_paid_amount", "total_amount_committed_to_final_recipients", "esif_amount_committed_to_final_recipients","total_amount_paid_to_final_recipients","esif_amount_paid_to_final_recipients", "to_code_short_title", "to_long_title"];
            // const recfields= Object.keys(data);
            // const missingfiels=Fields.filter(fiel => !recfields.includes(fiel));
            const isValidStructure = Fields.every(key => Object.prototype.hasOwnProperty.call(data, key));
            
            if (!isValidStructure || Object.keys(data).length !== Fields.length) {
                return res.status(400).send("Bad Request");
            }
            // if (data.country !== pais || parseInt(data.year) !== ano) {
            //     return res.status(400).send("Bad Request: Cannot change country or year");
            // }

                db_AFI.findOne({ country: pais, year: ano }, (err, existingData) => {
                if (err) {
                    return res.status(500).send("Internal Server Error");
                } else {
                    if (!existingData) {
                        return res.status(404).send("Not Found");
                    }else{
                        db_AFI.update({country: pais, year: ano}, data, {}, (error)=>{
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
            const Fields = ["country", "cci", "short_title", "year", "priority", "fund", "too", "fi_name", "fi_address", "is_set_up_at_union_level", "fi_type", "ex_ante_completion_date", "funding_agreement_signature_date", "total_amount_committed_to_fi", "esif_amount_committed_to_fi", "total_amount_paid_to_fi", "esif_amount_paid_to_fi", "management_costs_amount", "base_renumeration_amount", "performance_based_renumeration_paid_amount", "total_amount_committed_to_final_recipients", "esif_amount_committed_to_final_recipients","total_amount_paid_to_final_recipients","esif_amount_paid_to_final_recipients", "to_code_short_title", "to_long_title"];
            if (!data||Object.keys(data).length === 0 || data.country !== pais) {
                    res.sendStatus(400, "Bad Request");
                    
                } else {
                    db_AFI.update({country: pais}, data, {}, (error)=>{
                        if(error){
                            res.sendStatus(500, "Internal Server Error");
                        }else{

                            res.sendStatus(200, "Ok");
                        }
                    });
                }
            
        });
        //DELETE22
        app.delete(API_BASE + "/:country/:year", (req, res) => {
            const pais = req.params.country;
            const ano =parseInt(req.params.year);
            db_AFI.remove({country: pais, year:ano}, {multi: true}, (error, numremov)=>{
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
            db_AFI.remove({country: pais}, {multi: true}, (error, numremov)=>{
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
export{LoadBackendAFI2};
