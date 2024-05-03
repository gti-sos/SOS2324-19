<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Color, color } from 'highcharts';
	import { PassThrough } from 'stream';

	let APIJPR = `/api/v2/esif-payments`;
	let APIJPRAUX1 = '/proxyJPR';
	let APIPHT=`/api/v2/eu-payment-info`;
	let APIproxyPHT=`/proxyPHT;`
	let APIRSG=`/api/v2/covid-testings`;
	let APIproxyRSG=`/proxyRSG;`
	let APIextRSG = 'https://api.api-ninjas.com/v1/interestrate'
	let datajpr = [];
	let datajpraux1 = [];
	let dataPHT=[];
	let dataproxyPHT=[];
	let dataRSG=[];
	let dataproxyRSG=[];
	let dataextRSG = [];

	// Si estamos en un entorno de desarrollo, apuntamos a la URL local
	if (dev) {
		APIJPR = 'http://localhost:10000' + APIJPR;
		APIJPRAUX1 = 'http://localhost:10000' + APIJPRAUX1;
		APIPHT= 'http://localhost:10000' + APIPHT;
		APIproxyPHT='http://localhost:10000' + APIproxyPHT;
		APIRSG= 'http://localhost:10000' + APIRSG;
		APIproxyRSG='http://localhost:10000' + APIproxyRSG;

	}

	onMount(async () => {
		await getData();
		drawChart();
		PHT();
		RSG1();
		RSG2();
	});

	async function fetchData(url) {
		try {
			const res = await fetch(url);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}
	async function fetchData2(url, options) {
		try {
			const res = await fetch(url, options);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function getData() {
		datajpr = await fetchData(APIJPR);
		datajpraux1 = await fetchData(APIJPRAUX1);
		dataPHT= await fetchData(APIPHT);
		dataproxyPHT= await fetchData(APIproxyPHT);
		dataRSG= await fetchData(APIRSG);
		dataproxyRSG= await fetchData(APIproxyRSG);
		dataextRSG = await fetchData(APIextRSG);


	}

	function drawChart() {
		const msValues1 = datajpr.map((d) => d.ms);
		const msValues2 = datajpraux1.map((d) => d.ms);

		// Encontrar la intersección de las "ms" en ambas API
		const commonMsValues = msValues1.filter((ms) => msValues2.includes(ms));

		// Filtrar los datos para mostrar solo aquellos con "ms" comunes
		const filteredDatajpr = datajpr.filter((d) => commonMsValues.includes(d.ms));
		const filteredDatajpraux1 = datajpraux1.filter((d) => commonMsValues.includes(d.ms));

		const netPlannedEUAmount1 = filteredDatajpr
			.filter((d) => !isNaN(d.net_planned_eu_amount))
			.map((d) => d.net_planned_eu_amount / 1000);

		const netPlannedEUAmount2 = filteredDatajpraux1
			.filter((d) => !isNaN(d.net_planned_eu_amount))
			.map((d) => d.net_planned_eu_amount / 100);

		const margin = { top: 40, right: 30, bottom: 70, left: 90 };
		const width = 800 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#chart-container')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleBand().domain(commonMsValues).range([0, width]).padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max([...netPlannedEUAmount1, ...netPlannedEUAmount2])])
			.range([height, 0]);

		svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x));

		svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

		svg
			.selectAll('.bar1')
			.data(filteredDatajpr)
			.enter()
			.append('rect')
			.attr('class', 'bar1')
			.attr('x', (d) => x(d.ms))
			.attr('y', (d) => y(d.net_planned_eu_amount))
			.attr('width', x.bandwidth() / 2)
			.attr('height', (d) => height - y(d.net_planned_eu_amount))
			.attr('fill', 'steelblue');

		svg
			.selectAll('.bar2')
			.data(filteredDatajpraux1)
			.enter()
			.append('rect')
			.attr('class', 'bar2')
			.attr('x', (d) => x(d.ms) + x.bandwidth() / 2)
			.attr('y', (d) => y(d.net_planned_eu_amount / 100))
			.attr('width', x.bandwidth() / 2)
			.attr('height', (d) => height - y(d.net_planned_eu_amount / 100))
			.attr('fill', 'orange');
	}


//function PHT() {
   /* const tiposyear1 = [...new Set(dataPHT.map(item => parseInt(item.year)))];
    const tiposyear2 = [...new Set(dataproxyPHT.map(item => parseInt(item.time_period)))];
    const res = [...new Set([...tiposyear1, ...tiposyear2])];
    const combinedData = {};
    let countryData = [];
    
    dataPHT.forEach(entry => {
        const country = entry.ms;
        const year = entry.year;
        if (!combinedData[country]) {
            combinedData[country] = {
                name: country,
                year: year,
                init_plan_eu_amt_1_adoption: 0,
                obs_value: 0
            };
        }
        combinedData[country].init_plan_eu_amt_1_adoption += entry.init_plan_eu_amt_1_adoption || 0;
    });

		dataPHT.forEach((entry) => {
			const country = entry.ms;
			const year = entry.year;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					year: year,
					init_plan_eu_amt_1_adoption: 0,
					obs_value: 0
				};
			}
			combinedData[country].init_plan_eu_amt_1_adoption += entry.init_plan_eu_amt_1_adoption || 0;
		});

    countryData = Object.values(combinedData);

    const chartData = {
        labels: res, // Define las etiquetas del eje x (años)
        series: [
            countryData.map(country => country.init_plan_eu_amt_1_adoption), // Datos de una serie
            countryData.map(country => country.obs_value) // Datos de la otra serie
        ]
    };

    const options = {
        // Define tus opciones de visualización aquí
        // Por ejemplo:
        fullWidth: true,
        chartPadding: {
            right: 40
        },
        // Puedes agregar más opciones según tus necesidades
    };

    // Crea el gráfico de líneas usando Chartist
    new Chartist.Line('.ct-chart', chartData, options);*/
//}
function RSG1() {
    const scatterData = dataproxyRSG.map(car => ({
        x: car.year,
        y: car.city_mpg, 
        name: `${car.make} ${car.model}`, 
        marker: {
            symbol: 'circle',
            radius: 5 
        }
    })).concat(dataRSG.map(test => ({
        x: test.year_week,
        y: test.new_cases, 
        name: test.country,
        marker: {
            symbol: 'square', 
            radius: 5 
        }
    })));

    const options = {
        chart: {
            height: 280,
            type: "scatter"
        },
        series: [{
            name: 'Cars City MPG',
            data: scatterData
        }],
        xaxis: {
            type: "category"
        },
        markers: {
            size: 6 
        }
    };

    const chart = new ApexCharts(document.getElementById('rsg1'), options);
    chart.render();
}

function RSG2() {
	const polarAreaData = dataRSG.map(test => ({
        x: test.country,
        y: test.new_cases, 
        name: `${test.country} - New Cases`, 
        marker: {
            symbol: 'circle', 
            radius: 5 
        }
    })).concat(dataextRSG.map(rate => ({
        x: rate.country,
        y: rate.rate_pct, 
        name: `${rate.country} - Interest Rate`, 
        marker: {
            symbol: 'square', 
            radius: 5 
        }
    })));

    const options = {
        chart: {
            height: 280,
            type: "polarArea"
        },
        series: [{
            name: 'Polar Area Data',
            data: polarAreaData
        }],
        xaxis: {
            type: "category"
        },
        markers: {
            size: 6 
        }
    };

    const chart = new ApexCharts(document.getElementById('rsg2'), options);
    chart.render();
}
function PHT() {
		dataproxyPHT.forEach((entry) => {
			const country = entry.geo;
			const year = entry.time_period;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					year: year,
					init_plan_eu_amt_1_adoption: 0,
					obs_value: 0
				};
			}
			combinedData[country].obs_value += entry.obs_value || 0;
		});

		countryData = Object.values(combinedData);

		const chartData = {
			labels: res, // Define las etiquetas del eje x (años)
			series: [
				countryData.map((country) => country.init_plan_eu_amt_1_adoption), // Datos de una serie
				countryData.map((country) => country.obs_value) // Datos de la otra serie
			]
		};

		const options = {
			// Define tus opciones de visualización aquí
			// Por ejemplo:
			fullWidth: true,
			chartPadding: {
				right: 40
			}
			// Puedes agregar más opciones según tus necesidades
		};

		// Crea el gráfico de líneas usando Chartist
		new Chartist.Line('.ct-chart', chartData, options);
	}

	function RSG11() {
		const scatterData = dataproxyRSG
			.map((car) => ({
				x: car.year,
				y: car.city_mpg,
				name: `${car.make} ${car.model}`,
				marker: {
					symbol: 'circle',
					radius: 5
				}
			}))
			.concat(
				dataRSG.map((test) => ({
					x: test.year_week,
					y: test.new_cases,
					name: test.country,
					marker: {
						symbol: 'square',
						radius: 5
					}
				}))
			);

		const options = {
			chart: {
				height: 280,
				type: 'scatter'
			},
			series: [
				{
					name: 'Cars City MPG',
					data: scatterData
				}
			],
			xaxis: {
				type: 'category'
			},
			markers: {
				size: 6
			}
		};
		const chart = new ApexCharts(document.getElementById('rsg1'), options);
		chart.render();
	}

	function RSG22() {
		const polarAreaData = dataRSG
			.map((test) => ({
				x: test.country,
				y: test.new_cases,
				name: `${test.country} - New Cases`,
				marker: {
					symbol: 'circle',
					radius: 5
				}
			}))
			.concat(
				dataextRSG.map((rate) => ({
					x: rate.country,
					y: rate.rate_pct,
					name: `${rate.country} - Interest Rate`,
					marker: {
						symbol: 'square',
						radius: 5
					}
				}))
			);

		const options = {
			chart: {
				height: 280,
				type: 'polarArea'
			},
			series: [
				{
					name: 'Polar Area Data',
					data: polarAreaData
				}
			],
			xaxis: {
				type: 'category'
			},
			markers: {
				size: 6
			}
		};

		const chart = new ApexCharts(document.getElementById('rsg2'), options);
		chart.render();
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist"></script>
</svelte:head>

<div class="container-fluid">
	<h2>Presupuesto neto planteado por País comparada API ITR con la API JPR</h2>
	<div id="chart-container"></div>
	<h2>
		Cantidad monetaria pagada al fondo por pais y kilometros recorridos por millones de pasajeros
		clasificados por año
	</h2>
	<h2>API cars-by-motor Y API policy-program-stats</h2>
	<div id="afi1"></div>
	<h2>
		Cantidad monetaria pagada a un fondo y la cantidad total acumulada pagada a un fondo clasificado
		por paises
	</h2>
	<h2>API structural-investment-data Y API policy-program-stats</h2>
	<div id="char">
		<canvas id="afi2" width="400" height="100"></canvas>
	</div>
	<div class="ct-chart ct-golden-section" id="chart1">
		<style>
			.nm {
				width: 100%;
				height: 300px;
			}
		</style>
	</div>
	<!-- <h2>Api ni idea</h2>
	<div id="rsg1"></div>
	<div id="rsg2"></div>
	<h2>Api ni idea</h2>
	<div id="ct-chart">
		<style>
			.ct-chart {
				width: 100%;
				height: 300px;
			}
		  </style>
	</div> -->
</div>

