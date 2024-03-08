let data = [
    { country: 'Austria', country_code: 'AT', year_week: '2020-W41', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 7487, tests_done: 124663, population: 8978929, testing_rate: 1388.394985638042, positivity_rate: 6.005791614191861, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W42', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 9898, tests_done: 129647, population: 8978929, testing_rate: 1443.9027193555044, positivity_rate: 7.634576966686464, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W43', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 18262, tests_done: 158997, population: 8978929, testing_rate: 1770.7791207615073, positivity_rate: 11.485751303483713, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W44', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 31613, tests_done: 167926, population: 8978929, testing_rate: 1870.223052214802, positivity_rate: 18.825554113121257, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W45', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 44772, tests_done: 199567, population: 8978929, testing_rate: 2222.6147461462274, positivity_rate: 22.434570845881332, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W46', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 47837, tests_done: 215044, population: 8978929, testing_rate: 2394.9849698109874, positivity_rate: 22.245214932757946, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W47', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 40699, tests_done: 207745, population: 8978929, testing_rate: 2313.6946511103943, positivity_rate: 19.590844544995065, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W48', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 31142, tests_done: 196461, population: 8978929, testing_rate: 2188.022647244454, positivity_rate: 15.851492153658995, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W49', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 23070, tests_done: 163770, population: 8978929, testing_rate: 1823.9369082882824, positivity_rate: 14.086829089576845, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W50', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 18693, tests_done: 162984, population: 8978929, testing_rate: 1815.1830802983295, positivity_rate: 11.469223972905317, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W51', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 14841, tests_done: 185766, population: 8978929, testing_rate: 2068.91044577811, positivity_rate: 7.98908303995349, testing_data_source: 'TESSy COVID-19' },
    { country: 'Austria', country_code: 'AT', year_week: '2020-W52', level: 'national', region: 'AT', region_name: 'Austria', new_cases: 13415, tests_done: 163961, population: 8978929, testing_rate: 1826.0641107642125, positivity_rate: 8.181823726373954, testing_data_source: 'TESSy COVID-19' }
];


//Funcion que calcula la media de new_cases cuyo country sea 'Austria'
function mediaNewCases(data, searchString){
    let suma = data.filter((n)=>n.country.match(searchString))
    .map((n)=>n.new_cases).reduce((a, b) => a + b);

    let res = data.filter((n) => n.country === searchString).length;

    let media = suma/res;

    return (`La media de new_cases de ${searchString} es: ${media.toFixed(2)}`)
}

mediaNewCases(data, 'Austria')

module.exports.data_rsg = data;
module.exports.mediaNewCases = mediaNewCases;