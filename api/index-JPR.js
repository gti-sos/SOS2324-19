const API_BASE="/api/v1";
let data_JPR= require('../index-JPR');

module.exports = (app) => {
    app.get(API_BASE+"/esif-payments", (req,res)=>{
        res.send(JSON.stringify(data_JPR));
    });
}