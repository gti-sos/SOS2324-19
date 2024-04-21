<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://code.highcharts.com/modules/treemap.js"></script>
    <script src="https://code.highcharts.com/modules/heatmap.js"></script>
</svelte:head>

<script>
    import {onMount} from "svelte";

    onMount(async() => {
        await loadInitial();
        await getData();
    });

    let API="https://sos2324-19.appspot.com/api/v2/policy-program-stats";
    let dataAvailable = false;
    
    async function loadInitial() {
        try {
            let response = await fetch(API+ "/loadInitialData", {
                method: "GET",
            });

            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status === 200) {
                await getData();
            } 

        } catch (error) {
            console.log(`Error loading initail GDP data: ${error}`)
        }
    }    
    
    async function getData(){
        try{
            const res = await fetch(API);
            const data = await res.json();
            cconsole.log(data);
            
            if (data.length > 0) {
                createGraph(data);
                createg2(data);
            }
        }catch(error){
            console.log(`Error fetching data: ${error}`);
        }
    }   
        function createGraph(data){
                const anos=[...new Set(data.map(item => item.year))];
                const tiposcountry = [...new Set(data.map(item => item.country))];
                Highcharts.chart('container-bar', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monetary amount paid by each country in each year',
                align: 'center'
            },
            xAxis: {
                categories:anos,
                crosshair: true,
                accessibility: {
                    description: 'Countries'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total monetary amount paid to the fund'
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
            series: 
            tiposcountry.map(country => ({
                    name: country,
                    data: data.filter(item => item.country === country).map(item =>
                        parseFloat(item.total_amount_paid_to_fi)
                    )
                }))
            // [
            //     {
            //         name: 'AT',
            //         data: atData.map(item => parseFloat(item.total_amount_paid_to_fi))
            //         },
            //         {
            //         name: 'BE',
            //         data: beData.map(item => parseFloat(item.total_amount_paid_to_fi))
            //         }
            // ]
        });
}

    function createg2(data){
        const tiposPrioridad = [...new Set(data.map(item => item.priority))];

            Highcharts.chart('container', {
                chart: {
                    type: 'packedbubble'
                },
                title: {
                    text: 'Average total amount committed to the fund by Priority',
                    align: 'center'
                },
                tooltip: {
                    useHTML: true,
                    pointFormat: '<b>{point.name}:</b> {point.value}'
                },
                plotOptions: {
                            packedbubble: {
                                minSize: '13%',
                                maxSize: '35%',
                                zMin: 0,
                                zMax: 300,
                                layoutAlgorithm: {
                                    gravitationalConstant: 0.05,
                                    splitSeries: true,
                                    seriesInteraction: false,
                                    dragBetweenSeries: true,
                                    parentNodeLimit: true
                                },
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}',
                                    filter: {
                                        property: 'y',
                                        operator: '>',
                                        value: 0
                                    },
                                    style: {
                                        color: 'black',
                                        textOutline: 'none',
                                        fontWeight: 'normal'
                                    }
                                }
                            }
                        },
                series: tiposPrioridad.map(prioridad => ({
                    name: prioridad,
                    data: data.filter(item => item.priority === prioridad).map(item => ({
                        name: item.country,
                        value: parseFloat(item.total_amount_committed_to_fi)
                    }))
                }))
            });
    }
</script>

<div id="container"></div>
<br>
<div id="container-bar"></div>