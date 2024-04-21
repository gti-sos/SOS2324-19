<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let dataAvailable = false;

	// Define las URLs de las tres APIs
	let API_AFI = '/api/v2/policy-program-stats';
	let API_PHT = '/api/v2/eu-payment-info';
	let API_RSG = '/api/v2/covid-testings';
	let API_JPR = '/api/v2/esif-payments';
	if (dev) {
		API_AFI = 'http://localhost:10000' + API_AFI
		API_PHT = 'http://localhost:10000' + API_PHT
		API_RSG = 'http://localhost:10000' + API_RSG
		API_JPR = 'http://localhost:10000' + API_JPR
	}

	let countryData,
		data1,
		data2,
		data3,
		data4 = [];

	// Función para obtener datos
	async function fetchData(url) {
		try {
			const res = await fetch(url);
			const dat = await res.json();
			return dat;
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}
	async function getInitialtot() {
		if (!data1.length > 0) {
			await getInitial(API_AFI);
		}
		if (!data2.length > 0) {
			await getInitial(API_PHT);
		}
		if (!data3.length > 0) {
			await getInitial(API_RSG);
		}
		if (!data4.length > 0) {
			await getInitial(API_JPR);
		}
		location.reload();
	}

	async function getInitial(rt) {
		try {
			let response = await fetch(rt + '/loadInitialData', { method: 'GET' });
			let status = await response.status;
			console.log(`Status code: ${status}`);
			if (status === 200) {
				const data = await fetchData(rt);
				console.log(data);
			}
		} catch (error) {
			console.log(`Error loading initial data: ${error}`);
		}
	}

	// Función para procesar los datos de las tres fuentes de datos
	async function processCountryData() {
		const dat1 = await fetchData(API_AFI);
		data1 = dat1;
		console.log(data1);
		const dat2 = await fetchData(API_PHT);
		data2 = dat2;
		console.log(data2);
		const dat3 = await fetchData(API_RSG);
		data3 = dat3;
		console.log(data3);
		const dat4 = await fetchData(API_JPR);
		data4 = dat4;
		console.log(data4);
		if (data1.length > 0 && data2.length > 0 && data3.length > 0 && data4.length > 0) {
			dataAvailable = true;
		}

		// Combinar los datos de las tres fuentes
		const combinedData = {};

		// Procesar datos de la primera fuente
		data1.forEach((entry) => {
			const country = entry.country;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					esif_amount_committed_to_fi: 0,
					init_plan_eu_amt_1_adoption: 0,
					total_net_payments: 0,
					population: 0
				};
			}
			combinedData[country].esif_amount_committed_to_fi += entry.esif_amount_committed_to_fi || 0;
		});

		// Procesar datos de la segunda fuente
		data2.forEach((entry) => {
			const country = entry.ms;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					esif_amount_committed_to_fi: 0,
					init_plan_eu_amt_1_adoption: 0,
					total_net_payments: 0,
					population: 0
				};
			}
			combinedData[country].init_plan_eu_amt_1_adoption += entry.init_plan_eu_amt_1_adoption || 0;
		});

		// Procesar datos de la tercera fuente
		data3.forEach((entry) => {
			const country = entry.country_code;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					esif_amount_committed_to_fi: 0,
					init_plan_eu_amt_1_adoption: 0,
					total_net_payments: 0,
					population: 0
				};
			}
			combinedData[country].population += entry.population || 0;
		});

		data4.forEach((entry) => {
			const country = entry.ms;
			if (!combinedData[country]) {
				combinedData[country] = {
					name: country,
					esif_amount_committed_to_fi: 0,
					init_plan_eu_amt_1_adoption: 0,
					total_net_payments: 0,
					population: 0
				};
			}
			combinedData[country].total_net_payments += entry.total_net_payments || 0;
		});

		countryData = Object.values(combinedData);

		createChart();
	}
	// Función para crear el gráfico
	function createChart() {
		Highcharts.chart('chart-container', {
			chart: {
				type: 'column'
			},
			title: {
				text: 'Datos de los países'
			},
			xAxis: {
				title: {
					text: 'País'
				},
				categories: countryData.map((country) => country.name)
			},
			yAxis: [
				{
					title: {
						text: 'Cantidad total promedio comprometido al fondo'
					}
				},
				{
					title: {
						text: 'total_net_payments'
					},
					opposite: true
				},
				{
					title: {
						text: 'init_plan_eu_amt_1_adoption'
					},
					opposite: true
				},
				{
					title: {
						text: 'population'
					},
					opposite: true
				}
			],
			series: [
				{
					name: 'Cantidad total promedio comprometido al fondo',
					data: countryData.map((country) => country.esif_amount_committed_to_fi)
				},
				{
					name: 'total_net_payments',
					data: countryData.map((country) => country.total_net_payments),
					yAxis: 1
				},
				{
					name: 'init_plan_eu_amt_1_adoption',
					data: countryData.map((country) => country.init_plan_eu_amt_1_adoption),
					yAxis: 2
				},
				{
					name: 'population',
					data: countryData.map((country) => country.population),
					yAxis: 3
				}
			]
		});
	}

	onMount(async () => {
		try {
			await processCountryData();
		} catch (error) {
			console.error('Error al obtener datos o crear el gráfico:', error);
		}
	});
</script>

<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

{#if dataAvailable == false}
	<div style="justify-content: center; text-align: center; margin-top: 20px">
		<button
			class="cargarDatos"
			style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
			on:click={() => getInitialtot()}
		>
			Cargar Los Datos
		</button>
	</div>
	<p class="container">No hay datos disponibles</p>
{/if}
<div id="chart-container"></div>
<br />

<style>
	#chart-container {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
	}
</style>
