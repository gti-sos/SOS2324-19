import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import request from "request";
import {handler} from "./front/build/handler.js";
import cors from "cors";
import path from "path";


//ALBERTO FRAILE
import {LoadBackendAFI} from "./back/Policy-program-stats/v1/index-AFI.js";
import {LoadBackendAFI2} from "./back/Policy-program-stats/v2/index-AFI.js";
//PEDRO HEREDIA
import {LoadBackendPHT} from "./back/Eu-payment-info/v1/index-PHT.js";
import {LoadBackendPHT2} from "./back/Eu-payment-info/v2/index-PHT.js";

//RAUL SEQUERA
import {LoadBackendRSGv1} from "./back/Covid-testings/v1/index-RSG.js";
import {LoadBackendRSGv2} from "./back/Covid-testings/v2/index-RSG.js";

//JOSE MANUEL PEÑA
import {LoadBackendv1JPR} from "./back/Esif-payments/v1/index-JPR.js";
import {LoadBackendv2JPR} from "./back/Esif-payments/v2/index-JPR.js";


let app = express();

let db_AFI = new dataStore();
let db_AFI2 = new dataStore();
let db_PHT = new dataStore();
let db_PHT2 = new dataStore();
let db_RSG = new dataStore();
let db_RSG2 = new dataStore();
let db_JPR = new dataStore();
let db_JPR2 = new dataStore();

const PORT = (process.env.PORT || 10000);

app.use(cors());

app.listen(PORT);
app.use(bodyParser.json());

LoadBackendAFI(app,db_AFI);
LoadBackendAFI2(app,db_AFI2);

LoadBackendPHT(app,db_PHT);
LoadBackendPHT2(app,db_PHT2);

LoadBackendRSGv1(app,db_RSG);
LoadBackendRSGv2(app,db_RSG2);

LoadBackendv1JPR(app,db_JPR);
LoadBackendv2JPR(app,db_JPR2);

//proxy JPR
 app.use("/proxyJPR", function(req,res){
     var url = "https://api.api-ninjas.com/v1/city?country=us&limit=29"
     console.log("piped: " + req.url)
     req.pipe(request(url)).pipe(res);
 });

//proxy AFI
app.use("/proxyAFI", function(req,res){
    var url = "https://tnd-exchange-rate.p.rapidapi.com/api"
    console.log("piped: " + req.url)
    req.pipe(request(url)).pipe(res);
});

//proxy RSG
app.use("/proxyRSG", function(req,res){
    var url = "https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=Arsenal"
    console.log("piped: " + req.url)
    req.pipe(request(url)).pipe(res);
});

//proxy PHT
app.use("/proxyPHT", function(req,res){
    var url = "https://api.api-ninjas.com/v1/worldtime?timezone=Europe/London"
    console.log("piped: " + req.url)
    req.pipe(request(url)).pipe(res);
});

app.use(handler);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use("/", express.static("./public"));
console.log(`Server listening on port ${PORT}`);
