let cool = require("cool-ascii-faces");
let express = require("express")
let bodyParser = require("body-parser");

let data_AFI = require('./index-AFI');
let data_PHT= require('./index-PHT');
let data_RSG= require('./index-RSG');
let data_JPR= require('./index-JPR');

let api_JPR = require('./api/index-JPR');
let api_PHT=require('./api/index-PHT')

let app = express();

app.use(bodyParser.json());

app.use("/",express.static("./public"));

const path = require('path');
const API_BASE = '/api/v1';
const PORT = (process.env.PORT || 10000);

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/cool",(req ,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

//ALBERTO FRAILE
app.get("/samples/AFI", (req,res)=>{
    let pais ="AT";
    res.send(data_AFI.media_amon(data_AFI.datos_afi,pais));
});


//PEDRO HEREDIA

app.get("/samples/PHT", (req,res)=>{
    let pais="Greece"
    const result = mediaTotalNetPayments(data_PHT,pais);
    res.send(`<html> <body> <h1> La media de total_net_payments de ${pais} es de: ${result}</h1> </body> </html>`)
});

api_PHT(app);



//RAUL SEQUERA
function mediaNewCases(data, searchString){
    let suma = data.filter((n)=>n.country.match(searchString))
    .map((n)=>n.new_cases).reduce((a, b) => a + b);

    let res = data.filter((n) => n.country === searchString).length;

    let media = suma/res;

    return media.toFixed(2);
}



app.get("/samples/RSG", (req,res)=>{
    let city = 'Austria';
    const result = mediaNewCases(data_RSG, city);
    res.send(`<html> <body> <h1> La media de new_cases de ${city} es de: ${result}</h1> </body> </html>`)
});



//JOSE MANUEL PEÑA

app.get("/samples/JPR", (req,res)=>{
    let pais = "Interreg"
    res.send(`<html> <body> <h1>La media de net pre financing de ${pais} es ${mediaPreFinancing(data_JPR,pais)}.</h1> </body> </html>`)
});

api_JPR(app);