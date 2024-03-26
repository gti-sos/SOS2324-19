let express = require("express")
let bodyParser = require("body-parser");

let dataStore = require("nedb");
let db_AFI = new dataStore();
let db_PHT = new dataStore();
let db_RSG = new dataStore();
let db_JPR = new dataStore();

import {handler} from "./front/build/handler.js";
//import cors from "cors";

let app = express();
const PORT = (process.env.PORT || 10000);

//app.use(cors());

app.listen(PORT);
app.use(bodyParser.json());


//ALBERTO FRAILE
import {LoadBackendAFI} from "./backed/index-AFI.js";
LoadBackendAFI(app,db_AFI);
//PEDRO HEREDIA
import {LoadBackendPHT} from "./backed/index-PHT.js";
LoadBackendPHT(app,db_PHT);
//RAUL SEQUERA
import {LoadBackendRSG} from "./backed/index-RSG.js";
LoadBackendRSG(app,db_RSG);
//JOSE MANUEL PEÑA
import {LoadBackendJPR} from "./backed/index-JPR.js";
LoadBackendJPR(app,db_JPR);

app.use(handler);

import path from "path";
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use("/", express.static("./public"));
console.log(`Server listening on port ${PORT}`);
