<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIRSG = `/api/v2/covid-testings`;
	let APIproxyRSG = `/proxyRSG;`;

	if (dev) {
		APIRSG = 'http://localhost:10000' + APIRSG;
		APIproxyRSG = 'http://localhost:10000' + APIproxyRSG;
	}

	let holidays = [];
	let covidStats = [];

	onMount(async () => {
		holidays = await getHolidaysData('CA', 2021);
		covidStats = await getCovidStatsData('CA', "2021-W12"); // Asegúrate de pasar el código de país y el año
		createCombinedChart();
	});

	async function getHolidaysData(country, year) {
		const url = `https://api.api-ninjas.com/v1/holidays?country=${country}&year=${year}`;
		try {
			const response = await fetch(url, {
				headers: {
					'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
				}
			});
			return await response.json();
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async function getCovidStatsData(countryCode, year) {
		const url = `${APIRSG}?country_code=${countryCode}&year_week=${year}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			// Sumamos los nuevos casos de COVID-19
			const totalCases = data.reduce((total, item) => {
				const yearFromWeek = parseInt(item.year_week.split('-')[0]);
				if (yearFromWeek === year) {
					return total + item.new_cases;
				} else {
					return total;
				}
			}, 0);

			return totalCases;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	function createCombinedChart() {
		const holidaysByYear = groupByYear(holidays);
		const covidStatsByYear = groupByYear(covidStats);

		const years = Object.keys(holidaysByYear);
		const holidaysCount = years.map((year) => holidaysByYear[year].length);
		const covidCases = years.map((year) => {
			const stats = covidStatsByYear[year];
			if (stats) {
				return stats.reduce((total, stat) => total + stat.new_cases, 0);
			} else {
				return 0;
			}
		});

		const ctx = document.getElementById('combinedChart').getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: years.map(String),
				datasets: [
					{
						label: 'Vacaciones',
						data: holidaysCount,
						backgroundColor: 'rgba(255, 99, 132, 0.5)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 1
					},
					{
						label: 'Casos de COVID-19',
						data: covidCases,
						backgroundColor: 'rgba(54, 162, 235, 0.5)',
						borderColor: 'rgba(54, 162, 235, 1)',
						borderWidth: 1,
						yAxisID: 'newCasesAxis'
					}
				]
			},
			options: {
				scales: {
					y: {
						type: 'linear',
						position: 'left',
						title: {
							display: true,
							text: 'Vacaciones'
						},
						beginAtZero: true
					},
					newCasesAxis: {
						type: 'linear',
						position: 'right',
						title: {
							display: true,
							text: 'Casos de COVID-19'
						},
						beginAtZero: true
					}
				}
			}
		});
	}

	function groupByYear(data) {
		const groupedData = {};
		data.forEach((item) => {
			const year = new Date(item.date).getFullYear();
			if (!groupedData[year]) {
				groupedData[year] = [];
			}
			groupedData[year].push(item);
		});
		return groupedData;
	}
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div class="container-fluid">
	<canvas id="combinedChart"></canvas>
</div>
