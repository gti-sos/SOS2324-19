<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIJPR = `/api/v2/esif-payments`;
	let APIJPRAUX1 = 'https://api.api-ninjas.com/v1/inflation';
	let datajpr = [];
	let ay = [];
	let datajpraux1 = [];
	const simulatedData = [
		{
			country: 'Austria',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.49,
			yearly_rate_pct: 4.12
		},
		{
			country: 'Belgium',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.55,
			yearly_rate_pct: 3.18
		},
		{
			country: 'Canada',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.63,
			yearly_rate_pct: 2.9
		},
		{
			country: 'Chile',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.37,
			yearly_rate_pct: 3.78
		},
		{
			country: 'Estonia',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.41,
			yearly_rate_pct: 3.88
		},
		{
			country: 'Germany',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.42,
			yearly_rate_pct: 2.15
		},
		{
			country: 'Hungary',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.82,
			yearly_rate_pct: 3.65
		},
		{
			country: 'Iceland',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.79,
			yearly_rate_pct: 6.81
		},
		{
			country: 'Ireland',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.5,
			yearly_rate_pct: 2.87
		},
		{
			country: 'Luxembourg',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.21,
			yearly_rate_pct: 3.09
		},
		{
			country: 'Norway',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.23,
			yearly_rate_pct: 3.92
		},
		{
			country: 'Portugal',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 1.96,
			yearly_rate_pct: 2.29
		},
		{
			country: 'Russia',
			type: 'CPI',
			period: 'Mar 2022',
			monthly_rate_pct: 7.61,
			yearly_rate_pct: 16.7
		},
		{
			country: 'Slovakia',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.13,
			yearly_rate_pct: 2.34
		},
		{
			country: 'Sweden',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.12,
			yearly_rate_pct: 4.06
		},
		{
			country: 'Switzerland',
			type: 'CPI',
			period: 'Mar 2024',
			monthly_rate_pct: 0.03,
			yearly_rate_pct: 1.04
		},
		{
			country: 'The Netherlands',
			type: 'CPI',
			period: 'Apr 2024',
			monthly_rate_pct: 0.65,
			yearly_rate_pct: 2.7
		}
	];

	if (dev) {
		APIJPR = 'http://localhost:10000' + APIJPR;
	}

	async function getData() {
		APIJPR = APIJPR + `?limit=${1000}`;
		datajpr = await fetchData(APIJPR);
		//datajpraux1 = await fetchData(APIJPRAUX1);
		datajpraux1 = simulatedData;
	}

	async function fetchData(url) {
		try {
			const res = await fetch(url, {
				headers: {
					'X-Api-Key': 'WHeC8qeIxpcwUd9gxOysPA==aZ3uu33On0BlJc1D'
				}
			});
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	onMount(async () => {
		await getData();
		aux(datajpraux1, datajpr);
	});
	function aux(datajpraux1, d) {
		d.forEach((item) => {
			item.net_pre_financing = item.net_pre_financing / 5000000;
		});
		console.log(d);
		createChart(datajpraux1, d);
	}
	// Función para crear la gráfica con D3.js

	function createChart(simulatedData, datajpr) {
		const margin = { top: 20, right: 30, bottom: 40, left: 60 };
		const width = 600 - margin.left - margin.right;
		const height = 400 - margin.top - margin.bottom;

		const svg = d3
			.select('#chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Escala para el eje X (países)
		const x = d3
			.scaleBand()
			.domain(simulatedData.map((d) => d.country))
			.range([0, width])
			.padding(0.1);

		// Escala para el eje Y (yearly_rate_pct)
		const y = d3
			.scaleLinear()
			.domain([0, d3.max(simulatedData, (d) => d.yearly_rate_pct)])
			.nice()
			.range([height, 0]);

		// Barras para yearly_rate_pct
		svg
			.selectAll('.bar')
			.data(simulatedData)
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (d) => x(d.country))
			.attr('y', (d) => y(d.yearly_rate_pct))
			.attr('width', x.bandwidth())
			.attr('height', (d) => height - y(d.yearly_rate_pct))
			.style('fill', 'steelblue');

		// Línea para net_pre_financing
		svg
			.selectAll('.line')
			.data(datajpr)
			.enter()
			.append('line')
			.attr('class', 'line')
			.attr('x1', (d) => x(d.ms_name))
			.attr('x2', (d) => x(d.ms_name))
			.attr('y1', height)
			.attr('y2', (d) => y(d.net_pre_financing))
			.style('stroke', 'red')
			.style('stroke-width', 2);

		// Eje X
		svg
			.append('g')
			.attr('transform', `translate(0,${height})`)
			.call(d3.axisBottom(x))
			.selectAll('text')
			.attr('y', 0)
			.attr('x', 9)
			.attr('dy', '.35em')
			.attr('transform', 'rotate(45)')
			.style('text-anchor', 'start');

		// Eje Y (yearly_rate_pct)
		svg.append('g').call(d3.axisLeft(y));

		// Etiqueta eje Y (yearly_rate_pct)
		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 0 - margin.left)
			.attr('x', 0 - height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Yearly Rate Pct');

		// Etiqueta eje Y (net_pre_financing)
		svg
			.append('text')
			.attr('transform', 'rotate(90)')
			.attr('y', 0 - width - margin.right)
			.attr('x', height / 2)
			.attr('dy', '1em')
			.style('text-anchor', 'middle')
			.text('Net Prefinancing (Mil Millones)');
	}
</script>

<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<div id="chart"></div>
