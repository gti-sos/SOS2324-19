<script>
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	let isLoading = true; 
	let covidData = [];
	let zipCodeData = [];
    let interestRateData = [];

	let countries1 = ['Canada', 'Norway', 'Poland', 'Mexico', 'Denmark'];
    let countries2 = ['Sweden', 'Norway', 'Poland', 'Mexico', 'Denmark'];

	let APIRSG = '/api/v2/covid-testings';
	let zipCodeAPI = 'https://api.api-ninjas.com/v1/zipcode?city=';
    let holidaysAPI = `https://api.api-ninjas.com/v1/holidays?country=CA&year=2021`;
    let interestRateAPI = 'https://api.api-ninjas.com/v1/interestrate?country=';
    let APIproxyRSG = `/proxyRSG`;


	if (dev) {
		APIRSG = 'http://localhost:10000' + APIRSG;
        APIproxyRSG = 'http://localhost:10000' + APIproxyRSG;
	}

	onMount(async () => {
		try {
			await fetchData1();
            await fetchData2();
			isLoading = false; 
			graph1();
            graph2();
            graph3();
            graph4();
		} catch (error) {
			console.error('Error fetching data:', error);
			isLoading = false;
		}
	});

	//Procesa llamadas a api de zip
	async function fetchData1() {
		for (let country of countries1) {
			console.log(`Fetching data for ${country}`);
			const covidResponse = await getDataKey(`${APIRSG}?country=${country}`);
			const zipCodeResponse = await getDataKey(zipCodeAPI + country);

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


	//Procesa llamadas a api de interestRate
    async function fetchData2() {
		for (let country of countries2) {
			console.log(`Fetching data for ${country}`);
			const covidResponse = await getDataKey(`${APIRSG}?country=${country}`);
			const interestRateResponse = await getDataKey(interestRateAPI + country);

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
            const res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

	async function getDataKey(url) {
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

	function graph1() {
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
		var chart = new CanvasJS.Chart('graph1', {
			animationEnabled: true,
			exportEnabled: true,
			title: {
				text: 'Nuevos casos por Codigo Postal'
			},
			data: [
				{
					type: 'pyramid',
					indexLabelFontSize: 18,
					valueRepresents: 'area',
					showInLegend: true,
					legendText: '{indexLabel} ({y})',
					toolTipContent: '<b>{indexLabel}:</b> {y} nuevos casos',
					dataPoints: pyramidData
				}
			]
		});
		chart.render();
	}

    async function graph2() {
        const covidResponse = await getData(APIRSG);
        const eventsResponse = await getData(APIproxyRSG);
    
		// Extraer el año y el número de nuevos casos
        const covidData = covidResponse
            .map((d) => ({
                year: parseInt(d.year_week.split('-')[0]),
                new_cases: d.new_cases
            }))
            .sort((a, b) => a.year - b.year);
    
        const eventsData = eventsResponse.event || eventsResponse;
    
        const groupByYear = eventsData.reduce((acc, event) => {
            const year = new Date(event.dateEvent).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});
    
        const eventsArray = Object.entries(groupByYear).map(([year, events]) => ({
            year: parseInt(year),
            events
        }));
    
        eventsArray.sort((a, b) => a.year - b.year);
    
        const combinedData = covidData.map((covid) => {
            const events = eventsArray.find((event) => event.year === covid.year);
            return { year: covid.year, new_cases: covid.new_cases, events: events ? events.events : 0 };
        });
    
        const margin = { top: 40, right: 20, bottom: 40, left: 50 };
        const width = 600;
        const height = 400;
        const svg = d3.select('#graph2').append('svg').attr('width', width).attr('height', height);
        const graph = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    
        const x = d3
            .scaleLinear()
            .domain([d3.min(combinedData, (d) => d.year) - 1, d3.max(combinedData, (d) => d.year) + 1])
            .range([0, width - margin.left - margin.right]);
        const y1 = d3
            .scaleLinear()
            .domain([0, d3.max(combinedData, (d) => d.new_cases)])
            .range([height - margin.top - margin.bottom, 0]);
        const y2 = d3
            .scaleLinear()
            .domain([0, d3.max(combinedData, (d) => d.events)])
            .range([height - margin.top - margin.bottom, 0]);
    
        graph
            .selectAll('.covid-circle')
            .data(combinedData)
            .enter()
            .append('circle')
            .attr('class', 'covid-circle')
            .attr('cx', (d) => x(d.year))
            .attr('cy', (d) => y1(d.new_cases))
            .attr('r', 4)
            .attr('fill', 'blue');
    
        graph
            .selectAll('.event-circle')
            .data(combinedData)
            .enter()
            .append('circle')
            .attr('class', 'event-circle')
            .attr('cx', (d) => x(d.year))
            .attr('cy', (d) => y2(d.events))
            .attr('r', 4)
            .attr('fill', 'red');
        
        // Leyenda
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${margin.left + 20},${margin.top + 20})`);
        
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'blue');
        
        legend.append('text')
            .attr('x', 30)
            .attr('y', 10)
            .text('Casos de COVID');
        
        legend.append('rect')
            .attr('x', 0)
            .attr('y', 30)
            .attr('width', 20)
            .attr('height', 20)
            .attr('fill', 'red');
        
        legend.append('text')
            .attr('x', 30)
            .attr('y', 40)
            .text('Eventos');
    
        // Ejes y etiquetas
        const xAxis = d3.axisBottom(x);
        const yAxisLeft = d3.axisLeft(y1);
        const yAxisRight = d3.axisRight(y2);
    
        graph
            .append('g')
            .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis);
        graph.append('g').call(yAxisLeft);
        graph
            .append('g')
            .attr('transform', `translate(${width - margin.left - margin.right},0)`)
            .call(yAxisRight);
    
        svg
            .append('text')
            .attr('transform', `translate(${width / 2},${height - margin.bottom / 2})`)
            .style('text-anchor', 'middle')
            .text('Año');
        svg
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', margin.left / 2)
            .attr('x', -height / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Casos de COVID');
    
        svg
            .append('text')
            .attr('transform', `rotate(-90)`)
            .attr('y', width - margin.left - margin.right + margin.left / 2)
            .attr('x', -height / 2)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Eventos');
    }

    async function graph3() {
		const covidResponse = await getData(APIRSG);
		const holidaysResponse = await getDataKey(holidaysAPI);

		console.log('Covid data:', covidResponse);
		console.log('Holidays data:', holidaysResponse);

		const covidData = covidResponse
			.filter((data) => data.year_week.startsWith('2021'))
			.map((d) => ({
				year: parseInt(d.year_week.split('-')[0]),
				new_cases: d.new_cases
			}))
			.sort((a, b) => a.year - b.year);

		const holidaysData = holidaysResponse.filter((event) => event.date.startsWith('2021'));

		const groupByYear = holidaysData.reduce((acc, event) => {
			const year = new Date(event.date).getFullYear();
			acc[year] = (acc[year] || 0) + 1;
			return acc;
		}, {});

		const years = [
			...new Set([...covidData.map((data) => data.year), ...Object.keys(groupByYear).map(Number)])
		];
		years.sort((a, b) => a - b);

		const combinedData = years.map((year) => ({
			year: year,
			new_cases: covidData.find((data) => data.year === year)?.new_cases || 0,
			hol: groupByYear[year] || 0
		}));

		const ctx = document.getElementById('graph3').getContext('2d');
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: years,
				datasets: [
					{
						label: 'Nuevos Casos',
						data: combinedData.map((data) => data.new_cases),
						backgroundColor: 'blue',
						yAxisID: 'left-y-axis'
					},
					{
						label: 'Vacaciones',
						data: combinedData.map((data) => data.hol),
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
						text: 'Casos de COVID y Vacaciones en 2021'
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
							text: 'Vacaciones',
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
							text: 'Nuevos Casos',
							color: 'blue'
						},
						ticks: {
							color: 'blue'
						}
					},
					x: {
						title: {
							display: true,
							text: 'Año'
						}
					}
				}
			}
		});
	}

    function graph4() {
		const options = {
			//interestRateData se procesa en fetchData2
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
				text: 'Relación entre el total de nuevos casos de COVID-19 y la tasa de interés por país'
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

		const chart = new ApexCharts(document.querySelector('#graph4'), options);
		chart.render();
	}


</script>

<svelte:head>
	<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

{#if isLoading}
	<div>Cargando gráficas...</div>
{/if}

<div id="graph1" style="height: 370px; width: 100%;"></div>
<div id="graph2" style="height: 370px; width: 100%;"></div>
<div>
    <canvas id="graph3" style="width: 100%; height: 500px;"></canvas>
</div>
<div id="graph4" style="height: 370px; width: 100%;"></div>
