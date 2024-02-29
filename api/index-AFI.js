let express = require("express");
let app = express();
let bodyParser = require("body-parser");
app.use(bodyParser.json());
const API_BASE = '/api/v1/policy-program-stats';

var datos = [];

function AFI(app){
    //POST1
    app.post(API_BASE+"/", (req,res)=>{
        let data=req.body;
        const datose=datos.some(j =>j.country === data.country && j.year === data.year);
        if(datose){
            //No se puede hacer un POST con un recurso que ya existe;
            //en el caso contrario se debe devolver el código 409
            res.sendStatus(409,"CONFLICT");
        }else if(!data || Object.keys(data).length === 0){
            //Si se recibe un dato (JSON) que no tiene los 
            //campos esperados se debe devolver el código 400
            res.sendStatus(400, "BAD REQUEST");
        }else{
            //Crea un nuevo dato
            datos.push(data);
            res.sendStatus(201, "CREATED");
        }
    });
    //GET1
    app.get(API_BASE+"/", (req,res)=>{
        //lista todos los datos
        res.send(JSON.stringify(datos));
        res.sendStatus(200, "OK");
    });
    //PUT1
    app.put(API_BASE+ "/", (req, res) => {
        //Si se intenta usar alguno de los métodos no permitidos 
        //por la tabla azul se debe devolver el código 405
        let data=req.body;
        res.sendStatus(405,"Method not allowed");
    });
    //DELETE1
    app.delete(API_BASE + "/", (req, res) => {
        //Borrar todos los datos
        datos.splice(0, datos.length); 
        res.sendStatus(200,"Delete all");
    });

    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData 
    //que al hacer un GET cree 10 o más datos en el array
    //de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        if (datos.length === 0) {
            let datoss=
            [
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2015",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "BetlehemstraÃŸe 3, 4020 Linz, Austria",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2016-02-25T00:00:00.000",funding_agreement_signature_date : "2015-06-30T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "133081.00",base_renumeration_amount : "133081.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "450000.00",esif_amount_committed_to_final_recipients : "150000.00",total_amount_paid_to_final_recipients : "450000.00",esif_amount_paid_to_final_recipients : "150000.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2016",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-06-30T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "304000.00",base_renumeration_amount : "304000.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "950000.00",esif_amount_committed_to_final_recipients : "316667.00",total_amount_paid_to_final_recipients : "950000.00",esif_amount_paid_to_final_recipients : "316667.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2017",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-06-30T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "448000.00",base_renumeration_amount : "445000.00",performance_based_renumeration_paid_amount : "2000.00",total_amount_committed_to_final_recipients : "1522555.00",esif_amount_committed_to_final_recipients : "507518.00",total_amount_paid_to_final_recipients : "1522555.00",esif_amount_paid_to_final_recipients : "507518.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2018",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "-",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-06-30T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "8250000.00",esif_amount_paid_to_fi : "2250000.00",management_costs_amount : "631000.00",base_renumeration_amount : "535000.00",performance_based_renumeration_paid_amount : "96000.00",total_amount_committed_to_final_recipients : "6236298.00",esif_amount_committed_to_final_recipients : "2078766.00",total_amount_paid_to_final_recipients : "5569510.20",esif_amount_paid_to_final_recipients : "1856503.40",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2019",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-07-01T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "6886814.75",esif_amount_committed_to_final_recipients : "2295604.92",total_amount_paid_to_final_recipients : "6430814.75",esif_amount_paid_to_final_recipients : "2143604.92",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2020",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-07-01T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "7756185.76",esif_amount_committed_to_final_recipients : "2585395.25",total_amount_paid_to_final_recipients : "7456185.76",esif_amount_paid_to_final_recipients : "2485395.25",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2021",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-07-01T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "7256185.76",esif_amount_committed_to_final_recipients : "2418728.59",total_amount_paid_to_final_recipients : "7256185.76",esif_amount_paid_to_final_recipients : "2418728.59",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "AT",cci : "2014AT16RFOP001",short_title : "Investments in Growth and Employment - AT - ERDF",year : "2022",priority : "A.2",fund : "ERDF",to : "03",fi_name : "OÃ–. Hightechfonds",fi_address : "OÃ¶ Hightechfonds GmbH, BethlehemstraÃŸe 3, 4020 Linz",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2015-01-15T00:00:00.000",funding_agreement_signature_date : "2015-07-01T00:00:00.000",total_amount_committed_to_fi : "9000000.00",esif_amount_committed_to_fi : "3000000.00",total_amount_paid_to_fi : "9000000.00",esif_amount_paid_to_fi : "3000000.00",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "7756185.76",esif_amount_committed_to_final_recipients : "2585395.25",total_amount_paid_to_final_recipients : "7756185.76",esif_amount_paid_to_final_recipients : "2585395.25",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "BE",cci : "2014BE16RFOP001",short_title : "Brussels Capital Region - ERDF",year : "2019",priority : "Axe 1",fund : "ERDF",to : "01",fi_name : "Outil de prise de capital pour entreprises innovantes en early-stage",fi_address : "Belgique, Bruxelles",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2017-05-31T00:00:00.000",funding_agreement_signature_date : "2018-05-23T00:00:00.000",total_amount_committed_to_fi : "6085703.00",esif_amount_committed_to_fi : "2253964.00",total_amount_paid_to_fi : "1803171.20",esif_amount_paid_to_fi : "901585.60",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "0.00",esif_amount_committed_to_final_recipients : "0.00",total_amount_paid_to_final_recipients : "0.00",esif_amount_paid_to_final_recipients : "0.00",to_code_short_title : "TO 1 RTDI",to_long_title : "Strengthening research, technological development and innovation"},
                {country : "BE",cci : "2014BE16RFOP001",short_title : "Brussels Capital Region - ERDF",year : "2019",priority : "Axe 2",fund : "ERDF",to : "03",fi_name : "Outil de microcrÃ©dits",fi_address : "Belgique, Bruxelles",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2017-05-31T00:00:00.000",funding_agreement_signature_date : "2018-05-23T00:00:00.000",total_amount_committed_to_fi : "4554057.00",esif_amount_committed_to_fi : "1830857.00",total_amount_paid_to_fi : "1647771.30",esif_amount_paid_to_fi : "823885.65",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "0.00",esif_amount_committed_to_final_recipients : "0.00",total_amount_paid_to_final_recipients : "0.00",esif_amount_paid_to_final_recipients : "0.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "BE",cci : "2014BE16RFOP001",short_title : "Brussels Capital Region - ERDF",year : "2019",priority : "Axe 2",fund : "ERDF",to : "03",fi_name : "Outil de prÃªts avantageux Ã destination des entreprises de l'Ã©conomie sociale, d'insertion ou coopÃ©rative",fi_address : "Belgique, Bruxelles",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2017-05-31T00:00:00.000",funding_agreement_signature_date : "2018-05-23T00:00:00.000",total_amount_committed_to_fi : "6591086.00",esif_amount_committed_to_fi : "2746286.00",total_amount_paid_to_fi : "2526583.12",esif_amount_paid_to_fi : "1263291.56",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "0.00",esif_amount_committed_to_final_recipients : "0.00",total_amount_paid_to_final_recipients : "0.00",esif_amount_paid_to_final_recipients : "0.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"},
                {country : "BE",cci : "2014BE16RFOP001",short_title : "Brussels Capital Region - ERDF",year : "2020",priority : "Axe 1",fund : "ERDF",to : "01",fi_name : "Outil de prise de capital pour entreprises innovantes en early-stage",fi_address : "Belgique, Bruxelles",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2017-05-31T00:00:00.000",funding_agreement_signature_date : "2018-05-23T00:00:00.000",total_amount_committed_to_fi : "6085703.00",esif_amount_committed_to_fi : "2253964.00",total_amount_paid_to_fi : "2704756.80",esif_amount_paid_to_fi : "1352378.40",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "0.00",esif_amount_committed_to_final_recipients : "1550000.00",total_amount_paid_to_final_recipients : "775000.00",esif_amount_paid_to_final_recipients : "0.00",to_code_short_title : "TO 1 RTDI",to_long_title : "Strengthening research, technological development and innovation"},
                {country : "BE",cci : "2014BE16RFOP001",short_title : "Brussels Capital Region - ERDF",year : "2020",priority : "Axe 2",fund : "ERDF",to : "03",fi_name : "Outil de microcrÃ©dits",fi_address : "Belgique, Bruxelles",is_set_up_at_union_level : "N",fi_type : "Specific fund",ex_ante_completion_date : "2017-05-31T00:00:00.000",funding_agreement_signature_date : "2018-05-23T00:00:00.000",total_amount_committed_to_fi : "4554057.00",esif_amount_committed_to_fi : "1830857.00",total_amount_paid_to_fi : "1647771.30",esif_amount_paid_to_fi : "823885.65",management_costs_amount : "0.00",base_renumeration_amount : "0.00",performance_based_renumeration_paid_amount : "0.00",total_amount_committed_to_final_recipients : "494400.00",esif_amount_committed_to_final_recipients : "247200.00",total_amount_paid_to_final_recipients : "494400.00",esif_amount_paid_to_final_recipients : "247200.00",to_code_short_title : "TO 3 SMEs",to_long_title : "Enhancing the competitiveness of small and medium-sized enterprises (SMEs)"}
            ]
            for(let i = 0; i < datoss.length; i++){
                datos.push(datoss[i]);
            }
            res.sendStatus(201, "Data created");
        }else{
            res.send(JSON.stringify(datos))
            res.sendStatus(200, "OK");
        }
    });
    //POST2
    //Si se intenta usar alguno de los métodos no permitidos por la 
    //tabla azul se debe devolver el código 405
    app.post(API_BASE +"/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });
    //GET2
    app.get(API_BASE +"/:country", (req, res) => {
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
    app.put(API_BASE+ "/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        let act = false;

        for (let i=0;  i < datos.length; i++) {
            if (!data || Object.keys(data).length === 0 || datos[i].country !== pais) {
                res.sendStatus(400, "Bad Request");
                break;
                
            }else{
                datos[i] = data;
                act = true;
                res.sendStatus(200, "OK");
                break;
            }
        }
    });
    //DELETE2
    app.delete(API_BASE +"/:country", (req, res) => {
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
module.exports.afiv1 = AFI;