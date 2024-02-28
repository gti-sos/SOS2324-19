let datos =
    [{
        ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR008', title: 'Thessalia – ERDF/ESF+', fund: 'ESF+',
        category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 121971450,
        transfers: 0, actual_plan_eu_amt_latest_adop: 121971450, pre_fin: 3049286.25, recovery_of_pre_financing: 0,
        net_pre_financing: 3049286.25, interim_payments: 3056694.49, recovery_of_expenses: 0, net_interim_payments: 3056694.49,
        total_net_payments: 6105980.74, eu_payment_rate_init_plan_eu_amt: 0.0500607374922574, eu_payment_rate_actual_plan_eu_amt: 0.0500607374922574
    },

    {
        ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR018', title: 'Notio Aigaio – ERDF/ESF+', fund: 'ESF+',
        category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 36901682,
        transfers: 0, actual_plan_eu_amt_latest_adop: 36901682, pre_fin: 922542.05, recovery_of_pre_financing: 0,
        net_pre_financing: 922542.05, interim_payments: 2331102.22, recovery_of_expenses: 0, net_interim_payments: 2331102.22,
        total_net_payments: 3253644.27, eu_payment_rate_init_plan_eu_amt: 0.0881706224122792, eu_payment_rate_actual_plan_eu_amt: 0.0881706224122792
    },

    {
        ms: 'EL', ms_name: 'Greece', cci: '2021EL16FFPR014', title: 'Ionia Nisia – ERDF/ESF+', fund: 'ESF+',
        category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 63331330,
        transfers: 0, actual_plan_eu_amt_latest_adop: 63331330, pre_fin: 1583283.25, recovery_of_pre_financing: 0,
        net_pre_financing: 1583283.25, interim_payments: 1868313.45, recovery_of_expenses: 0, net_interim_payments: 1868313.45,
        total_net_payments: 3451596.7, eu_payment_rate_init_plan_eu_amt: 0.0545006192037969, eu_payment_rate_actual_plan_eu_amt: 0.0545006192037969
    },

    {
        ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65BVPR001', title: 'Cyprus - BMVI', fund: 'BMVI',
        category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 49884805,
        transfers: 595528, actual_plan_eu_amt_latest_adop: 50480333, pre_fin: 5986176.6, recovery_of_pre_financing: 0,
        net_pre_financing: 5986176.6, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 5986176.6,
        eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.118584332635048
    },

    {
        ms: 'CY', ms_name: 'Cyprus', cci: '2021CY65ISPR001', title: 'Cyprus - ISF', fund: 'ISF',
        category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 24982738,
        transfers:611.646, actual_plan_eu_amt_latest_adop: 25594384.12, pre_fin: 2997928.56, recovery_of_pre_financing: 0,
        net_pre_financing: 2997928.56, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 2997928.56,
        eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.117132279719806
    },

    {
        ms: 'ES', ms_name: 'Spain', cci: '2021ES65AMPR001', title: 'Spain - AMIF', fund: 'AMIF',
        category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 514341793,
        transfers: 16960000, actual_plan_eu_amt_latest_adop: 531301793, pre_fin: 61721015.16, recovery_of_pre_financing: 0,
        net_pre_financing: 61721015.16, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 61721015.16,
        eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.116169408748824
    },

    {
        ms: 'FR', ms_name: 'France', cci: '2021FR65AMPR001', title: 'France - AMIF', fund: 'AMIF',
        category_of_region: 'VOID', year: 2023, init_plan_eu_amt_1_adoption: 910485391,
        transfers: 15900000, actual_plan_eu_amt_latest_adop: 926385391, pre_fin: 109258246.92, recovery_of_pre_financing: 0,
        net_pre_financing: 109258246.92, interim_payments: 0, recovery_of_expenses: 0, net_interim_payments: 0, total_net_payments: 109258246.92,
        eu_payment_rate_init_plan_eu_amt: 0.12, eu_payment_rate_actual_plan_eu_amt: 0.117940382028326
    },

    {
        ms: 'FR', ms_name: 'France', cci: '2021FR16FFPR017', title: 'Bourgogne-Franche-Comté - ERDF - ESF + ', fund: 'ERDF',
        category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 401454687,
        transfers: 0, actual_plan_eu_amt_latest_adop: 401454687, pre_fin: 10036367.2, recovery_of_pre_financing: 0,
        net_pre_financing: 10036367.2, interim_payments: 7915467.06, recovery_of_expenses: 0, net_interim_payments: 7915467.06, total_net_payments: 17951834.26,
        eu_payment_rate_init_plan_eu_amt: 0.0447169626892412, eu_payment_rate_actual_plan_eu_amt: 0.0447169626892412
    },

    {
        ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR003', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
        category_of_region: 'Less developed', year: 2023, init_plan_eu_amt_1_adoption: 157875000,
        transfers: 0, actual_plan_eu_amt_latest_adop: 157875000, pre_fin: 3946875, recovery_of_pre_financing: 0,
        net_pre_financing: 3946875, interim_payments: 10299266.83, recovery_of_expenses: 0, net_interim_payments: 10299266.83, total_net_payments: 14246141.83,
        eu_payment_rate_init_plan_eu_amt: 0.0902368445288995, eu_payment_rate_actual_plan_eu_amt: 0.0902368445288995
    },

    {
        ms: 'BG', ms_name: 'Bulgaria', cci: '2021BG05SFPR003', title: 'Food and Basic Material Support - BG - ESF + ', fund: 'ESF + ',
        category_of_region: 'Transition', year: 2023, init_plan_eu_amt_1_adoption: 31575000,
        transfers: 0, actual_plan_eu_amt_latest_adop: 31575000, pre_fin: 789375, recovery_of_pre_financing: 0,
        net_pre_financing: 789375, interim_payments: 1896252.83, recovery_of_expenses: 0, net_interim_payments: 1896252.83, total_net_payments: 2685627.83,
        eu_payment_rate_init_plan_eu_amt: 0.0850555132224861, eu_payment_rate_actual_plan_eu_amt: 0.0850555132224861
    }]


//Media total_net_payments de Grecia
function mediaTotalNetPayments(datos,pais){
    let sol=datos.filter((n)=> n.ms_name===pais).map((n)=>n.total_net_payments)
    .reduce((a,b)=>a+b);

    let n=datos.filter((n)=> n.ms_name===pais).length;

    media=sol/n

    return (`La media de total_net_payments de ${pais} es de: ${media}`)
}

module.exports.data_pht=datos;
module.exports.mediaTotalNetPayments=mediaTotalNetPayments;
