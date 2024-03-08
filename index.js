let express = require("express")
let dataStore = require("nedb");
let bodyParser = require("body-parser");

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
let api_PHT = require('./api/index-PHT');
let db_PHT= new dataStore();
api_PHT(app,db_PHT);


//RAUL SEQUERA
let api_RSG = require('./api/index-RSG');
let db_RSG= new dataStore();
api_RSG(app,db_RSG);

//JOSE MANUEL PEÑA
let api_JPR = require('./api/index-JPR');
let db_JPR = new dataStore();
api_JPR(app,db_JPR);