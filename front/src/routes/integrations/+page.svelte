<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist"></script>


</svelte:head>
<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Color, color } from 'highcharts';
	import { PassThrough } from 'stream';

	let APIJPR = `/api/v2/esif-payments`;
	let APIJPRAUX1 = '/proxyJPR';

	let APIAFI = `/api/v2/policy-program-stats`;
	let APIproxyAFI= '/proxyAFI';
	let APIproxyAFI2=`https://sos2324-11.appspot.com/api/v2/structural-investment-data`;
	let APIexport='https://currency-exchange.p.rapidapi.com/listquotes';
	let optionsexport1=
	{
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
            }
        };

	let APIPHT=`/api/v2/eu-payment-info`;
	let APIproxyPHT=`/proxyPHT;`
	let datajpr = [];
	let datajpraux1 = [];
	let dataAFI = [];
	let dataproxyAFI = [];
	let dataproxyAFI2=[];
	let dataexportafi=[];
	let dataPHT=[];
	let dataproxyPHT=[];
	let dataRSG=[];
	let dataproxyRSG=[];
	// Si estamos en un entorno de desarrollo, apuntamos a la URL local
	if (dev) {
		APIJPR = 'http://localhost:10000' + APIJPR;
		APIJPRAUX1 = 'http://localhost:10000' + APIJPRAUX1;
		APIAFI='http://localhost:10000' + APIAFI;
		APIproxyAFI= 'http://localhost:10000' + APIproxyAFI;
		APIPHT= 'http://localhost:10000' + APIPHT;
		APIproxyPHT='http://localhost:10000' + APIproxyPHT;
	}

	onMount(async () => {
		await getData();
		drawChart();
		AFI1();
		AFI2();
		PHT();
	});

	async function fetchData(url) {
		try {
			const res = await fetch(url);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}
	async function fetchData2(url,options) {
		try {
			const res = await fetch(url,options);
			return await res.json();
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}

	async function getData() {
		datajpr = await fetchData(APIJPR);
		datajpraux1 = await fetchData(APIJPRAUX1);
		dataAFI = await fetchData(APIAFI);
		dataproxyAFI = await fetchData(APIproxyAFI);
		dataproxyAFI2 = await fetchData(APIproxyAFI2);
		dataPHT= await fetchData(APIPHT);
		dataproxyPHT= await fetchData(APIproxyPHT);
		dataexportafi=await fetchData2(APIexport,optionsexport1);
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

	function AFI1() {
		
		const tiposyear1 = [...new Set(dataAFI.map(item => parseInt(item.year)))];
		const tiposyear2 = [...new Set(dataproxyAFI.map(item => parseInt(item.time_period)))];
		const res = [...new Set([...tiposyear1, ...tiposyear2])];
		const combinedData = {};
		let countryData=[];
		dataAFI.forEach(entry => {
          const country = entry.country;
		  const year = entry.year;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
				  year:year,
                  total_amount_paid_to_fi: 0,
                  millions_of_passenger_per_kilometres:0
              };
          }
          combinedData[country].total_amount_paid_to_fi += entry.total_amount_paid_to_fi || 0;
		});
		dataproxyAFI.forEach(entry => {
          const country = entry.geo;
		  const year = entry.time_period;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
				  year:year,
                  total_amount_paid_to_fi: 0,
                  millions_of_passenger_per_kilometres:0
              };
          }
          combinedData[country].millions_of_passenger_per_kilometres += entry.millions_of_passenger_per_kilometres || 0;
      });
	  countryData = Object.values(combinedData);
        var options = {
			chart: {
				height: 280,
				type: "area"
			},
			dataLabels: {
				enabled: false
			},
			
			series: [{
              name: 'API policy-program-stats',
              data: countryData.map(country => country.total_amount_paid_to_fi/10)
          },{
              name: 'API cars-by-motor',
              data: countryData.map(country => country.millions_of_passenger_per_kilometres),
          }],
			fill: {
				type: "gradient",
				gradient: {
				shadeIntensity: 1,
				opacityFrom: 0.7,
				opacityTo: 0.9
				}
			},
			xaxis: {
				categories: res
			}
		};

		var chart = new ApexCharts(document.getElementById('afi1'), options);

		chart.render();
	}

	function AFI2() {
		const tiposcountry1 = [...new Set(dataAFI.map(item => item.country))];
		const tiposcountry2 = [...new Set(dataproxyAFI2.map(item => item.ms))];
		const res = [...new Set([...tiposcountry1, ...tiposcountry2])];
		const combinedData = {};
		let countryData=[];
		dataAFI.forEach(entry => {
          const country = entry.country;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  total_amount_paid_to_fi: 0,
                  cumulative_initial_pre_financing:0
              };
          }
          combinedData[country].total_amount_paid_to_fi += entry.total_amount_paid_to_fi || 0;
		});
		dataproxyAFI2.forEach(entry => {
          const country = entry.ms;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  total_amount_paid_to_fi: 0,
                  cumulative_initial_pre_financing:0
              };
          }
          combinedData[country].cumulative_initial_pre_financing += entry.cumulative_initial_pre_financing || 0;
      });
	  countryData = Object.values(combinedData);
    const ctx = document.getElementById('afi2');
    const myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
			labels:countryData.map(c=>c.name),
            datasets: [
                {
                    label: 'policy-program-stats',
                    data: countryData.map(c => parseInt(c.total_amount_paid_to_fi)/100),
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
                },
                {
                    label: 'structural-investment-data',
                    data: countryData.map(d => parseInt(d.cumulative_initial_pre_financing)/100),
                    backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
                }
            ]
        },
		options: {
    plugins: {
      legend: {
        position: 'top',
      }
    }
		}
    });
}

function PHT() {
    const tiposyear1 = [...new Set(dataPHT.map(item => parseInt(item.year)))];
    const tiposyear2 = [...new Set(dataproxyPHT.map(item => parseInt(item.time_period)))];
    const res = [...new Set([...tiposyear1, ...tiposyear2])];
    const combinedData = {};
    let countryData = [];
    
    dataPHT.forEach(entry => {
        const country = entry.ms;
        const year = entry.year;
        if (!combinedData[country]) {
            combinedData[country] = {
                name: country,
                year: year,
                init_plan_eu_amt_1_adoption: 0,
                obs_value: 0
            };
        }
        combinedData[country].init_plan_eu_amt_1_adoption += entry.init_plan_eu_amt_1_adoption || 0;
    });

    dataproxyPHT.forEach(entry => {
        const country = entry.geo;
        const year = entry.time_period;
        if (!combinedData[country]) {
            combinedData[country] = {
                name: country,
                year: year,
                init_plan_eu_amt_1_adoption: 0,
                obs_value: 0
            };
        }
        combinedData[country].obs_value += entry.obs_value || 0;
    });

    countryData = Object.values(combinedData);

    const chartData = {
        labels: res, // Define las etiquetas del eje x (años)
        series: [
            countryData.map(country => country.init_plan_eu_amt_1_adoption), // Datos de una serie
            countryData.map(country => country.obs_value) // Datos de la otra serie
        ]
    };

    const options = {
        // Define tus opciones de visualización aquí
        // Por ejemplo:
        fullWidth: true,
        chartPadding: {
            right: 40
        },
        // Puedes agregar más opciones según tus necesidades
    };

    // Crea el gráfico de líneas usando Chartist
    new Chartist.Line('.ct-chart', chartData, options);
}

</script>

<div class="container-fluid">
	<h2>Presupuesto neto planteado por País comparada API ITR con la API JPR</h2>
	<div id="chart-container"></div>
	<h2>Cantidad monetaria pagada al fondo por pais y kilometros recorridos por millones de pasajeros clasificados por año</h2>
	<h2>API cars-by-motor Y API policy-program-stats</h2>
	<div id="afi1"></div>
	<h2>Cantidad monetaria pagada a un fondo y la cantidad total acumulada pagada a un fondo clasificado por paises</h2>
	<h2>API structural-investment-data Y API policy-program-stats</h2>
	<div id="char">
		<canvas id="afi2" width="400" height="100"></canvas>
	</div>
	<h2>Api ni idea</h2>
	<div id="ct-chart">
		<style>
			.ct-chart {
			  width: 100%;
			  height: 300px;
			}
		  </style>
	</div>
	
</div> 