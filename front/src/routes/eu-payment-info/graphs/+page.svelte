<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
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
                createGraph3(data);

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
        text: 'Plan de adopcion inicial'
    },
    
    xAxis: {
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 2020 to 2022.'
        }
    },
    yAxis: {
        title: {
            text: 'Cantidad monetaria'
        }
    },
    tooltip: {
        pointFormat: '{series.name} Tuvo un monto inicial de adaptación de <b>{point.y:,.0f}</b><br/>M in {point.x}'
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




async function createGraph2(data) {
   
    const tiposcountry = [...new Set(data.map(item => item.ms_name))];

    // Create the chart series
    

    Highcharts.chart('container', {
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: 'Financiamiento de la UE por país y año'
        },
        xAxis: [{
            categories: ['2020', '2021', '2022', '2023'],
            crosshair: true
        }],
        yAxis: [{ // Primary yAxis
            labels: {
                format: '{value} €',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            title: {
                text: 'Financiamiento de la EU',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            }
        }],
        tooltip: {
            shared: true
        },
        legend: {
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 60,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)'
        },
        series: tiposcountry.map(country => ({
                    name: country,
                    data: data.filter(item => item.ms_name === country).map(item =>
                        parseFloat(item.total_net_payments)
                    )
                }))
    });
}

let chart;


function createGraph3(data) {
        const ccis = [...new Set(data.map(item => item.cci))];
        const funds = [...new Set(data.map(item => item.fund))];

        const chartData = ccis.map(cci => ({
            type: "bar",
            name: cci,
            showInLegend: true,
            dataPoints: funds.map(fund => ({
                label: fund,
                y: data
                    .filter(item => item.cci === cci && item.fund === fund)
                    .reduce((acc, curr) => acc + parseFloat(curr.net_pre_financing), 0)
            }))
        }));

        chart = new CanvasJS.Chart("container-canvas", {
            animationEnabled: true,
            title: {
                text: "Net Pre Financing por cada CCI y su Fund"
            },
            axisY: {
                title: "Net Pre Financing"
            },
            axisX: {
                title: "Fund"
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            toolTip: {
                shared: true
            },
            data: chartData
        });

        chart.render();
    }

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
</script>

<div id="container"></div>
<br>
<div id="container-bar"></div>


<div id="container-canvas" style="height: 300px; width: 100%;"></div>
