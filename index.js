import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";

let app = express();

let db_AFI = new dataStore();
let db_AFI2 = new dataStore();
let db_PHT = new dataStore();
let db_PHT2 = new dataStore();

let db_RSG = new dataStore();
let db_JPR = new dataStore();

const PORT = (process.env.PORT || 10000);

import {handler} from "./front/build/handler.js";

import cors from "cors";

app.use(cors());

app.listen(PORT);
app.use(bodyParser.json());


//ALBERTO FRAILE
import {LoadBackendAFI} from "./back/Policy-program-stats/v1/index-AFI.js";
LoadBackendAFI(app,db_AFI);

import {LoadBackendAFI2} from "./back/Policy-program-stats/v2/index-AFI.js";
LoadBackendAFI2(app,db_AFI2);

//PEDRO HEREDIA
import {LoadBackendPHT} from "./back/Eu-payment-info/v1/index-PHT.js";
LoadBackendPHT(app,db_PHT);

import {LoadBackendPHT2} from "./back/Eu-payment-info/v2/index-PHT.js";
LoadBackendPHT2(app,db_PHT2);

//RAUL SEQUERA
//import {LoadBackendRSG} from "./back/index-RSG.js";
//LoadBackendRSG(app,db_RSG);

//JOSE MANUEL PEÑA
import {LoadBackendv1JPR} from "./back/Esif-payments/v1/index-JPR.js";
LoadBackendv1JPR(app,db_JPR);

import {LoadBackendv2JPR} from "./back/Esif-payments/v2/index-JPR.js";
LoadBackendv2JPR(app,db_JPR);

app.use(handler);

import path from "path";
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use("/", express.static("./public"));
console.log(`Server listening on port ${PORT}`);
