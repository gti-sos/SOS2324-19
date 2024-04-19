<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>

<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>


<script>

import {onMount} from "svelte";

    onMount(() => {
        getData();
    })
    let API="https://sos2324-19.appspot.com/api/v2/eu-payment-info";
    let dataAvailable = false;
    

    async function getData(){
        try{
            const res = await fetch(API);
            const data = await res.json();
            console.log(`Data received:${JSON.stringify(data, null, 2)}`);
            
            if (data.length > 0) {
                dataAvailable = true; 
                createGraph(data);
                
            }
        }catch(error){
            console.log(`Error fetching data: ${error}`);
        }
    } 


    function createGraph(data){
        const greeceData = data.filter(item => item.ms === "EL");
        const bulgariaData = data.filter(item => item.ms === "BG");
        const franceiaData = data.filter(item => item.ms === "FR");


        Highcharts.chart('container', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Comparaison between Init adoption plan vs Final adoption plan',
        align: 'center'
    },
    
    xAxis: [{
        categories: [2020,2021,2022,2023],
        crosshair: true,
        accessibility: {
                    description: 'Countries'
                }
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}M',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Init adoption',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Final adoption',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        labels: {
            format: '{value} M',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    
    series: [{
        name: 'Init adoption',
        type: 'column',
        yAxis: 1,
        data: [{
                    name: 'EL',
                    data: greeceData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    },
                    {
                    name: 'BG',
                    data: bulgariaData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    },
                    {
                    name: 'FR',
                    data: franceiaData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    }],
        tooltip: {
            valueSuffix: 'M'
        }

    }, {
        name: 'Final adoption',
        type: 'spline',
        data: [{
                    name: 'EL',
                    data: greeceData.map(item => parseFloat(item.actual_plan_eu_amt_latest_adop))
                    },
                    {
                    name: 'BG',
                    data: bulgariaData.map(item => parseFloat(item.actual_plan_eu_amt_latest_adop))
                    },
                    {
                    name: 'FR',
                    data: franceiaData.map(item => parseFloat(item.actual_plan_eu_amt_latest_adop))
                    }],
        tooltip: {
            valueSuffix: 'M'
        }
    }]
});


    }


</script>

<div id="container"></div>
<br>
<div id="container-bar"></div>