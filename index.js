let cool = require("cool-ascii-faces");
let express = require("express")

let app = express();

const PORT = (process.env.PORT || 10000);

app.use("/",express.static("./public"));

app.get("/cool",(req ,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

app.get("/samples/JPR",(req ,res)=>{
    res.send(`<html><body><h1><script src="${__dirname}/index-JPR.js"></script></h1></body></html>`)
});
app.get("/samples/AFI", (req,res)=>{
    res.send(`<html><body><h1>${index-AFI.js}</h1></body></html>`);
});

const mediaNewCases = require('./index-RSG.js');

app.get("/samples/RSG", (req, res) => {
    try {
        const media = mediaNewCases(data, 'Austria');
        res.send(`<html><body><h1>Media de new_cases en Austria: ${media}</h1></body></html>`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al calcular la media');
    }
});

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});