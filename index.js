let cool = require("cool-ascii-faces");
let express = require("express")
let bodyParser = require("body-parser");

let data_AFI = require('./index-AFI');
let data_PHT = require('./index-PHT');
let data_RSG = require('./index-RSG');
let data_JPR = require('./index-JPR');

let api_JPR = require('./api/index-JPR');
let api_PHT = require('./api/index-PHT');
let api_AFI = require('./api/index-AFI');
let api_RSG = require('./api/index-RSG');

let dataStore = require("nedb");
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

app.get("/cool", (req, res) => {
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

//ALBERTO FRAILE
api_AFI.afiv1(app);
app.get("/samples/AFI", (req, res) => {
    let pais = "AT";
    res.send(data_AFI.media_amon(data_AFI.datos_afi, pais));
});


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
api_JPR(app);