const API_BASE = "/api/v2/esif-payments";
let initial_data = [
        {
            ms: "IT",
            ms_name: "Italy",
            cci: "2014IT16RFOP017",
            title: "Toscana - ERDF",
            fund: "ERDF",
            category_of_region: "More developed",
            year: 2023,
            net_planned_eu_amount: 389513945,
            cumulative_initial_pre_financing: 11173608.57,
            cumulative_additional_initial_pre_financing: 0, 
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 72720941.21,
            pre_financing_covered_by_expenditure: 26381261.74,
            recovery_of_annual_pre_financing: 34963288.36,
            net_pre_financing: 22549999.68,
            cumulative_interim_payments: 340582683.58,
            recovery_of_expenses: 0,
            net_interim_payments: 366963945.32,
            total_net_payments: 389513945,
            eu_payment_rate: 100,
            eu_payment_rate_on_planned_eu_amount: 100
        },
        {
            ms: "EE",
            ms_name: "Estonia",
            cci: "2014EE06RDNP001",
            title: "Estonia - National Rural Development - ERDF",
            fund: "EAFRD",
            category_of_region: "",
            year: 2023,
            net_planned_eu_amount: 1081864629,
            cumulative_initial_pre_financing: 24700246.74,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 24700246.74,
            cumulative_interim_payments: 903528358.06,
            recovery_of_expenses: 0,
            net_interim_payments: 903528358.06,
            total_net_payments: 928228604.8,
            eu_payment_rate: 857989604168859,
            eu_payment_rate_on_planned_eu_amount: 857989604168859
        },
        {
            ms: "FR",
            ms_name: "France",
            cci: "2014FR16M0OP011",
            title: "Martinique - ERDF/ESF/YEI",
            fund: "ERDF",
            category_of_region: "Less developed",
            year: 2023,
            net_planned_eu_amount: 351959114,
            cumulative_initial_pre_financing: 9925247.01,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 64954054.47,
            pre_financing_covered_by_expenditure: 16898709.82,
            recovery_of_annual_pre_financing: 35527460.04,
            net_pre_financing: 22453131.62,
            cumulative_interim_payments: 202046681.16,
            recovery_of_expenses: 0,
            net_interim_payments: 218945390.98,
            total_net_payments: 241398522.6,
            eu_payment_rate: 68587092363234,
            eu_payment_rate_on_planned_eu_amount: 68587092363234
        },
        {
            ms: "BE",
            ms_name: "Belgium",
            cci: "2014BE05FMOP001",
            title: "FEAD - Belgium",
            fund: "FEAD",
            category_of_region: "REACT-EU",
            year: 2023,
            net_planned_eu_amount: 46087224,
            cumulative_initial_pre_financing: 4763076.6,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 4763076.6,
            cumulative_interim_payments: 31062450.93,
            recovery_of_expenses: 0,
            net_interim_payments: 31062450.93,
            total_net_payments: 35825527.53,
            eu_payment_rate: 777341840549997,
            eu_payment_rate_on_planned_eu_amount: 777341840549997
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16I5CB010",
            title: "IPA CBC Greece - Albania",
            fund: "IPAE",
            category_of_region: "",
            year: 2023,
            net_planned_eu_amount: 22982611,
            cumulative_initial_pre_financing: 3716776.5,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 3716776.5,
            cumulative_interim_payments: 18046057.26,
            recovery_of_expenses: 0,
            net_interim_payments: 18046057.26,
            total_net_payments: 21762833.76,
            eu_payment_rate: 946926080766019,
            eu_payment_rate_on_planned_eu_amount: 946926080766019
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16RFCB009",
            title: "Interreg V-A - Germany/Bayern-Czech Republic",
            fund: "ERDF",
            category_of_region: "",
            year: 2023,
            net_planned_eu_amount: 103375149,
            cumulative_initial_pre_financing: 3101254.47,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 19899716.18,
            pre_financing_covered_by_expenditure: 7201034.06,
            recovery_of_annual_pre_financing: 9056232.3,
            net_pre_financing: 6743704.29,
            cumulative_interim_payments: 79980641.14,
            recovery_of_expenses: 0,
            net_interim_payments: 87181675.2,
            total_net_payments: 93925379.49,
            eu_payment_rate: 908587609290894,
            eu_payment_rate_on_planned_eu_amount: 908587609290894
        },
        {
            ms: "CY",
            ms_name: "Cyprus",
            cci: "2014CY16M1OP001",
            title: " Competitiveness and sustainable development - CY - ERDF/CF",
            fund: "CF",
            category_of_region: "",
            year: 2023,
            net_planned_eu_amount: 258856192,
            cumulative_initial_pre_financing: 10134768,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 51156203.27,
            pre_financing_covered_by_expenditure: 19972936.28,
            recovery_of_annual_pre_financing: 21746800.61,
            net_pre_financing: 19571234.38,
            cumulative_interim_payments: 219312021.34,
            recovery_of_expenses: 0,
            net_interim_payments: 239284957.62,
            total_net_payments: 258856192,
            eu_payment_rate: 100,
            eu_payment_rate_on_planned_eu_amount: 100
        },
        {
            ms: "PL",
            ms_name: "Poland",
            cci: "2014PL16M2OP008",
            title: "Opolskie Voivodeship - ERDF/ESF",
            fund: "ERDF",
            category_of_region: "REACT-EU",
            year: 2024,
            net_planned_eu_amount: 13123568,
            cumulative_initial_pre_financing: 4955701.95,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 482724.78,
            pre_financing_covered_by_expenditure: 4759.17,
            recovery_of_annual_pre_financing: 215494.25,
            net_pre_financing: 5218173.31,
            cumulative_interim_payments: 7472694.41,
            recovery_of_expenses: 0,
            net_interim_payments: 7477453.58,
            total_net_payments: 12695626.89,
            eu_payment_rate: 967391405294658,
            eu_payment_rate_on_planned_eu_amount: 967391405294658
        },
        {
            ms: "ES",
            ms_name: "Spain",
            cci: "2014ES16RFOP005",
            title: "Asturias  - ERDF",
            fund: "ERDF",
            category_of_region: "More developed",
            year: 2023,
            net_planned_eu_amount: 256779031,
            cumulative_initial_pre_financing: 8341606.04,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 47815463.33,
            pre_financing_covered_by_expenditure: 11534327.06,
            recovery_of_annual_pre_financing: 26301724.45,
            net_pre_financing: 18321017.86,
            cumulative_interim_payments: 227111465.82,
            recovery_of_expenses: 187779.74,
            net_interim_payments: 238458013.14,
            total_net_payments: 256779031,
            eu_payment_rate: 100,
            eu_payment_rate_on_planned_eu_amount: 100
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16RFIR001",
            title: "Interreg Europe",
            fund: "ERDF",
            category_of_region: null,
            year: 2021,
            net_planned_eu_amount: 359326320,
            cumulative_initial_pre_financing: 10779789.6,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 54797263.8,
            pre_financing_covered_by_expenditure: 14893717.06,
            recovery_of_annual_pre_financing: 27013181.84,
            net_pre_financing: 23670154.5,
            cumulative_interim_payments: 212859878.39,
            recovery_of_expenses: 0,
            net_interim_payments: 227753595.45,
            total_net_payments: 251423749.95,
            eu_payment_rate: 69.9708693618658,
            eu_payment_rate_on_planned_eu_amount: 69.9708693618658
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16RFCB033",
            title: "Interreg V-A - Italy-France (Maritime)",
            fund: "ERDF",
            category_of_region: "",
            year: 2018,
            net_planned_eu_amount: 169702411,
            cumulative_initial_pre_financing: 5091072.33,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 12515552.81,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 7848736.51,
            net_pre_financing: 9757888.63,
            cumulative_interim_payments: 10041474.18,
            recovery_of_expenses: 0,
            net_interim_payments: 10041474.18,
            total_net_payments: 19799362.81,
            eu_payment_rate: 11.6671075521726,
            eu_payment_rate_on_planned_eu_amount: 11.6671075521726
        },
        {
            ms: "DE",
            ms_name: "Germany",
            cci: "2014DE16RFOP015",
            title: "Thüringen - ERDF",
            fund: "ERDF",
            category_of_region: "Transition",
            year: 2021,
            net_planned_eu_amount: 1165077915,
            cumulative_initial_pre_financing: 32855197.2,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 168412012.61,
            pre_financing_covered_by_expenditure: 24501676.92,
            recovery_of_annual_pre_financing: 89122546.74,
            net_pre_financing: 87642986.15,
            cumulative_interim_payments: 550193406.66,
            recovery_of_expenses: 0,
            net_interim_payments: 574695083.58,
            total_net_payments: 662338069.73,
            eu_payment_rate: 56.8492511275523,
            eu_payment_rate_on_planned_eu_amount: 56.8492511275523
        },
        {
            ms: "FI",
            ms_name: "Finland",
            cci: "2014FI06RDRP002",
            title: "Åland - Rural Development",
            fund: "EAFRD",
            category_of_region: "",
            year: 2024,
            net_planned_eu_amount: 29381805.76,
            cumulative_initial_pre_financing: 621270,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 621270,
            cumulative_interim_payments: 25780625.34,
            recovery_of_expenses: 0,
            net_interim_payments: 25780625.34,
            total_net_payments: 26401895.34,
            eu_payment_rate: 89.857973861985,
            eu_payment_rate_on_planned_eu_amount: 89.857973861985
        },
        {
            ms: "SE",
            ms_name: "Sweden",
            cci: "2014SE16RFOP006",
            title: "North-Central Sweden - ERDF",
            fund: "ERDF",
            category_of_region: "More developed",
            year: 2021,
            net_planned_eu_amount: 144955259,
            cumulative_initial_pre_financing: 4146682.68,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 21044154.89,
            pre_financing_covered_by_expenditure: 7312695.08,
            recovery_of_annual_pre_financing: 9150925.71,
            net_pre_financing: 8727216.78,
            cumulative_interim_payments: 87328387.2,
            recovery_of_expenses: 0,
            net_interim_payments: 94641082.28,
            total_net_payments: 103368299.06,
            eu_payment_rate: 71.3104855754147,
            eu_payment_rate_on_planned_eu_amount: 71.3104855754147
        },
        {
            ms: "IT",
            ms_name: "Italy",
            cci: "2014IT05SFOP018",
            title: "Trento  - ESF",
            fund: "ESF",
            category_of_region: "More developed",
            year: 2022,
            net_planned_eu_amount: 63218677,
            cumulative_initial_pre_financing: 1550717.76,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 9377750.52,
            pre_financing_covered_by_expenditure: 3593861.25,
            recovery_of_annual_pre_financing: 4168370.97,
            net_pre_financing: 3166236.06,
            cumulative_interim_payments: 45147663.23,
            recovery_of_expenses: 0,
            net_interim_payments: 48741524.48,
            total_net_payments: 51907760.54,
            eu_payment_rate: 82.1082676880442,
            eu_payment_rate_on_planned_eu_amount: 82.1082676880442
        },
        {
            ms: "IT",
            ms_name: "Italy",
            cci: "2014IT06RDRP002",
            title: "Bolzano - Rural Development",
            fund: "EAFRD",
            category_of_region: "",
            year: 2024,
            net_planned_eu_amount: 218907027.76,
            cumulative_initial_pre_financing: 4739820,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 4739820,
            cumulative_interim_payments: 191401032.48,
            recovery_of_expenses: 0,
            net_interim_payments: 191401032.48,
            total_net_payments: 196140852.48,
            eu_payment_rate: 89.6000710836201,
            eu_payment_rate_on_planned_eu_amount: 89.6000710836201
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16RFIR001",
            title: "Interreg Europe",
            fund: "ERDF",
            category_of_region: null,
            year: 2021,
            net_planned_eu_amount: 359326320,
            cumulative_initial_pre_financing: 10779789.6,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 54797263.8,
            pre_financing_covered_by_expenditure: 14893717.06,
            recovery_of_annual_pre_financing: 27013181.84,
            net_pre_financing: 23670154.5,
            cumulative_interim_payments: 212859878.39,
            recovery_of_expenses: 0,
            net_interim_payments: 227753595.45,
            total_net_payments: 251423749.95,
            eu_payment_rate: 69.9708693618658,
            eu_payment_rate_on_planned_eu_amount: 69.9708693618658
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16RFCB033",
            title: "Interreg V-A - Italy-France (Maritime)",
            fund: "ERDF",
            category_of_region: "",
            year: 2018,
            net_planned_eu_amount: 169702411,
            cumulative_initial_pre_financing: 5091072.33,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 12515552.81,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 7848736.51,
            net_pre_financing: 9757888.63,
            cumulative_interim_payments: 10041474.18,
            recovery_of_expenses: 0,
            net_interim_payments: 10041474.18,
            total_net_payments: 19799362.81,
            eu_payment_rate: 11.6671075521726,
            eu_payment_rate_on_planned_eu_amount: 11.6671075521726
        },
        {
            ms: "DE",
            ms_name: "Germany",
            cci: "2014DE16RFOP015",
            title: "Thüringen - ERDF",
            fund: "ERDF",
            category_of_region: "Transition",
            year: 2021,
            net_planned_eu_amount: 1165077915,
            cumulative_initial_pre_financing: 32855197.2,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 168412012.61,
            pre_financing_covered_by_expenditure: 24501676.92,
            recovery_of_annual_pre_financing: 89122546.74,
            net_pre_financing: 87642986.15,
            cumulative_interim_payments: 550193406.66,
            recovery_of_expenses: 0,
            net_interim_payments: 574695083.58,
            total_net_payments: 662338069.73,
            eu_payment_rate: 56.8492511275523,
            eu_payment_rate_on_planned_eu_amount: 56.8492511275523
        },
        {
            ms: "SE",
            ms_name: "Sweden",
            cci: "2014SE16RFOP006",
            title: "North-Central Sweden - ERDF",
            fund: "ERDF",
            category_of_region: "More developed",
            year: 2021,
            net_planned_eu_amount: 144955259,
            cumulative_initial_pre_financing: 4146682.68,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 21044154.89,
            pre_financing_covered_by_expenditure: 7312695.08,
            recovery_of_annual_pre_financing: 9150925.71,
            net_pre_financing: 8727216.78,
            cumulative_interim_payments: 87328387.2,
            recovery_of_expenses: 0,
            net_interim_payments: 94641082.28,
            total_net_payments: 103368299.06,
            eu_payment_rate: 71.3104855754147,
            eu_payment_rate_on_planned_eu_amount: 71.3104855754147
        },
        {
            ms: "PL",
            ms_name: "Poland",
            cci: "2014PL16M2OP016",
            title: "Zachodniomorskie Voivodeship - ERDF/ESF",
            fund: "ERDF",
            category_of_region: "REACT-EU",
            year: 2024,
            net_planned_eu_amount: 22237765,
            cumulative_initial_pre_financing: 8397391.05,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 817972.68,
            pre_financing_covered_by_expenditure: 31022.16,
            recovery_of_annual_pre_financing: 342195.22,
            net_pre_financing: 8842146.35,
            cumulative_interim_payments: 10982515.68,
            recovery_of_expenses: 0,
            net_interim_payments: 11013537.84,
            total_net_payments: 19855684.19,
            eu_payment_rate: 89.2881285057199,
            eu_payment_rate_on_planned_eu_amount: 89.2881285057199
        },
        {
            ms: "IE",
            ms_name: "Ireland",
            cci: "2014IE06RDNP001",
            title: "Ireland - National Rural Development",
            fund: "EAFRD",
            category_of_region: "",
            year: 2020,
            net_planned_eu_amount: 2190589653,
            cumulative_initial_pre_financing: 7667072.36,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 76670725.36,
            cumulative_interim_payments: 1812096866.68,
            recovery_of_expenses: 0,
            net_interim_payments: 1812096866.68,
            total_net_payments: 1888767592.04,
            eu_payment_rate: 86.2218804627943,
            eu_payment_rate_on_planned_eu_amount: 86.2218804627943
        },
        {
            ms: "TC",
            ms_name: "Interreg",
            cci: "2014TC16I5CB007",
            title: "IPA CBC Bulgaria - Serbia",
            fund: "IPAE-contribution from ERDF",
            category_of_region: "",
            year: 2019,
            net_planned_eu_amount: 14493457,
            cumulative_initial_pre_financing: 2995613.5,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 2995613.5,
            cumulative_interim_payments: 5400654.41,
            recovery_of_expenses: 0,
            net_interim_payments: 5400654.41,
            total_net_payments: 8396267.91,
            eu_payment_rate: 57.9314369925684,
            eu_payment_rate_on_planned_eu_amount: 57.9314369925684
        },
        {
            ms: "ES",
            ms_name: "Spain",
            cci: "2014ES16RFOP021",
            title: "País Vasco  - ERDF",
            fund: "ERDF",
            category_of_region: "More developed",
            year: 2022,
            net_planned_eu_amount: 179129007,
            cumulative_initial_pre_financing: 5784204.3,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 29206034.03,
            pre_financing_covered_by_expenditure: 7194672.17,
            recovery_of_annual_pre_financing: 15403028.08,
            net_pre_financing: 12392538.08,
            cumulative_interim_payments: 159265264.38,
            recovery_of_expenses: 0,
            net_interim_payments: 166459936.55,
            total_net_payments: 178852474.63,
            eu_payment_rate: 99.8456239027775,
            eu_payment_rate_on_planned_eu_amount: 99.8456239027775
        },
        {
            ms: "FR",
            ms_name: "France",
            cci: "2014FR06RDRP093",
            title: "Provence-Alpes-Côte d'Azur - Rural Development",
            fund: "EAFRD",
            category_of_region: "",
            year: 2015,
            net_planned_eu_amount: 476769791,
            cumulative_initial_pre_financing: 9535395.82,
            cumulative_additional_initial_pre_financing: 0,
            recovery_of_initial_pre_financing: 0,
            cumulative_annual_pre_financing: 0,
            pre_financing_covered_by_expenditure: 0,
            recovery_of_annual_pre_financing: 0,
            net_pre_financing: 9535395.82,
            cumulative_interim_payments: 18447595.1,
            recovery_of_expenses: 0,
            net_interim_payments: 18447595.1,
            total_net_payments: 27982990.92,
            eu_payment_rate: 5.86928774604346,
            eu_payment_rate_on_planned_eu_amount: 5.86928774604346
        }
    ]
let structure = {
    "ms": "string",
    "ms_name": "string",
    "cci": "string",
    "title": "string",
    "fund": "string",
    "category_of_region": "string",
    "year": "number",
    "net_planned_eu_amount": "number",
    "cumulative_initial_pre_financing": "number",
    "cumulative_additional_initial_pre_financing": "number",
    "recovery_of_initial_pre_financing": "number",
    "cumulative_annual_pre_financing": "number",
    "pre_financing_covered_by_expenditure": "number",
    "recovery_of_annual_pre_financing": "number",
    "net_pre_financing": "number",
    "cumulative_interim_payments": "number",
    "recovery_of_expenses": "number",
    "net_interim_payments": "number",
    "total_net_payments": "number",
    "eu_payment_rate": "number",
    "eu_payment_rate_on_planned_eu_amount": "number"
};

function LoadBackendv2JPR(app, db){
    //POST petition
    app.post(API_BASE + "/", (req, res) => {
        let cci_atempt = req.body.cci;
        let attempt = req.body;
        let structureKeys = Object.keys(structure);
        let actualKeys = Object.keys(attempt);
        let valid = structureKeys.every(key => actualKeys.includes(key) && typeof attempt[key] === structure[key]);
        if (!valid || actualKeys.length !== structureKeys.length) {
            //Can´t post an object without the expected fields
            res.sendStatus(400, "BAD REQUEST");
        } else {
            db.find({ cci: cci_atempt }, (err, uploaded) => {
                if (err) {
                    res.sendStatus(500, "Internal Error");
                } else {
                    if (uploaded.length > 0) {
                        //The object is already in the array
                        res.sendStatus(409, "Conflict");
                    } else {
                        db.insert(attempt);
                        res.sendStatus(201, "Created");
                    }
                }
            });
        }
    });
    //POSTMAN documentation
    app.get(API_BASE + "/docs", (req, res) => {
        console.log("Redirection to Postman documentation");
        res.redirect("https://documenter.getpostman.com/view/32953613/2sA35HVzrt");
    });
    app.post(API_BASE + "/:country", (req, res) => {
        //Can´t post in a resource
        res.sendStatus(405, "Method Not Allowed");
    });
    //GET petition
    app.get(API_BASE + "/", (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let offset = parseInt(req.query.offset) || 0;
        let par = req.query;
        let query = {};

        Object.keys(par).forEach(key => {
            if (key !== 'limit' && key !== 'offset') {
                let value = req.query[key];
                // Verifies if the value is a number
                if (!isNaN(value)) {
                    // Verifies if the number is an integer or a float
                    if (Number.isInteger(parseFloat(value))) {
                        // If it is an integer, convert it to an integer
                        value = parseInt(value);
                    } else {
                        // If it is a float, convert it to a float
                        value = parseFloat(value);
                    }
                }
                // Add the key-value pair to the query object
                query[key] = value;
            }
        });

        db.find(query).skip(offset).limit(limit).exec((err, data) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (data.length > 0) {
                    if (data.length === 1) {
                        let c = data[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        let w = data.map((c) => {
                            delete c._id;
                            return c;})
                        res.send(w);
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
    //El recurso debe contener una ruta /api/v1/FFFFF/loadInitialData que al hacer un GET
    //cree 10 o más datos en el array de NodeJS si está vacío.
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        db.count({}, (err, n) => {
            if (err) {
                res.sendStatus(500, "Internal error");
            } else {
                if (n === 0) {
                    db.insert(initial_data, (err, data) => {
                        if (err) {
                            res.sendStatus(500, "Internal error");
                        } else {
                            res.sendStatus(201, "Created");
                        }
                    });
                } else {
                    res.sendStatus(405, "Method not allowed");
                }
            }
        });
    });
    app.get(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;

        db.find({ ms_name: country }, (err, data) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (data.length > 0) {
                    if (data.length === 1) {
                        let c = data[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        let w = data.map((c) => {
                            delete c._id;
                            return c;})
                        res.send(w);
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
    app.get(API_BASE + "/:country/:cci", (req, res) => {
        let country = req.params.country;
        let expected =req.params.cci;

        db.find({ ms_name: country, cci: expected }, (err, data) => {
            if (err) {
                res.sendStatus(500, "Internal Server Error");
            } else {
                if (data.length > 0) {
                    if (data.length === 1) {
                        let c = data[0];
                        delete c._id;
                        res.send(c);
                    } else {
                        let w = data.map((c) => {
                            delete c._id;
                            return c;})
                        res.send(w);
                    }
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });

    //PUT petition
    app.put(API_BASE + "/", (req, res) => {
        //Can´t put in the base api
        let data = req.body;
        res.sendStatus(405, "Method not allowed");
    });
    app.put(API_BASE + "/:country", (req, res) => {
        let attempt = req.body;
        let structureKeys = Object.keys(structure);
        let actualKeys = Object.keys(attempt);
        let valid = structureKeys.every(key => actualKeys.includes(key) && typeof attempt[key] === structure[key]);
        let country = req.params.country;

        if (!valid || actualKeys.length !== structureKeys.length) {
            // Cannot update an object without the expected fields
            res.sendStatus(400);
        } else {
            // Check if the country exists in the array before updating
            db.findOne({ ms_name: country }, (err, uploaded) => {
                if (err) {
                    res.sendStatus(500).send("Internal Server Error");
                } else {
                    if (!uploaded) {
                        // Country does not exist in the array
                        res.sendStatus(404, "Not Found");
                    } else {
                        // Country exists in the array, proceed with the update
                        db.update({ ms_name: country }, attempt, {}, (err) => {
                            if (err) {
                                res.sendStatus(500, "Internal Server Error");
                            } else {
                                res.sendStatus(200, "OK");
                            }
                        });
                    }
                }
            });
        }
    });
    app.put(API_BASE + "/:country/:cci", (req, res) => {
        let attempt = req.body;
        let structureKeys = Object.keys(structure);
        let actualKeys = Object.keys(attempt);
        let valid = structureKeys.every(key => actualKeys.includes(key) && typeof attempt[key] === structure[key]);
        let country = req.params.country;
        let expected = req.params.cci;

        if (!valid || actualKeys.length !== structureKeys.length) {
            // Cannot update an object without the expected fields
            res.sendStatus(400).send("BAD REQUEST");
        } else {
            // Check if the country exists in the array before updating
            db.findOne({ ms_name: country, cci: expected }, (err, uploaded) => {
                if (err) {
                    res.sendStatus(500).send("Internal Server Error");
                } else {
                    if (!uploaded) {
                        // Country does not exist in the array
                        res.sendStatus(404, "Not Found");
                    } else {
                        // Country exists in the array, proceed with the update
                        db.update({ ms_name: country, cci: expected }, attempt, {}, (err) => {
                            if (err) {
                                res.sendStatus(500, "Internal Server Error");
                            } else {
                                res.sendStatus(200, "OK");
                            }
                        });
                    }
                }
            });
        }
    });

    //DELETE petition
    app.delete(API_BASE + "/", (req, res) => {
        db.remove({}, { multi: true }, (err, n) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (n >= 1) {
                    res.sendStatus(200, "OK");
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        });
    });
    app.delete(API_BASE + "/:country", (req, res) => {
        let country = req.params.country;

        db.remove({ ms_name: country }, {}, (err, n) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (n >= 1) {
                    res.sendStatus(200, "Ok");
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        });
    });
    app.delete(API_BASE + "/:country/:cci", (req, res) => {
        let country = req.params.country;
        let expected = req.params.cci;

        db.remove({ ms_name: country, cci: expected }, {}, (err, n) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (n >= 1) {
                    res.sendStatus(200, "Ok");
                } else {
                    res.sendStatus(404, "Not found");
                }
            }
        });
    });
}
export {LoadBackendv2JPR}