let datos =
    [
        {ms : "IT" , ms_name : "Italy" , cci : "2014IT16RFOP017", title : "Toscana - ERDF", fund : "ERDF" ,
        category_of_region : "More developed" , year : 2023 , net_planned_eu_amount : 389513945 , 
        cumulative_initial_pre_financing : 11173608.57 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 72720941.21,
        pre_financing_covered_by_expenditure : 26381261.74 , recovery_of_annual_pre_financing : 34963288.36 , 
        net_pre_financing : 22549999.68 , cumulative_interim_payments : 340582683.58 , recovery_of_expenses : 0,
        net_interim_payments : 366963945.32 , total_net_payments : 389513945 , eu_payment_rate : 100 , 
        eu_payment_rate_on_planned_eu_amount : 100},

        {ms : "EE" , ms_name : "Estonia" , cci : "2014EE06RDNP001", title : "Estonia - National Rural Development - ERDF", fund : "EAFRD" ,
        category_of_region : "" , year : 2023 , net_planned_eu_amount : 1081864629 , 
        cumulative_initial_pre_financing : 24700246.74 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 0,
        pre_financing_covered_by_expenditure : 0 , recovery_of_annual_pre_financing : 0 , 
        net_pre_financing : 24700246.74 , cumulative_interim_payments : 903528358.06 , recovery_of_expenses : 0,
        net_interim_payments : 903528358.06 , total_net_payments : 928228604.8 , eu_payment_rate : 857989604168859 , 
        eu_payment_rate_on_planned_eu_amount : 857989604168859},

        {ms : "TC" , ms_name : "Interreg" , cci : "2014TC16I5CB010", title : "IPA CBC Greece - Albania", fund : "PAE-contribution from ERDF" ,
        category_of_region : "" , year : 2023 , net_planned_eu_amount : 22982611 , 
        cumulative_initial_pre_financing : 3716776.5 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 0,
        pre_financing_covered_by_expenditure : 0 , recovery_of_annual_pre_financing : 0 , 
        net_pre_financing : 3716776.5 , cumulative_interim_payments : 18046057.46 , recovery_of_expenses : 0,
        net_interim_payments : 18046057.46 , total_net_payments : 21762833.96 , eu_payment_rate : 946926089468251 , 
        eu_payment_rate_on_planned_eu_amount : 946926089468251},

        {ms : "FR" , ms_name : "France" , cci : "2014FR16M0OP011", title : "Martinique - ERDF/ESF/YEI", fund : "ERDF" ,
        category_of_region : "Less developed" , year : 2023 , net_planned_eu_amount : 351959114 , 
        cumulative_initial_pre_financing : 9925247.01 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 64954054.47,
        pre_financing_covered_by_expenditure : 16898709.82 , recovery_of_annual_pre_financing : 35527460.04 , 
        net_pre_financing : 22453131.62 , cumulative_interim_payments : 202046681.16 , recovery_of_expenses : 0,
        net_interim_payments : 218945390.98 , total_net_payments : 241398522.6 , eu_payment_rate : 68587092363234 , 
        eu_payment_rate_on_planned_eu_amount : 68587092363234},

        {ms : "BE" , ms_name : "Belgium" , cci : "2014BE05FMOP001", title : "FEAD - Belgium", fund : "FEAD" ,
        category_of_region : "REACT-EU" , year : 2023 , net_planned_eu_amount : 46087224 , 
        cumulative_initial_pre_financing : 4763076.6 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 0,
        pre_financing_covered_by_expenditure : 0 , recovery_of_annual_pre_financing : 0 , 
        net_pre_financing : 4763076.6 , cumulative_interim_payments : 31062450.93 , recovery_of_expenses : 0,
        net_interim_payments : 31062450.93 , total_net_payments : 35825527.53 , eu_payment_rate : 777341840549997 , 
        eu_payment_rate_on_planned_eu_amount : 777341840549997},

        {ms : "TC" , ms_name : "Interreg" , cci : "2014TC16I5CB010", title : "IPA CBC Greece - Albania", fund : "IPAE" ,
        category_of_region : "" , year : 2023 , net_planned_eu_amount : 22982611 , 
        cumulative_initial_pre_financing : 3716776.5 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 0,
        pre_financing_covered_by_expenditure : 0 , recovery_of_annual_pre_financing : 0 , 
        net_pre_financing : 3716776.5 , cumulative_interim_payments : 18046057.26 , recovery_of_expenses : 0,
        net_interim_payments : 18046057.26 , total_net_payments : 21762833.76 , eu_payment_rate : 946926080766019 , 
        eu_payment_rate_on_planned_eu_amount : 946926080766019},

        {ms : "TC" , ms_name : "Interreg" , cci : "2014TC16RFCB009", title : "Interreg V-A - Germany/Bayern-Czech Republic", fund : "ERDF" ,
        category_of_region : "" , year : 2023 , net_planned_eu_amount : 103375149 , 
        cumulative_initial_pre_financing : 3101254.47 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 19899716.18,
        pre_financing_covered_by_expenditure : 7201034.06 , recovery_of_annual_pre_financing : 9056232.3 , 
        net_pre_financing : 6743704.29 , cumulative_interim_payments : 79980641.14 , recovery_of_expenses : 0,
        net_interim_payments : 87181675.2 , total_net_payments : 93925379.49 , eu_payment_rate : 908587609290894 , 
        eu_payment_rate_on_planned_eu_amount : 908587609290894},

        {ms : "CY" , ms_name : "Cyprus" , cci : "2014CY16M1OP001", title : " Competitiveness and sustainable development - CY - ERDF/CF", fund : "CF" ,
        category_of_region : "" , year : 2023 , net_planned_eu_amount : 258856192 , 
        cumulative_initial_pre_financing : 10134768 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 51156203.27,
        pre_financing_covered_by_expenditure : 19972936.28 , recovery_of_annual_pre_financing : 21746800.61 , 
        net_pre_financing : 19571234.38 , cumulative_interim_payments : 219312021.34 , recovery_of_expenses : 0,
        net_interim_payments : 239284957.62 , total_net_payments : 258856192 , eu_payment_rate : 100 , 
        eu_payment_rate_on_planned_eu_amount : 100},

        {ms : "PL" , ms_name : "Poland" , cci : "2014PL16M2OP008", title : "Opolskie Voivodeship - ERDF/ESF", fund : "ERDF" ,
        category_of_region : "REACT-EU" , year : 2024 , net_planned_eu_amount : 13123568 , 
        cumulative_initial_pre_financing : 4955701.95 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 482724.78,
        pre_financing_covered_by_expenditure : 4759.17 , recovery_of_annual_pre_financing : 215494.25 , 
        net_pre_financing : 5218173.31 , cumulative_interim_payments : 7472694.41 , recovery_of_expenses : 0,
        net_interim_payments : 7477453.58 , total_net_payments : 12695626.89 , eu_payment_rate : 967391405294658 , 
        eu_payment_rate_on_planned_eu_amount : 967391405294658},

        {ms : "ES" , ms_name : "Spain" , cci : "2014ES16RFOP005", title : "Asturias  - ERDF", fund : "ERDF" ,
        category_of_region : "More developed" , year : 2023 , net_planned_eu_amount : 256779031 , 
        cumulative_initial_pre_financing : 8341606.04 , cumulative_additional_initial_pre_financing : 0 ,
        recovery_of_initial_pre_financing : 0 , cumulative_annual_pre_financing : 47815463.33,
        pre_financing_covered_by_expenditure : 11534327.06 , recovery_of_annual_pre_financing : 26301724.45 , 
        net_pre_financing : 18321017.86 , cumulative_interim_payments : 227111465.82 , recovery_of_expenses : 187779.74,
        net_interim_payments : 238458013.14 , total_net_payments : 256779031 , eu_payment_rate : 100 , 
        eu_payment_rate_on_planned_eu_amount : 100}
    ];

module.exports.data_JPR = datos;
//Funcion que calcula la media de net_pre_financing que su ms name sea name
function mediaPreFinancing(data,name) {
    let total =
    data
        .filter((n) => n.ms_name === name)
        .map((n) => n.net_pre_financing)
        .reduce((a, b) => a + b);

    let n =
    data
        .filter((n) => n.ms_name === name).length;

    media = total / n

    return media;
}
let pais = "Interreg"
console.log(`La media de net pre financing de ${pais} es ${mediaPreFinancing(datos,pais)}.`);

module.exports.mediaPreFinancing = mediaPreFinancing;