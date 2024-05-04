<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIRSG = `/api/v2/covid-testings`;
	let APIproxyRSG = `/proxyRSG;`;
	let APIextRSG = 'https://api.api-ninjas.com/v1/cars';

	let dataRSG = [];
	let dataproxyRSG = [];
	let dataextRSG = [];

	if (dev) {
		APIRSG = 'http://localhost:10000' + APIRSG;
		APIproxyRSG = 'http://localhost:10000' + APIproxyRSG;
	}

	onMount(async () => {
		RSG1();
		RSG2();
	});

	async function getAPIData1() {
		const url = 'https://api.api-ninjas.com/v1/cars?fuel_type=gas';
		const options = {
			method: 'GET',
			headers: {
				'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			console.log(result);
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async function getAPIData2() {
		const url = 'https://api.api-ninjas.com/v1/holidays?country=CA&year=2021';
		const options = {
			method: 'GET',
			headers: {
				'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			console.log(result);
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async function RSG1() {
		try {
			const apiData = await getAPIData1();

			// Procesar los datos para el gráfico de pie
			const brandsData = {};
			apiData.forEach((car) => {
				const brand = car.make;
				if (!brandsData[brand]) {
					brandsData[brand] = 0;
				}
				brandsData[brand]++;
			});

			const data = Object.entries(brandsData).map(([brand, count]) => ({
				label: brand,
				value: count
			}));

			// Crear el gráfico de pie
			const width = 400;
			const height = 400;
			const radius = Math.min(width, height) / 2;

			const color = d3.scaleOrdinal().range(['#1ab7ea', '#0084ff', '#39539E', '#0077B5']);

			const svg = d3
				.select('#rsg1')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

			const arc = d3.arc().innerRadius(0).outerRadius(radius);

			const pie = d3
				.pie()
				.value(function (d) {
					return d.value;
				})
				.sort(null);

			const g = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

			g.append('path')
				.attr('d', arc)
				.style('fill', function (d) {
					return color(d.data.label);
				});

			g.append('text')
				.attr('transform', function (d) {
					return 'translate(' + arc.centroid(d) + ')';
				})
				.attr('dy', '.35em')
				.text(function (d) {
					return d.data.label;
				});
		} catch (error) {
			console.error(error);
		}
	}

	async function RSG2() {
    try {
        const apiData = await getAPIData2();

        // Procesar los datos para contar eventos por mes
        const monthsData = {};
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        apiData.forEach((holiday) => {
            const date = new Date(holiday.date);
            const month = date.getMonth(); // El mes va de 0 a 11
            const monthName = monthNames[month];
            if (!monthsData[monthName]) {
                monthsData[monthName] = 0;
            }
            monthsData[monthName]++;
        });

        // Crear arrays separados para etiquetas de meses y valores de eventos
        const labels = [];
        const values = [];
        const colors = [];
        for (let month = 0; month < 12; month++) {
            const monthName = monthNames[month];
            labels.push(monthName);
            values.push(monthsData[monthName] || 0); // Si no hay eventos en el mes, se establece en 0
            // Generar colores aleatorios para cada barra
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
            colors.push(color);
        }

        // Crear el gráfico de barras utilizando Chart.js
        const ctx = document.getElementById('rsg2').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Eventos por mes',
                    data: values,
                    backgroundColor: colors,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    } catch (error) {
        console.error(error);
    }
}

</script>

<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div class="container-fluid">
	<div id="rsg1"></div>
	<canvas id="rsg2"></canvas>
</div>
