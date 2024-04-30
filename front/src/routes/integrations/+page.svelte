<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import * as d3 from 'd3';

	let APIJPR = `/api/v2/esif-payments`;
	let APIJPRAUX1 = '/proxyJPR';

	let datajpr = [];
	let datajpraux1 = [];

	// Si estamos en un entorno de desarrollo, apuntamos a la URL local
	if (dev) {
		APIJPR = 'http://localhost:10000' + APIJPR;
		APIJPRAUX1 = 'http://localhost:10000' + APIJPRAUX1;
	}

	onMount(async () => {
		await getData();
		drawChart();
	});

	async function fetchData(url) {
		try {
			const res = await fetch(url);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function getData() {
		datajpr = await fetchData(APIJPR);
		datajpraux1 = await fetchData(APIJPRAUX1);
	}

	function drawChart() {
		const msValues1 = datajpr.map((d) => d.ms);
		const msValues2 = datajpraux1.map((d) => d.ms);

		// Encontrar la intersección de las "ms" en ambas API
		const commonMsValues = msValues1.filter((ms) => msValues2.includes(ms));

		// Filtrar los datos para mostrar solo aquellos con "ms" comunes
		const filteredDatajpr = datajpr.filter((d) => commonMsValues.includes(d.ms));
		const filteredDatajpraux1 = datajpraux1.filter((d) => commonMsValues.includes(d.ms));

		const netPlannedEUAmount1 = filteredDatajpr
			.filter((d) => !isNaN(d.net_planned_eu_amount))
			.map((d) => d.net_planned_eu_amount / 1000);

		const netPlannedEUAmount2 = filteredDatajpraux1
			.filter((d) => !isNaN(d.net_planned_eu_amount))
			.map((d) => d.net_planned_eu_amount / 100);

		const margin = { top: 40, right: 30, bottom: 70, left: 90 };
		const width = 800 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#chart-container')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const x = d3.scaleBand().domain(commonMsValues).range([0, width]).padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, d3.max([...netPlannedEUAmount1, ...netPlannedEUAmount2])])
			.range([height, 0]);

		svg
			.append('g')
			.attr('class', 'x-axis')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x));

		svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

		svg
			.selectAll('.bar1')
			.data(filteredDatajpr)
			.enter()
			.append('rect')
			.attr('class', 'bar1')
			.attr('x', (d) => x(d.ms))
			.attr('y', (d) => y(d.net_planned_eu_amount))
			.attr('width', x.bandwidth() / 2)
			.attr('height', (d) => height - y(d.net_planned_eu_amount))
			.attr('fill', 'steelblue');

		svg
			.selectAll('.bar2')
			.data(filteredDatajpraux1)
			.enter()
			.append('rect')
			.attr('class', 'bar2')
			.attr('x', (d) => x(d.ms) + x.bandwidth() / 2)
			.attr('y', (d) => y(d.net_planned_eu_amount / 100))
			.attr('width', x.bandwidth() / 2)
			.attr('height', (d) => height - y(d.net_planned_eu_amount / 100))
			.attr('fill', 'orange');
	}
</script>

<div class="container-fluid">
	<h2>Presupuesto neto planteado por País comparada API ITR con la API JPR</h2>
	<div id="chart-container"></div>
</div>
