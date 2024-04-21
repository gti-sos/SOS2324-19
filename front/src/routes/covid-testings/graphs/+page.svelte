<svelte:head>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/highcharts-3d.js"></script>
    <script src="https://code.highcharts.com/modules/cylinder.js"></script>
    <script src="https://code.highcharts.com/modules/treemap.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="https://code.highcharts.com/modules/export-data.js"></script>
	<script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';
    import { dev } from '$app/environment';


	let dataAvailable = false;
	let DATAAPI = '/api/v2/covid-testings?limit=9999&offset=0';
	if (dev) DATAAPI = 'http://localhost:10000' + DATAAPI; 

	onMount(async () => {
		await getInitial();
	});


	async function getInitial() {
        try {
            let response = await fetch(DATAAPI.split("?")[0]+ "/loadInitialData", {
                method: "GET",
            });

            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status === 200) {
                await getData();
            } 

        } catch (error) {
            console.log(`Error loading initail data: ${error}`)
        }
    } 

	async function getData() {
		try {
			const res = await fetch(DATAAPI);
			const data = await res.json();
			console.log(`Data received: ${JSON.stringify(data, null, 2)}`);
            const datos2021 = data.filter(item => item.year_week.startsWith('2021'));
            console.log(datos2021);

			if (data.length > 0) {
				dataAvailable = true;
				createGraph(datos2021); 
                createGraph2(datos2021);
			}
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	function createGraph(data) {
		const chart = new Highcharts.Chart({
			chart: {
				renderTo: 'container',
				type: 'cylinder',
				options3d: {
					enabled: true,
					alpha: 15,
					beta: 15,
					depth: 50,
					viewDistance: 25
				}
			},
			xAxis: {
				categories: data.map(entry => entry.country)
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
					'<a href="https://data.europa.eu/data/datasets/covid-19-testing?locale=en"' +
					'target="_blank">COVID-19 testing</a>',
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
					data: data.map(entry => entry.new_cases), 
					colorByPoint: true
				}
			]
		});

		function showValues() {
			document.getElementById('alpha-value').innerHTML = chart.options.chart.options3d.alpha;
			document.getElementById('beta-value').innerHTML = chart.options.chart.options3d.beta;
			document.getElementById('depth-value').innerHTML = chart.options.chart.options3d.depth;
		}

		document.querySelectorAll('#sliders input').forEach((input) =>
			input.addEventListener('input', (e) => {
				chart.options.chart.options3d[e.target.id] = parseFloat(e.target.value);
				showValues();
				chart.redraw(false);
			})
		);

		showValues();
    
    }

    function createGraph2(data) {
        const points = [];

        const colors = Highcharts.getOptions().colors;

        for (let i = 0; i < data.length; i++) {
            points.push({
                name: data[i].country,
                value: data[i].tests_done,
                color: colors[i] // Asignar un color diferente a cada nodo
            });
        }

        Highcharts.chart('container2', {
            series: [{
                name: 'Tests Done',
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                allowDrillToNode: true,
                animationLimit: 1000,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true
                    },
                    borderWidth: 3,
                    levelIsConstant: false
                }],
                data: points
            }],
            subtitle: {
                text: 'Source: Your Source Here',
                align: 'left'
            },
            title: {
                text: 'Tests Done in 2021',
                align: 'left'
            }
        });
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
    <div id="container2"></div>
    <p class="highcharts-description">    </p>
</figure>
