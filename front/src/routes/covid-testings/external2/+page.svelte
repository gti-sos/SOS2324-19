<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIRSG = `/api/v2/covid-testings`;
	let APIproxyRSG = `/proxyRSG`;

	// Si estás en modo desarrollo, cambia las URLs de la API
	if (dev) {
		APIRSG = 'http://localhost:10000' + APIRSG;
		APIproxyRSG = 'http://localhost:10000' + APIproxyRSG;
	}

	onMount(async () => {
		drawChart();
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
		const url = APIproxyRSG;
		try {
			const res = await fetch(url);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function drawChart() {
		const covidResponse = await getData();
		const centralBankResponse = await getData1();

		const covidData = covidResponse
			.map((d) => ({
				year: parseInt(d.year_week.split('-')[0]),
				new_cases: d.new_cases
			}))
			.sort((a, b) => a.year - b.year);

		const eventsData = centralBankResponse.event || centralBankResponse;

		const eventsByYear = eventsData.reduce((acc, event) => {
			const year = new Date(event.dateEvent).getFullYear();
			acc[year] = (acc[year] || 0) + 1;
			return acc;
		}, {});

		const eventsArray = Object.entries(eventsByYear).map(([year, events]) => ({
			year: parseInt(year),
			events
		}));

		eventsArray.sort((a, b) => a.year - b.year);

		const combinedData = covidData.map((covid) => {
			const events = eventsArray.find((event) => event.year === covid.year);
			return { year: covid.year, new_cases: covid.new_cases, events: events ? events.events : 0 };
		});

		const margin = { top: 20, right: 20, bottom: 40, left: 50 };
		const width = 600;
		const height = 400;
		const svg = d3.select('#chartdiv').append('svg').attr('width', width).attr('height', height);
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

		const lineCovid = d3
			.line()
			.x((d) => x(d.year))
			.y((d) => y1(d.new_cases));
		const lineEvents = d3
			.line()
			.x((d) => x(d.year))
			.y((d) => y2(d.events));

		graph
			.append('path')
			.data([combinedData])
			.attr('fill', 'none')
			.attr('stroke', 'blue')
			.attr('stroke-width', 2)
			.attr('d', lineCovid);
		graph
			.append('path')
			.data([combinedData])
			.attr('fill', 'none')
			.attr('stroke', 'red')
			.attr('stroke-width', 2)
			.attr('d', lineEvents);

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

	getData();
</script>

<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<div id="chartdiv" style="width: 100%; height: 500px;"></div>
