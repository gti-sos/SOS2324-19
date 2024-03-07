let express = require("express")
let dataStore = require("nedb");
let bodyParser = require("body-parser");

let data_PHT = require('./index-PHT');
let data_RSG = require('./index-RSG');

let api_PHT = require('./api/index-PHT');
let api_RSG = require('./api/index-RSG');

let app = express();

app.use(bodyParser.json());

app.use("/", express.static("./public"));

const path = require('path');
const PORT = (process.env.PORT || 10000);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//ALBERTO FRAILE
let API_AFI = require("./api/index-AFI.js");
let db_AFI = new dataStore();
API_AFI(app, db_AFI);


//PEDRO HEREDIA
api_PHT.phtv1(app);
app.get("/samples/PHT", (req, res) => {
    let pais = "Greece"

    res.send(data_PHT.mediaTotalNetPayments(data_PHT.data_pht, pais))
});


//RAUL SEQUERA

api_RSG.rsgv1(app);
app.get("/samples/RSG", (req, res) => {
    let country = "Austria";
    res.send(data_RSG.mediaNewCases(data_RSG.data_rsg, country));
});

//JOSE MANUEL PEÑA
let api_JPR = require('./api/index-JPR');
let db_JPR = new dataStore();
api_JPR(app,db_JPR);