<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import {onDestroy, onMount} from "svelte";

    onMount(() => {
        getData();
    })

    let API="https://sos2324-19.appspot.com/api/v2/policy-program-stats";
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
        const atData = data.filter(item => item.country === "AT");
        const beData = data.filter(item => item.country === "BE");
        Highcharts.chart('container-bar', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Cantidad monetaria pagada por cada pais en cada año ',
        align: 'center'
    },
    xAxis: {
        categories:[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Cantidad total monetaria pagada al fondo'
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y} €'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'AT',
            data: atData.map(item => parseFloat(item.total_amount_paid_to_fi))
            },
            {
            name: 'BE',
            data: beData.map(item => parseFloat(item.total_amount_paid_to_fi))
            }
    ]
});

        // const gr = Highcharts.chart('container-bar', {
        //     chart: {
        //         type: 'line'
        //     },
        //     title: {
        //         text: 'Cantidad monetaria pagada por cada pais en cada año ',
        //         align: 'center'
        //     },
        //     xAxis: {
        //         categories:[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]
        //     },
        //     yAxis: {
        //         title: {
        //             text: 'Cantidad total monetaria pagada al fondo'
        //         },
        //         stackLabels: { // Habilitar etiquetas de apilamiento para totales
        //         enabled: true
        //     }
        //     },
        //     tooltip: {
        //         headerFormat: '<b>{point.x}</b><br/>',
        //         pointFormat: '{series.name}: {point.y} €'
        //     },
        //     plotOptions: {
        //         line: {
        //             dataLabels: {
        //                 enabled: true
        //             },
        //             enableMouseTracking: false
        //         }
        //     },
        //     series: [{
        //               name: 'AT',
        //         data: atData.map(item => parseFloat(item.total_amount_paid_to_fi))
        //         },
        //         {
        //               name: 'BE',
        //         data: beData.map(item => parseFloat(item.total_amount_paid_to_fi))
        //         }
        //     ]
        // });




    }

</script>

<div id="container-column"></div>
<br>
<div id="container-bar"></div>