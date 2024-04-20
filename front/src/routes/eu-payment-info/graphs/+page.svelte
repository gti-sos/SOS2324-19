<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    

    onMount(() => {
        getData();
    });

    let API = "https://sos2324-19.appspot.com/api/v2/eu-payment-info";
    let dataAvailable = false;

    async function getData() {
        try {
            const res = await fetch(API);
            const data = await res.json();
            console.log(`Data received: ${JSON.stringify(data, null, 2)}`);

            if (data.length > 0) {
                dataAvailable = true;
                createGraph(data);
                createGraph2(data);
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }
    function createGraph(data) {
    const greeceData = data.filter(item => item.ms_name === "Greece");
    const bulgariaData = data.filter(item => item.ms === "BG");
    const nederlandData = data.filter(item => item.ms === "NL");

    
    

Highcharts.chart('container-bar', {
    chart: {
        type: 'area'
    },
    
    title: {
        text: 'Init adoption plan'
    },
    
    xAxis: {
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 2020 to 2022.'
        }
    },
    yAxis: {
        title: {
            text: 'Total monetary amount'
        }
    },
    tooltip: {
        pointFormat: '{series.name} had an initial adaption amount of <b>{point.y:,.0f}</b><br/>M in {point.x}'
    },
    plotOptions: {
        area: {
            pointStart: 2020,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    },
    series: [
                {
                    name: 'Greece',
                    data: greeceData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    },
                    {
                    name: 'Bulgaria',
                    data: bulgariaData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    },{
                        name:'Netherlands',
                        data:nederlandData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    }

            ]
});

}


function createGraph2(datos){
    // Organizar los datos por país y año
var countriesData = {};

// Iterar sobre los datos y organizarlos por país y año
datos.forEach(function(item) {
    if (!countriesData[item.ms_name]) {
        countriesData[item.ms_name] = {};
    }
    if (!countriesData[item.ms_name][item.year]) {
        countriesData[item.ms_name][item.year] = 0;
    }
    countriesData[item.ms_name][item.year] += parseFloat(item.total_net_payments);
});

// Crear la serie para Highcharts
var seriesData = [];

// Iterar sobre los datos organizados y crear la serie para Highcharts
for (var country in countriesData) {
    var countryData = countriesData[country];
    var countrySeries = {
        name: country,
        data: []
    };
    for (var year in countryData) {
        countrySeries.data.push(countryData[year]);
    }
    seriesData.push(countrySeries);
}

// Construir el gráfico de líneas utilizando Highcharts
Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Financiamiento Europeo por País y Año'
    },
    xAxis: {
        categories: Object.keys(countriesData['Greece']) // Tomar las categorías de cualquier país, ya que todos deben tener los mismos años
    },
    yAxis: {
        title: {
            text: 'Monto de Financiamiento Europeo'
        }
    },
    series: seriesData
});

    }






</script>
<div id="container"></div>
<br>
<div id="container-bar"></div>