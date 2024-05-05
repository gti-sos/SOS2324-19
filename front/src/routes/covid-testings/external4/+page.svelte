<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let isLoading = true; // Variable para controlar el estado de carga
	let interestRateData = [];

	let countries = ['Sweden', 'Norway', 'Poland', 'Mexico', 'Denmark'];
	let covidAPI = '/api/v2/covid-testings';
	let interestRateAPI = 'https://api.api-ninjas.com/v1/interestrate?country=';

	if (dev) {
		covidAPI = 'http://localhost:10000' + covidAPI;
	}

	onMount(async () => {
		try {
			await fetchData();
			isLoading = false; // Una vez que los datos se carguen, establecemos isLoading a false
			drawChart();
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	});

	async function fetchData() {
		for (let country of countries) {
			console.log(`Fetching data for ${country}`);
			const covidResponse = await getData(`${covidAPI}?country=${country}`);
			const interestRateResponse = await getData(interestRateAPI + country);

			console.log('COVID response:', covidResponse);
			console.log('Interest rate response:', interestRateResponse);

			// Procesamiento de datos de COVID
			const totalNewCases =
				covidResponse.length > 0 ? covidResponse.reduce((acc, cur) => acc + cur.new_cases, 0) : 0;

			// Procesamiento de datos de tasas de interés
			const interestRateCountryData = interestRateResponse.central_bank_rates[0]; // Solo toma el primer resultado
			const ratePct = interestRateCountryData ? interestRateCountryData.rate_pct : 0;

			// Calcular el cociente entre el total de nuevos casos de COVID y la tasa de interés
			const ratio = ratePct !== 0 ? (ratePct / totalNewCases) * 1000000 : 0;

			interestRateData.push({
				country: country,
				ratio: ratio
			});
		}
	}

	async function getData(url) {
		try {
			const res = await fetch(url, {
				headers: {
					'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
				}
			});
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data from ${url}: ${error}`);
			return [];
		}
	}

	function drawChart() {
		const options = {
			series: interestRateData.map((item) => item.ratio),
			labels: interestRateData.map((item) => item.country),
			chart: {
				type: 'donut',
				height: 350
			},
			dataLabels: {
				enabled: true
			},
			plotOptions: {
				pie: {
					startAngle: -90,
					endAngle: 90,
					donut: {
						size: '80%'
					}
				}
			},
			grid: {
				padding: {
					bottom: 20
				}
			},
			legend: {
				position: 'bottom'
			},
			title: {
				text: 'Ratio of Total New COVID-19 Cases to Interest Rate by Country'
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						chart: {
							width: 200
						},
						legend: {
							position: 'bottom'
						}
					}
				}
			]
		};

		const chart = new ApexCharts(document.querySelector('#chart'), options);
		chart.render();
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>


{#if isLoading}
    <div>Loading data...</div>
{/if}

<div id="chart"></div>