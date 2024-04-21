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
    import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API="https://sos2324-19.appspot.com/api/v2/policy-program-stats";
	let errorMsg = '';
	let exitMsg = '';
	let datos1,
		datos2,
		datos3,
		datos4 = {};

    onMount(async () => {
		await loadAllData();
		datos1 = await getDataAFI();
		let datos = unificarBD(datos1, datos2, datos3, datos4);
		console.log('DATOS COMUNES: ' + JSON.stringify(datos));
		datos = getEstadisticas(datos);
		getChart(datos);
	});
    async function loadInitialAFI() {
        try {
            let response = await fetch(API+ "/loadInitialData", {
                method: "GET",
            });

            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status === 200) {
                await getDataAFI();
            } 

        } catch (error) {
            console.log(`Error loading initail GDP data: ${error}`)
        }
    }    
    
    async function getDataAFI(){
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

    async function loadAllData() {
		try {
			await loadInitialAFI();
		} catch (error) {
			errorMsg = error;
		}
	}

    //Creamos función que unifique datos
	function unificarBD(data1) {
		// Crear conjuntos de países únicos para cada conjunto de datos
		const countrySet1 = new Set(data1.map((item) => item.country));
		// const countrySet2 = new Set(data2.map((item) => item.geo));
		// const countrySet3 = new Set(data3.map((item) => item.geo));
		// const countrySet4 = new Set(data4.map((item) => item.geo));

		// Encontrar la intersección de países comunes a todas las bases de datos
		// const commonSet = new Set(
		// 	[...countrySet1].filter((country) => countrySet2.has(country) && countrySet3.has(country) && countrySet4.has(country))
		// );
        const commonSet = new Set(countrySet1);

		// Filtrar datos para incluir solo países comunes
		const filteredData1 = data1.filter((item) => commonSet.has(item.country));
		// const filteredData2 = data2.filter((item) => commonSet.has(item.geo));
		// const filteredData3 = data3.filter((item) => commonSet.has(item.geo));
		// const filteredData4 = data4.filter((item) => commonSet.has(item.geo));

		// Combinar todos los datos filtrados
		const combinedData = [...filteredData1];

		return combinedData;
	}

    const chartData = {
			categories: sortedData.map((item) => item.country),
			series: [
				{
					name: 'Total monetary amount paid to the fund',
					data: sortedData.map((item) => parseFloat(item.total_amount_paid_to_fi))
				},
				
			]
		};

        function getChart(datos) {
            const tiposcountry = [...new Set(datos.map(item => item.country))];
		Highcharts.chart('container', {
			chart: {
				type: 'bar'
			},
			title: {
                text: 'combinacion',
                align: 'center'
            },
            xAxis: {
                categories: tiposcountry,
                title: {
                    text: null
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
			yAxis: [
                {
                    min: 0,
                    title: {
                        text: 'Total monetary amount paid to the fund',
                        align: 'high'
                    },
                    gridLineWidth: 0
				}
			],
			tooltip: {
				shared: true
			},
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.1
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
			series: [
				{
					name: 'Policy-program',
					data: datos.series[0].data,
					tooltip: {
						valueSuffix: 'euro'
					}
				}
			]
		});
	}
</script>

<div id="container"></div>
<br>