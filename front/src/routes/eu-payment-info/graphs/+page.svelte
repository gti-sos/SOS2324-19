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
    const spainData = data.filter(item => item.ms === "ES");

    
    
    Highcharts.chart('container', {
   
    chart: {
        type: 'column'
    },
    title: {
        text: 'Init adoption plan'
    },
    
    xAxis: {
        categories:[2020,2021,2022,2023],
        crosshair: true,
        accessibility: {
                    description: 'Countries'
                }
    },
    yAxis: {
        allowDecimals: false,
        title: {
            text: 'Total monetary amount'
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
                    },
                    {name: 'Spain',
                    data: spainData.map(item => parseFloat(item.init_plan_eu_amt_1_adoption))
                    }
            ]
});



}





</script>
<div id="container"></div>
<br>
<div id="container-bar"></div>