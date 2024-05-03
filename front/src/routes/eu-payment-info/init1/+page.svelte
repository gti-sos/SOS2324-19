<script>
	//@ts-nocheck
	import { onMount } from 'svelte';

	let holidays = [];
	const APIPHT = 'http://localhost:10000/api/v2/eu-payment-info';
	let backendData = [];

	onMount(async () => {
		const apiData = await getAPIData();
		const backendData = await getBackendData();
		const apiData1 = await getAPIData1();
		console.log(apiData);
		console.log(backendData);

		createChart(apiData, backendData);
		createChart1(apiData1, backendData);
	});

	async function getAPIData() {
		let bank = 'Santander';
		const url = `https://api.api-ninjas.com/v1/swiftcode?bank=${bank}`;
		const options = {
			method: 'GET',
			headers: {
				'X-Api-Key': 'VJ61uOuNsJFEJA9Q6GHhLQ==SPEs9ghWIyBuN369'
			}
		};

		try {
			const response = await fetch(url, options);
			let result = await response.json();

			// Limitar los resultados a 20
			result = result.slice(7, 91);

			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async function getAPIData1() {
		const url = 'https://api.api-ninjas.com/v1/country?name=Spain';
		const options = {
			method: 'GET',
			headers: {
				'X-Api-Key': 'VJ61uOuNsJFEJA9Q6GHhLQ==SPEs9ghWIyBuN369'
			}
		};

		try {
			const response = await fetch(url, options);
			const result = await response.json();
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async function getBackendData() {
		try {
			const response = await fetch(APIPHT);
			backendData = await response.json();

			return backendData;
		} catch (error) {
			console.error(error);
		}
	}

	function createChart(apiData, backendData) {
		const ctx = document.getElementById('chart').getContext('2d');

// Filtrar los países de la API externa que coinciden con los del backend
const filteredApiData = apiData.filter((apiItem) => {
	return backendData.some((backendItem) => backendItem.ms === apiItem.country_code);
});
console.log("Filtered API Data:", filteredApiData);

// Obtener los países del backend que coinciden con los de la API externa
const matchingBackendData = backendData.filter((backendItem) => {
	return filteredApiData.some((apiItem) => apiItem.country_code === backendItem.ms);
});
console.log("Matching Backend Data:", matchingBackendData);

// Crear un objeto que mapee el country_code al net_pre_financing del backend
const netPreFinancingMap = {};
matchingBackendData.forEach((backendItem) => {
	netPreFinancingMap[backendItem.ms] = backendItem.net_pre_financing;
});
console.log("Net Pre Financing Map:", netPreFinancingMap);

// Preparar los datos para la gráfica
const bankData = filteredApiData.map((item) => item.bank_name);
const netPreFinancingData = matchingBackendData.map((item) => netPreFinancingMap[item.ms] || 0);
console.log("Bank Data:", bankData);
console.log("Net Pre Financing Data:", netPreFinancingData);

const uniqueBankData = [...new Set(bankData)];

// Crear la gráfica
new Chart(ctx, {
    type: 'pie',
    data: {
        labels: uniqueBankData,
        datasets: [{
            label: 'Net Pre Financing',
            data: netPreFinancingData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Net Pre Financing by Bank'
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.labels[tooltipItem.index] || '';
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] * 100) / 100;
                        return label;
                    }
                }
            }
        }
    }
});
}


	function createChart1(apiData1, backendData) {
		const chartData = backendData.map((item) => {
			const apiInfo = apiData1.find((apiItem) => apiItem.name === 'Spain');
			return {
				country: 'Spain',
				gdp_growth: apiInfo ? apiInfo.gdp_growth : null,
				eu_payment_rate_init_plan_eu_amt: item.eu_payment_rate_init_plan_eu_amt
			};
		});

		const options = {
			chart: {
				type: 'scatter'
			},
			series: [
				{
					name: 'GDP Growth',
					data: chartData.map((item) => ({
						x: item.country,
						y: item.gdp_growth
					}))
				},
				{
					name: 'EU Payment Rate Actual Plan EU Amt',
					data: chartData.map((item) => ({
						x: item.country,
						y: item.eu_payment_rate_init_plan_eu_amt
					}))
				}
			],
			xaxis: {
				type: 'category',
				labels: {
					rotate: -45,
					rotateAlways: true
				},
				title: {
					text: 'Países'
				}
			},
			yaxis: {
				title: {
					text: 'Valor'
				}
			},
			tooltip: {
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					const data = chartData[dataPointIndex];
					return `<div class="arrow_box">${series[seriesIndex]}: ${data[seriesIndex === 0 ? 'gdp_growth' : 'eu_payment_rate_actual_plan_eu_amt']}</div>`;
				}
			}
		};

		const chart = new ApexCharts(document.querySelector('#chart1'), options);
		chart.render();
	}
</script>

<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div style="width: 400px; height: 400px;"><canvas id="chart" width="400" height="400"></canvas></div>
<div id="chart1" style="width: 550px; height: 550px;"></div>