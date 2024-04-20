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
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }
    function createGraph(data) {
    const greeceData = data.filter(item => item.ms_name === "Greece");
    const bulgariaData = data.filter(item => item.ms === "BG");
    const nederlandData = data.filter(item => item.ms === "NL");

    
    

Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    
    title: {
        text: 'Init adoption plan'
    },
    
    xAxis: {
        allowDecimals: false,
        accessibility: {
            rangeDescription: 'Range: 2020 to 2023.'
        }
    },
    yAxis: {
        title: {
            text: 'Total monetary amount'
        }
    },
    tooltip: {
        pointFormat: '{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
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





</script>
<div id="container"></div>
<br>
<div id="container-bar"></div>