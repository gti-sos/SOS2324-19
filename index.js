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

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});