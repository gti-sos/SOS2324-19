const API_BASE="/api/v1";
let data_PHT=require('../index-PHT');


module.exports = (app) => {
    app.get(API_BASE+"/eu-payment-info", (req,res)=>{
        res.send(JSON.stringify(data_PHT));
    });
}