let cool = require("cool-ascii-faces");
let express = require("express")
const data_AFI = require('./index-AFI');
let app = express();
let data_PHT= require('./index-PHT');

app.use("/",express.static("./public"));

app.get("/cool",(req ,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});
const PORT = (process.env.PORT || 10000);
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});

//ALBERTO FRAILE
function mediatotal_amount_committed_to_final_recipientsAT(data) {
    let total = 
    data
        .filter((n) => n.country === "AT")
        .map((n) => parseInt(n.total_amount_committed_to_final_recipients))
        .reduce((a, b) => a + b);
    
    let n = 
    data
        .filter((n) => n.country === "AT").length;
    
    media = total / n
    return media
}

app.get("/samples/AFI", (req,res)=>{
    const result = mediatotal_amount_committed_to_final_recipientsAT(data_AFI); 
    res.send(`<html> <body> <h1> media de total_amount_committed_to_final_recipients:  ${result}</h1> </body> </html>`)
});

//PEDRO HEREDIA
function mediaTotalNetPayments(datos){
    let sol=datos.filter((n)=> n.ms_name==="Greece").map((n)=>n.total_net_payments)
    .reduce((a,b)=>a+b);

    let n=datos.filter((n)=> n.ms_name==="Greece").length;

    media=sol/n

    return media
}

app.get("/samples/PHT", (req,res)=>{
    const result = mediaTotalNetPayments(data_PHT); 
    res.send(`<html> <body> <h1> La media de total_net_payments de Grecia es de: ${result}</h1> </body> </html>`)
});



// app.get("/samples/JPR",(req ,res)=>{
//     res.send(`<html><body><h1><script src="${__dirname}/index-JPR.js"></script></h1></body></html>`)
// });

// const mediaNewCases = require('./index-RSG.js');

// app.get("/samples/RSG", (req, res) => {
//     try {
//         const media = mediaNewCases(data, 'Austria');
//         res.send(`<html><body><h1>Media de new_cases en Austria: ${media}</h1></body></html>`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error al calcular la media');
//     }
// });