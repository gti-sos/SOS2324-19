<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let isLoading = true; // Variable para controlar el estado de carga
	let covidData = [];
	let zipCodeData = [];

	let countries = ['Canada', 'Norway', 'Poland', 'Mexico', 'Denmark'];
	let covidAPI = '/api/v2/covid-testings';
	let zipCodeAPI = 'https://api.api-ninjas.com/v1/zipcode?city=';

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
			isLoading = false; // Si hay un error, también establecemos isLoading a false para evitar que el mensaje de carga permanezca para siempre
		}
	});

	async function fetchData() {
		for (let country of countries) {
			console.log(`Fetching data for ${country}`);
			const covidResponse = await getData(`${covidAPI}?country=${country}`);
			const zipCodeResponse = await getData(zipCodeAPI + country);

			console.log('COVID response:', covidResponse);
			console.log('Zip code response:', zipCodeResponse);

			// Agregar los datos de COVID
			covidData.push(...covidResponse);

			// Obtener solo el primer elemento de la respuesta de Zip Code API
			const firstZipCodeEntry = zipCodeResponse[0];
			if (firstZipCodeEntry) {
				zipCodeData.push(firstZipCodeEntry);
			}
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
		// Preparar datos para el gráfico de pirámide
		let pyramidData = [];
		let zipCodeCasesMap = new Map(); // Mapa para mantener el recuento acumulado de casos por código postal
		for (let entry of covidData) {
			const zipCodeEntry = zipCodeData.find((item) => item.city === entry.country);
			if (zipCodeEntry) {
				const zipCode = zipCodeEntry.zip_code;
				const newCases = entry.new_cases;
				if (zipCodeCasesMap.has(zipCode)) {
					zipCodeCasesMap.set(zipCode, zipCodeCasesMap.get(zipCode) + newCases);
				} else {
					zipCodeCasesMap.set(zipCode, newCases);
				}
			}
		}
		// Convertir el mapa a un array de objetos
		zipCodeCasesMap.forEach((cases, zipCode) => {
			pyramidData.push({
				y: cases,
				indexLabel: zipCode
			});
		});

		// Ordenar los datos por cantidad de casos de mayor a menor
		pyramidData.sort((a, b) => b.y - a.y);

		// Configurar el gráfico de pirámide con CanvasJS
		var chart = new CanvasJS.Chart('chartContainer', {
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: 'New Cases by Zip Code'
			},
			data: [
				{
					type: 'pyramid',
					indexLabelFontSize: 18,
					valueRepresents: 'area',
					showInLegend: true,
					legendText: '{indexLabel} ({y})',
					toolTipContent: '<b>{indexLabel}:</b> {y} new cases',
					dataPoints: pyramidData
				}
			]
		});
		chart.render();
	}
</script>

<svelte:head>
	<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</svelte:head>

{#if isLoading}
	<div>Loading data...</div>
{/if}

<div id="chartContainer" style="height: 370px; width: 100%;"></div>
