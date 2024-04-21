<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let dataAvailable = false;
	let DATAAPI = 'https://sos2324-19.appspot.com/api/v2/covid-testings'; // Suponiendo que esta es la URL correcta del endpoint

	onMount(async () => {
		await getData();
	});

	async function getData() {
		try {
			const res = await fetch(DATAAPI);
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
            const datos2021 = data.filter(item => item.year_week.startsWith('2021'));
            console.log(datos2021);

			if (data.length > 0) {
				dataAvailable = true;
				createGraph(datos2021); // Pasamos los datos filtrados al crear el gráfico
			}
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function createGraph(data) {
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				type: 'column',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					depth: 50,
					viewDistance: 25
				}
			},
			xAxis: {
				categories: data.map(entry => entry.country) // Utilizamos los países como categorías en el eje x
			},
			yAxis: {
				title: {
					text: 'New cases'
				}
			},
			tooltip: {
				headerFormat: '<b>{point.key}</b><br>',
				pointFormat: 'New cases: {point.y}'
			},
			title: {
				text: 'New cases in 2021',
				align: 'left'
			},
			subtitle: {
				text:
					'Source: ' +
					'<a href="https://ofv.no/registreringsstatistikk"' +
					'target="_blank">OFV</a>',
				align: 'left'
			},
			legend: {
				enabled: false
			},
			plotOptions: {
				column: {
					depth: 25
				}
			},
			series: [
				{
					data: data.map(entry => entry.new_cases), // Utilizamos el número de nuevos casos como datos en la serie
					colorByPoint: true
				}
			]
		});

		function showValues() {
			document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
			document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
			document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
		}

		// Activamos los sliders
		document.querySelectorAll('#sliders input').forEach((input) =>
			input.addEventListener('input', (e) => {
				chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
				showValues();
				chart.redraw(false);
			})
		);

		showValues();
	}
</script>

<figure class="highcharts-figure">
	<div id="container"></div>
	<p class="highcharts-description"></p>
	<div id="sliders">
		<table>
			<tr>
				<td><label for="alpha">Alpha Angle</label></td>
				<td
					><input id="alpha" type="range" min="0" max="45" value="15" />
					<span id="alpha-value" class="value"></span></td
				>
			</tr>
			<tr>
				<td><label for="beta">Beta Angle</label></td>
				<td
					><input id="beta" type="range" min="-45" max="45" value="15" />
					<span id="beta-value" class="value"></span></td
				>
			</tr>
			<tr>
				<td><label for="depth">Depth</label></td>
				<td
					><input id="depth" type="range" min="20" max="100" value="50" />
					<span id="depth-value" class="value"></span></td
				>
			</tr>
		</table>
	</div>
</figure>
