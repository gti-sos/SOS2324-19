
<svelte:head>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</svelte:head>

<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
    import { dev } from '$app/environment';

	let APIPHT = '/api/v2/eu-payment-info';
	let APIproxyPHT = '/proxyPHT';



	if (dev) {
		APIPHT = 'http://localhost:10000' + APIPHT;
		APIproxyPHT = 'http://localhost:10000' + APIproxyPHT;
	}

	let backendData = [];

    
	onMount(async () => {
		const apiData = await getAPIData();
		const backendData = await getBackendData();
		const apiData1 = await getAPIData1();
		const apiData2 = await getAPIData2();
        const apiData3= await getAPIData3();
		console.log(apiData);
		console.log(backendData);
        console.log(apiData3)

		createChart(apiData, backendData);
		createChart1(apiData1, backendData);
		createChart2(apiData2);
        createChart3(apiData3)
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


	async function getAPIData2() {
		let pais= "CA";
		let año=2022;
		const url = `https://api.api-ninjas.com/v1/holidays?country=${pais}&year=${año}`;
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

    async function getAPIData3() {
		const url = '/proxyPHT';
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



	//De integracion con mi backend
	
	function createChart(apiData, backendData) {
		const ctx = document.getElementById('chart').getContext('2d');

const filteredApiData = apiData.filter((apiItem) => {
	return backendData.some((backendItem) => backendItem.ms === apiItem.country_code);
});
console.log("Filtered API Data:", filteredApiData);

const matchingBackendData = backendData.filter((backendItem) => {
	return filteredApiData.some((apiItem) => apiItem.country_code === backendItem.ms);
});
console.log("Matching Backend Data:", matchingBackendData);

const netPreFinancingMap = {};
matchingBackendData.forEach((backendItem) => {
	netPreFinancingMap[backendItem.ms] = backendItem.net_pre_financing;
});
console.log("Net Pre Financing Map:", netPreFinancingMap);

const bankData = filteredApiData.map((item) => item.bank_name);
const netPreFinancingData = matchingBackendData.map((item) => netPreFinancingMap[item.ms] || 0);
console.log("Bank Data:", bankData);
console.log("Net Pre Financing Data:", netPreFinancingData);

const uniqueBankData = [...new Set(bankData)];

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
                text: 'Net Pre Financing por banco'
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




/*
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
	}*/


	function createChart1(apiData1, backendData) {
    // Filtrar solo los países que están presentes en ambos conjuntos de datos
    const countries = backendData.map(item => item.ms_name).filter(country => apiData1.some(data => data.name === country));

    // Filtrar los datos relevantes para los países seleccionados
    const filteredBackendData = backendData.filter(item => countries.includes(item.ms_name));
    const filteredApiData = apiData1.filter(item => countries.includes(item.name));

    // Preparar los datos para la gráfica
    const chartData = filteredBackendData.map(backendItem => {
        const apiItem = filteredApiData.find(apiDataItem => apiDataItem.name === backendItem.ms_name);
        return {
            country: backendItem.ms_name,
            net_pre_financing: backendItem.net_pre_financing,
            tourists: apiItem ? apiItem.tourists : null
        };
    });

    // Crear la gráfica de dispersión
    const ctx = document.getElementById('chart1').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Net Pre Financing vs Turistas',
                data: chartData.map(item => ({
                    x: item.tourists,
                    y: item.net_pre_financing,
                    country: item.country
                })),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]

        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tourists'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Net Pre Financing'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.raw.country}`
                    }
                }
            }
        }
    });
}



	function createChart2(apiData2) {
		console.log(apiData2)
    const holidayTypes = {};
    
    // Contar la cantidad de días festivos por tipo
    apiData2.forEach((holiday) => {
        const type = holiday.type;
        if (holidayTypes[type]) {
            holidayTypes[type]++;
        } else {
            holidayTypes[type] = 1;
        }
    });

    const ctx = document.getElementById('barChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(holidayTypes),
            datasets: [{
                label: 'Cantidad de Días Festivos por Tipo',
                data: Object.values(holidayTypes),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tipo de Día Festivo'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad de Días Festivos'
                    },
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function createChart3(apiData3) {
    const data = {
        datasets: [{
            label: 'Informacion del tiempo actual',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: [{
                x: 'Year',
                y: parseInt(apiData3.year)
            }, {
                x: 'Month',
                y: parseInt(apiData3.month)
            }, {
                x: 'Day',
                y: parseInt(apiData3.day)
            }, {
                x: 'Hour',
                y: parseInt(apiData3.hour)
            }, {
                x: 'Minute',
                y: parseInt(apiData3.minute)
            }, {
                x: 'Second',
                y: parseInt(apiData3.second)
            }]
        }]
    };

    const ctx = document.getElementById('chart3').getContext('2d');
    new Chart(ctx, {
        type: 'scatter', // Cambiar el tipo de gráfico a 'scatter'
        data: data,
        options: {
            scales: {
                x: {
                    type: 'category', // Configurar el eje x como tipo de categoría
                    labels: ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Second']
                },
                y: {
                    beginAtZero: true // Configurar el eje y para comenzar en cero
                }
            }
        }
    });
}


</script>



<div style="width: 400px; height: 400px;"><canvas id="chart" width="400" height="400"></canvas></div>
<div style="width: 550px; height: 550px;"><canvas id="chart1" width="550" height="550"></canvas></div>
<div id="barChartContainer" style="height: 600px; width: 100%;"><canvas id="barChart" width="600" height="600"></canvas></div>
<div  ><canvas id="chart3" width="400" height="200"></canvas></div>