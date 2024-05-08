<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let APIJPR = `/api/v2/esif-payments`;
	let APIJPRAUX1 = 'https://api.api-ninjas.com/v1/inflation';
	let APIJPRAUX2 = 'https://covid-193.p.rapidapi.com/countries';
	let APIJPRAUX3 = 'https://api.api-ninjas.com/v1/trivia?limit=25';
	let APIJPRAUX4 = '/proxyJPR';
	let datajpr = [];
	let datajpraux2 = [];
	let datajpraux1 = [];
	let datajpraux3 = [];
	let datajpraux4 = [];
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
	const simulatedData2 = [
		'Afghanistan',
		'Albania',
		'Algeria',
		'Andorra',
		'Angola',
		'Anguilla',
		'Antigua-and-Barbuda',
		'Argentina',
		'Armenia',
		'Aruba',
		'Australia',
		'Austria',
		'Azerbaijan',
		'Bahamas',
		'Bahrain',
		'Bangladesh',
		'Barbados',
		'Belarus',
		'Belgium',
		'Belize',
		'Benin',
		'Bermuda',
		'Bhutan',
		'Bolivia',
		'Bosnia-and-Herzegovina',
		'Botswana',
		'Brazil',
		'British-Virgin-Islands',
		'Brunei',
		'Bulgaria',
		'Burkina-Faso',
		'Burundi',
		'Cabo-Verde',
		'Cambodia',
		'Cameroon',
		'Canada',
		'CAR',
		'Caribbean-Netherlands',
		'Cayman-Islands',
		'Chad',
		'Channel-Islands',
		'Chile',
		'China',
		'Colombia',
		'Comoros',
		'Congo',
		'Cook-Islands',
		'Costa-Rica',
		'Croatia',
		'Cuba',
		'Cura&ccedil;ao',
		'Cyprus',
		'Czechia',
		'Denmark',
		'Diamond-Princess',
		'Djibouti',
		'Dominica',
		'Dominican-Republic',
		'DPRK',
		'DRC',
		'Ecuador',
		'Egypt',
		'El-Salvador',
		'Equatorial-Guinea',
		'Eritrea',
		'Estonia',
		'Eswatini',
		'Ethiopia',
		'Faeroe-Islands',
		'Falkland-Islands',
		'Fiji',
		'Finland',
		'France',
		'French-Guiana',
		'French-Polynesia',
		'Gabon',
		'Gambia',
		'Georgia',
		'Germany',
		'Ghana',
		'Gibraltar',
		'Greece',
		'Greenland',
		'Grenada',
		'Guadeloupe',
		'Guatemala',
		'Guinea',
		'Guinea-Bissau',
		'Guyana',
		'Haiti',
		'Honduras',
		'Hong-Kong',
		'Hungary',
		'Iceland',
		'India',
		'Indonesia',
		'Iran',
		'Iraq',
		'Ireland',
		'Isle-of-Man',
		'Israel',
		'Italy',
		'Ivory-Coast',
		'Jamaica',
		'Japan',
		'Jordan',
		'Kazakhstan',
		'Kenya',
		'Kiribati',
		'Kuwait',
		'Kyrgyzstan',
		'Laos',
		'Latvia',
		'Lebanon',
		'Lesotho',
		'Liberia',
		'Libya',
		'Liechtenstein',
		'Lithuania',
		'Luxembourg',
		'Macao',
		'Madagascar',
		'Malawi',
		'Malaysia',
		'Maldives',
		'Mali',
		'Malta',
		'Marshall-Islands',
		'Martinique',
		'Mauritania',
		'Mauritius',
		'Mayotte',
		'Mexico',
		'Micronesia',
		'Moldova',
		'Monaco',
		'Mongolia',
		'Montenegro',
		'Montserrat',
		'Morocco',
		'Mozambique',
		'MS-Zaandam',
		'Myanmar',
		'Namibia',
		'Nauru',
		'Nepal',
		'Netherlands',
		'New-Caledonia',
		'New-Zealand',
		'Nicaragua',
		'Niger',
		'Nigeria',
		'Niue',
		'North-Macedonia',
		'Norway',
		'Oman',
		'Pakistan',
		'Palau',
		'Palestine',
		'Panama',
		'Papua-New-Guinea',
		'Paraguay',
		'Peru',
		'Philippines',
		'Poland',
		'Portugal',
		'Qatar',
		'R&eacute;union',
		'Romania',
		'Russia',
		'Rwanda',
		'S-Korea',
		'Saint-Helena',
		'Saint-Kitts-and-Nevis',
		'Saint-Lucia',
		'Saint-Martin',
		'Saint-Pierre-Miquelon',
		'Samoa',
		'San-Marino',
		'Sao-Tome-and-Principe',
		'Saudi-Arabia',
		'Senegal',
		'Serbia',
		'Seychelles',
		'Sierra-Leone',
		'Singapore',
		'Sint-Maarten',
		'Slovakia',
		'Slovenia',
		'Solomon-Islands',
		'Somalia',
		'South-Africa',
		'South-Sudan',
		'Spain',
		'Sri-Lanka',
		'St-Barth',
		'St-Vincent-Grenadines',
		'Sudan',
		'Suriname',
		'Sweden',
		'Switzerland',
		'Syria',
		'Taiwan',
		'Tajikistan',
		'Tanzania',
		'Thailand',
		'Timor-Leste',
		'Togo',
		'Tokelau',
		'Tonga',
		'Trinidad-and-Tobago',
		'Tunisia',
		'Turkey',
		'Turks-and-Caicos',
		'Tuvalu',
		'UAE',
		'Uganda',
		'UK',
		'Ukraine',
		'Uruguay',
		'USA',
		'Uzbekistan',
		'Vanuatu',
		'Vatican-City',
		'Venezuela',
		'Vietnam',
		'Wallis-and-Futuna',
		'Western-Sahara',
		'Yemen',
		'Zambia',
		'Zimbabwe'
	];
	const simulatedData3 = [
		{
			category: 'general',
			question: 'Selachophobia Is The Morbid Fear Of Which Highly Dangerous Creatures?',
			answer: 'Sharks'
		},
		{
			category: 'general',
			question: 'If you Manuxorate what are you doing',
			answer: 'Male Masturbating With Hand'
		},
		{
			category: 'general',
			question: 'In cookery a ganache is made from cream and what',
			answer: 'Chocolate'
		},
		{
			category: 'general',
			question:
				"What license plate number is on the volkswagon on the cover of the beatles' 'abbey road' album",
			answer: '281f'
		},
		{
			category: '',
			question:
				'On "The Lord Of The Rings:The Return of The King" soundtrack,Renee Fleming sings in what language?',
			answer: 'Sindarin'
		},
		{
			category: '',
			question:
				'In the original edition of "Trivial Pursuit," what category is represented by the color yellow?',
			answer: 'History'
		},
		{
			category: 'general',
			question:
				'What was the name of the scandal that resulted in the resignation of president nixon',
			answer: 'Watergate'
		},
		{
			category: 'general',
			question: 'What film did Art Carney win the 1974 best actor Oscar for',
			answer: 'Harry And Tonto'
		},
		{ category: 'general', question: 'What is a Godeminche', answer: 'Penis Dildo With Balls' },
		{
			category: '',
			question:
				'Which of these real-life figures of antiquity was renowned above all for his fabulous wealth?',
			answer: 'Croesus'
		},
		{
			category: '',
			question:
				'Since the 1920s,what sport has held an amateur tournament known as the "Golden Gloves"?',
			answer: 'Boxing'
		},
		{
			category: '',
			question: `In Disneyland's ride "It's a Small World," animatr…e title song in all but which of these languages?`,
			answer: 'French'
		},
		{
			category: 'general',
			question: "What is the name of the policeman who appears in the TV series 'Postman Pat'?",
			answer: 'Pc Selby'
		},
		{
			category: 'general',
			question: 'What Was Hung Upside Down In The Piazzale Loreto In Milan In 1945',
			answer: "Mussolini's Body"
		},
		{ category: 'general', question: 'What is the scapula', answer: 'Breastbone' },
		{
			category: 'general',
			question: 'What colour would the sky be if viewed from mars',
			answer: 'Pink'
		},
		{
			category: 'fooddrink',
			question: 'What Is The Italian Name For Squid In A Restaurant? ',
			answer: 'Calamari'
		},
		{
			category: 'sciencenature',
			question: 'What is the term for the group of plants that catch and digest insects?',
			answer: 'Carnivorous'
		},
		{
			category: 'general',
			question: 'What george harrison lp featured the single "give me love"?',
			answer: 'Living In The Material World'
		},
		{
			category: 'sportsleisure',
			question: 'In Which Sport Would Win The Federation Cup ',
			answer: 'Womens Tennis'
		},
		{
			category: 'music',
			question: 'Although The Claim Of Millions Who Is Undoubtedly "Born In The Usa"',
			answer: 'Bruce Springsteen'
		},
		{
			category: 'general',
			question: 'Which character was portrayed by Meryl Streep in the film Out of Africa',
			answer: 'Karen Blixen'
		},
		{
			category: 'fooddrink',
			question: 'What famous product did cerebos manufacture? ',
			answer: 'Cooking Salt'
		},
		{
			category: 'general',
			question: 'Who invented the electric razor in 1928',
			answer: 'Jacob Schick'
		},
		{
			category: 'artliterature',
			question: "Who said 'But, soft! what light through yonder window breaks'?",
			answer: 'Romeo'
		}
	];
	const simulatedData4 = [
		{
			name: 'New York',
			latitude: 40.6943,
			longitude: -73.9249,
			country: 'US',
			population: 18713220
		},
		{
			name: 'Los Angeles',
			latitude: 34.1139,
			longitude: -118.407,
			country: 'US',
			population: 12750807
		},
		{ name: 'Chicago', latitude: 41.8373, longitude: -87.6862, country: 'US', population: 8604203 },
		{ name: 'Miami', latitude: 25.7839, longitude: -80.2102, country: 'US', population: 6445545 },
		{ name: 'Dallas', latitude: 32.7936, longitude: -96.7662, country: 'US', population: 5743938 },
		{
			name: 'Philadelphia',
			latitude: 40.0077,
			longitude: -75.1339,
			country: 'US',
			population: 5649300
		},
		{ name: 'Houston', latitude: 29.7863, longitude: -95.3889, country: 'US', population: 5464251 },
		{ name: 'Atlanta', latitude: 33.7627, longitude: -84.4224, country: 'US', population: 5449398 },
		{
			name: 'Washington',
			latitude: 38.9047,
			longitude: -77.0163,
			country: 'US',
			population: 5379184
		},
		{ name: 'Boston', latitude: 42.3188, longitude: -71.0846, country: 'US', population: 4688346 },
		{ name: 'Phoenix', latitude: 33.5722, longitude: -112.089, country: 'US', population: 4219697 },
		{ name: 'Seattle', latitude: 47.6211, longitude: -122.324, country: 'US', population: 3789215 },
		{
			name: 'San Francisco',
			latitude: 37.7562,
			longitude: -122.443,
			country: 'US',
			population: 3592294
		},
		{ name: 'Detroit', latitude: 42.3834, longitude: -83.1024, country: 'US', population: 3506126 },
		{
			name: 'San Diego',
			latitude: 32.8312,
			longitude: -117.122,
			country: 'US',
			population: 3220118
		},
		{
			name: 'Minneapolis',
			latitude: 44.9635,
			longitude: -93.2678,
			country: 'US',
			population: 2977172
		},
		{ name: 'Tampa', latitude: 27.9942, longitude: -82.4451, country: 'US', population: 2908063 },
		{ name: 'Denver', latitude: 39.7621, longitude: -104.876, country: 'US', population: 2876625 },
		{
			name: 'Brooklyn',
			latitude: 40.6501,
			longitude: -73.9496,
			country: 'US',
			population: 2559903
		},
		{ name: 'Queens', latitude: 40.7498, longitude: -73.7976, country: 'US', population: 2230722 },
		{
			name: 'Riverside',
			latitude: 33.9381,
			longitude: -117.395,
			country: 'US',
			population: 2107852
		},
		{
			name: 'Baltimore',
			latitude: 39.3051,
			longitude: -76.6144,
			country: 'US',
			population: 2106068
		},
		{
			name: 'Las Vegas',
			latitude: 36.2333,
			longitude: -115.265,
			country: 'US',
			population: 2104198
		},
		{ name: 'Portland', latitude: 45.5372, longitude: -122.65, country: 'US', population: 2074775 },
		{
			name: 'San Antonio',
			latitude: 29.4658,
			longitude: -98.5253,
			country: 'US',
			population: 2049293
		},
		{
			name: 'St. Louis',
			latitude: 38.6358,
			longitude: -90.2451,
			country: 'US',
			population: 2024074
		},
		{
			name: 'Sacramento',
			latitude: 38.5667,
			longitude: -121.468,
			country: 'US',
			population: 1898019
		},
		{ name: 'Orlando', latitude: 28.4772, longitude: -81.3369, country: 'US', population: 1822394 },
		{ name: 'San Jose', latitude: 37.3019, longitude: -121.849, country: 'US', population: 1798103 }
	];

	if (dev) {
		APIJPR = 'http://localhost:10000' + APIJPR;
		APIJPRAUX4 = 'http://localhost:10000' + APIJPRAUX4;
	}

	async function getData() {
		APIJPR = APIJPR + `?limit=${1000}`;
		datajpr = await fetchDataNinja(APIJPR);
		datajpraux1 = await fetchDataNinja(APIJPRAUX1);
		datajpraux2 = await fetchDataRapidApi(APIJPRAUX2, optionsCOV);
		datajpraux3 = await fetchDataNinja(APIJPRAUX3);
		datajpraux4 = await fetchDataNinja(APIJPRAUX4);
		console.log(datajpraux4);
		//para no gastar llamadas a la API
		//datajpraux1 = simulatedData;
		//datajpraux2 = simulatedData2;
		//datajpraux3 = simulatedData3;
		//datajpraux4 = simulatedData4;
	}
	async function fetchDataNinja(url) {
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
	async function fetchDataRapidApi(url, options) {
		try {
			const resp = await fetch(url, options);
			let res = await resp.json();
			return res.response;
		} catch (error) {
			console.log(`Error fetching data: ${error}`);
		}
	}
	const optionsCOV = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '47dc3441b9msh3b1e865337916a5p12cf49jsn0054a417fcd1',
			'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
		}
	};

	onMount(async () => {
		await getData();
		aux(datajpraux1, datajpr);
		createChart2();
		createChart3();
		createChart4();
	});
	function aux(datajpraux1, d) {
		d.forEach((item) => {
			item.net_pre_financing = item.net_pre_financing / 5000000;
		});
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
	async function createChart2() {
		// Filtrar los países de datajpraux2 que también están en datajpr
		const countries = datajpraux2.filter((country) =>
			datajpr.find((item) => item.ms_name === country)
		);
		// Obtener nombres de países y sus respectivos fondos de datajpr
		const countryFunds = datajpr.map((item) => ({ country: item.ms_name, fund: item.fund }));
		// Filtrar los fondos de los países que están presentes en datajpraux2
		const filteredFunds = countryFunds.filter((item) => countries.includes(item.country));
		// Contar la cantidad de fondos por país
		const fundCounts = filteredFunds.reduce((acc, curr) => {
			acc[curr.country] = acc[curr.country] ? acc[curr.country] + 1 : 1;
			return acc;
		}, {});
		// Crear una serie de datos para la gráfica
		const series = Object.entries(fundCounts).map(([country, count]) => ({ x: country, y: count }));
		const options = {
			chart: {
				type: 'bar',
				height: 400
			},
			series: [
				{
					name: 'Número de veces con fondo',
					data: series
				}
			],
			xaxis: {
				categories: Object.keys(fundCounts),
				title: {
					text: 'Países'
				}
			},
			yaxis: {
				title: {
					text: 'Número de veces con fondo'
				}
			}
		};
		const chart = new ApexCharts(document.querySelector('#chart2'), options);
		chart.render();
	}
	function createChart3() {
		// Obtener los datos de las categorías y sus recuentos
		const categoryCounts = {};
		datajpraux3.forEach((item) => {
			const category = item.category || 'Sin categoría';
			if (categoryCounts[category]) {
				categoryCounts[category]++;
			} else {
				categoryCounts[category] = 1;
			}
		});

		// Crear un array de objetos con las categorías y sus recuentos
		const chartData = Object.entries(categoryCounts).map(([category, count]) => ({
			category: category,
			count: count
		}));

		// Configurar las opciones del gráfico
		const options = {
			axisX: {
				// Configuración para mostrar el nombre completo de las categorías
				labelInterpolationFnc: function (value) {
					return value;
				}
			}
		};

		// Crear el gráfico de barras con Chartist.js
		new Chartist.Bar(
			'#chart3',
			{
				labels: chartData.map((item) => item.category),
				series: [chartData.map((item) => item.count)]
			},
			options
		);
	}
	function createChart4() {
		// Definir intervalos de población
		var populationIntervals = [
			{ range: '0-2M', min: 0, max: 2000000, count: 0 },
			{ range: '2M-5M', min: 2000001, max: 5000000, count: 0 },
			{ range: '5M-10M', min: 5000001, max: 10000000, count: 0 },
			{ range: '10M+', min: 10000001, max: Infinity, count: 0 }
		];

		// Contar ciudades en cada intervalo de población
		datajpraux4.forEach(function (city) {
			populationIntervals.forEach(function (interval) {
				if (city.population >= interval.min && city.population <= interval.max) {
					interval.count++;
				}
			});
		});

		// Crear la gráfica de barras
		am4core.ready(function () {
			// Configurar tema
			am4core.useTheme(am4themes_animated);

			// Crear el gráfico
			var chart = am4core.create('chart4', am4charts.XYChart);

			// Agregar datos
			chart.data = populationIntervals;

			// Configurar eje X
			var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = 'range';
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.title.text = 'Population Range';

			// Configurar eje Y
			var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.title.text = 'Number of Cities';

			// Crear series de columnas
			var series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = 'count';
			series.dataFields.categoryX = 'range';
			series.name = 'Number of Cities';
			series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/] cities';
			series.columns.template.fill = am4core.color('#74B266'); // Cambiar color de las columnas

			// Añadir etiquetas a las columnas
			var labelBullet = series.bullets.push(new am4charts.LabelBullet());
			labelBullet.label.text = '{valueY}';
			labelBullet.label.dy = -10; // Desplazamiento vertical del texto

			// Añadir título
			var title = chart.titles.create();
			title.text = 'Numero de ciudades por habitantes';
			title.fontSize = 20;
			title.marginBottom = 20;
		});
	}
</script>

<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.css"
	/>
	<script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/core.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/charts.js"></script>
	<script src="https://cdn.amcharts.com/lib/4/themes/animated.js"></script>
</svelte:head>
<div class="container-fluid">
	<h2>Comparacion de la inflaccion con el presupuesto neto</h2>
	<div id="chart"></div>
	<h2>Paises con covid que han estado en un fondo</h2>
	<div id="chart2"></div>
	<h2>Numero de citas por categorias</h2>
	<div id="chart3"></div>
	<br>
	<div id="chart4"></div>
</div>

<style>
	#chart4 {
		width: 800px;
		height: 600px;
		margin: auto;
	}
	#chart3 {
		width: 800px;
		height: 600px;
		margin: auto;
	}
	#chart2 {
		width: 800px;
		height: 600px;
		margin: auto;
	}
	#chart	 {
		width: 800px;
		height: 600px;
		margin: auto;
	}
</style>
