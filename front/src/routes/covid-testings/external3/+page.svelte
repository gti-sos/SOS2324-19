<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIRSG = `/api/v2/covid-testings`;
	let APIRSG1 = `https://api.api-ninjas.com/v1/holidays?country=CA&year=2021`;

	// Si estás en modo desarrollo, cambia las URLs de la API
	if (dev) {
		APIRSG = 'http://localhost:10000' + APIRSG;
	}

	onMount(async () => {
		try {
			await drawChart();
		} catch (error) {
			console.error('Error drawing chart:', error);
		}
	});

	async function getData() {
		const url = APIRSG;
		try {
			const res = await fetch(url);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function getData1() {
		const url = APIRSG1;
		try {
			const response = await fetch(url, {
				headers: {
					'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
				}
			});
			return await response.json();
		} catch (error) {
			console.error('Error fetching data1:', error);
			return null;
		}
	}

	async function drawChart() {
		const covidResponse = await getData();
		const centralBankResponse = await getData1();

		console.log('Covid data:', covidResponse);
		console.log('Events data:', centralBankResponse);

		const covidData = covidResponse
			.filter((data) => data.year_week.startsWith('2021'))
			.map((d) => ({
				year: parseInt(d.year_week.split('-')[0]),
				new_cases: d.new_cases
			}))
			.sort((a, b) => a.year - b.year);

		const eventsData = centralBankResponse.filter((event) => event.date.startsWith('2021'));

		const eventsByYear = eventsData.reduce((acc, event) => {
			const year = new Date(event.date).getFullYear();
			acc[year] = (acc[year] || 0) + 1;
			return acc;
		}, {});

		const years = [
			...new Set([...covidData.map((data) => data.year), ...Object.keys(eventsByYear).map(Number)])
		];
		years.sort((a, b) => a - b);

		const combinedData = years.map((year) => ({
			year: year,
			new_cases: covidData.find((data) => data.year === year)?.new_cases || 0,
			events: eventsByYear[year] || 0
		}));

		const ctx = document.getElementById('myChart').getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: years,
				datasets: [
					{
						label: 'New Cases',
						data: combinedData.map((data) => data.new_cases),
						backgroundColor: 'blue',
						yAxisID: 'left-y-axis'
					},
					{
						label: 'Events',
						data: combinedData.map((data) => data.events),
						backgroundColor: 'red',
						yAxisID: 'right-y-axis'
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: 'COVID Cases and Events in 2021'
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						position: 'right',
						grid: {
							display: false
						},
						title: {
							display: true,
							text: 'Events',
							color: 'red'
						},
						ticks: {
							color: 'red'
						},
						id: 'right-y-axis'
					},
					'left-y-axis': {
						beginAtZero: true,
						position: 'left',
						grid: {
							display: false
						},
						title: {
							display: true,
							text: 'New Cases',
							color: 'blue'
						},
						ticks: {
							color: 'blue'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Year'
						}
					}
				}
			}
		});
	}

	getData();
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div>
    <canvas id="myChart" style="width: 100%; height: 500px;"></canvas>
</div>