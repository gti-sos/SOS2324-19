import express from "express";
import dataStore from"nedb";
import bodyParser from "body-parser";
import {handler} from "./front/build/handler.js";

let app = express();

app.use(bodyParser.json());

//app.use("/", express.static("./public"));

//const path = require('path');
const PORT = (process.env.PORT || 10000);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//ALBERTO FRAILE
import {loadBackendAFI} from "./back/index-AFI.js";
let db_AFI= new dataStore();
loadBackendAFI(app,db_AFI);


//PEDRO HEREDIA
import {loadBackendPHT} from "./back/index-PHT.js";
let db_PHT= new dataStore();
loadBackendPHT(app,db_PHT);


//RAUL SEQUERA
import {loadBackendRSG} from "./back/index-RSG.js";
let db_RSG= new dataStore();
loadBackendRSG(app,db_RSG);

//JOSE MANUEL PEÑA
import {loadBackendJPR} from "./back/index-JPR.js";
let db_JPR = new dataStore();
loadBackendJPR(app, db_JPR);

//Esto tiene q ir abajo putos inutiles
app.use(handler);
