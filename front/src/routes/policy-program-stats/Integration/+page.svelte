<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist"></script>
    <link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.css"
	/>
	<script src="https://cdn.jsdelivr.net/npm/chartist@0.11.4/dist/chartist.min.js"></script>


</svelte:head>
<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { Color, color } from 'highcharts';
	import { PassThrough } from 'stream';
	import { monitorEventLoopDelay } from 'perf_hooks';

    
	let APIAFI = `/api/v2/policy-program-stats`;

	let APIproxyAFI= '/proxyAFI';
    let optionsexportproxy1 = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
            'X-RapidAPI-Host': 'tnd-exchange-rate.p.rapidapi.com'
        }
    };
	let APIexport1='https://currency-converter241.p.rapidapi.com/all';
	let optionsexport1= {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com'
            }
        };
    let APIexport2=`https://my-store2.p.rapidapi.com/catalog/products`;
    let optionsexport2 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'my-store2.p.rapidapi.com'
            }
        };
        let APIexport3='https://restaurant70.p.rapidapi.com/rest';
        let optionsexport3 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'restaurant70.p.rapidapi.com'
            }
        };
    
    let dataAFI = [];
	let dataproxyAFI = [];
	let dataexportafi2=[];
    let dataexportafi3=[];
	let dataexportafi1=[];
    if (dev) {
		APIAFI='http://localhost:10000' + APIAFI;
		APIproxyAFI= 'http://localhost:10000' + APIproxyAFI;
	}
    onMount(async () => {
		await getData();
		AFI();
        AFI2();
        AFI1();
        AFI3();
        //AFI4();
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
		dataAFI = await fetchData(APIAFI);
		dataproxyAFI = await fetchData2(APIproxyAFI,optionsexportproxy1);
		dataexportafi2 = await fetchData2(APIexport2,optionsexport2);
		dataexportafi1 = await fetchData2(APIexport1,optionsexport1);
        //dataexportafi3=await fetchData2(APIexport3,optionsexport3);
	}

    function AFI() {
        console.log(dataAFI);
        //console.log(dataproxyAFI);
        //console.log(dataexportafi2);
        //console.log(dataexportafi1);
        console.log(dataexportafi3);
        
    }
    function AFI1() {
        const combined = [];
        dataAFI.forEach(entry => {
        const country = entry.country;
        if (!combined[country]) {
            combined[country] = {
            name: country,
            total_amount_paid_to_fi: 0,
            };
        }
        combined[country].total_amount_paid_to_fi += entry.total_amount_paid_to_fi || 0;
        });

        console.log(combined);

        const combinedData = [];

        // Agregar los valores totales por país
        Object.entries(combined).forEach(([country, data]) => {
        const total_amount = data.total_amount_paid_to_fi;
        Object.entries(dataproxyAFI).forEach(([currency, value]) => {
            const newValue = total_amount / value;
            combinedData.push({
            country: country,
            moneda: currency,
            value: newValue
            });
        });
        });

        console.log(combinedData);

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
                    data: combinedData.map(c => c.value)
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
                        categories: combinedData.map(j=>j.moneda)
                    }
                };

                var chart = new ApexCharts(document.getElementById('afi1'), options);

                chart.render();
    }
    function AFI2() {
        const combined = [];
        dataAFI.forEach(entry => {
        const country = entry.country;
        if (!combined[country]) {
            combined[country] = {
            name: country,
            esif_amount_committed_to_fi: 0,
            };
        }
        combined[country].esif_amount_committed_to_fi += entry.esif_amount_committed_to_fi || 0;
        });

        const combinedData = [];

        // Agregar los valores totales por país
        Object.entries(combined).forEach(([country, data]) => {
        const total_amount = data.esif_amount_committed_to_fi;
        
        // Iterar sobre cada producto en dataexportafi2.products
        dataexportafi2.products.forEach(product => {
            const newValue = total_amount / (dataexportafi2.summary.count/product.id);
            combinedData.push({
                country: country,
                id: product.id,
                name: product.name,
                value: newValue
            });
        });
    });
    const ctx = document.getElementById('afi2');
    const myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
			labels:combinedData.map(c=>c.name),
            datasets: [
                {
                    label: 'policy-program-stats',
                    data: combinedData.map(c => parseInt(c.value)),
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
                },
                /*{
                    label: 'structural-investment-data',
                    data: countryData.map(d => parseInt(d.cumulative_initial_pre_financing)/100),
                    backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
                }*/
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
    function AFI3(){
        const combined = [];
        dataAFI.forEach(entry => {
        const country = entry.country;
        if (!combined[country]) {
            combined[country] = {
            name: country,
            esif_amount_paid_to_fi: 0,
            };
        }
        combined[country].esif_amount_paid_to_fi += entry.esif_amount_paid_to_fi || 0;
        });

        const combinedData = [];
        console.log(combined);
        Object.entries(combined).forEach(([country, entry]) => {
        const total_amount = entry.esif_amount_paid_to_fi;
        Object.entries(dataexportafi1.names).forEach(([ms, name]) => {
            const rate = dataexportafi1.rates[ms];
            const value = rate ? rate.from / rate.to : 0; 
            // Calcula el valor usando el tipo de cambio
            let total_amountt=0;
            if(country==="AT"){
                total_amountt=total_amount/23000000;
            }else{
                total_amountt=total_amount/5000000
            }
            combinedData.push({
                country: country,
                esif_amount_paid_to_fi: total_amountt,
                ms: ms,
                name: name,
                value: value
            });
        });
    });

    console.log(combinedData);
    const first20Data = combinedData.slice(0, 20);
    // Mostrar los últimos 20 elementos
    const last20Data = combinedData.slice(-20);

    // Concatenar los dos subconjuntos de datos
    const res = first20Data.concat(last20Data);
    
    var options = {
                    chart: {
                        height: 400,
                        type: "radar"
                    },fill: {
                        opacity: 0.5,
                        colors: []
                    },stroke: {
                        show: true,
                        width: 2,
                        colors: [],
                        dashArray: 0
                    },plotOptions: {
                        radar: {
                        polygons: {
                            strokeColor: '#e8e8e8',
                            fill: {
                                colors: ['#f8f8f8', '#fff']
                            }
                        }
                        }
                    },xaxis: {
                        categories: res.map(c=>c.country),
                        labels: {
                        show: true,
                        style: {
                            colors: ["#a8a8a8"],
                            fontSize: "11px",
                            fontFamily: 'Arial'
                        }
                        }
                    },markers: {
                        size: 5,
                        hover: {
                        size: 10
                        }
                    },
                        series: [
                            {
                            name: "Valor front/to",
                            data:res.map(c=>c.value)
                            },
                            {
                            name: "Valor esif_amount_paid_to_fi",
                            data: res.map(c=>c.esif_amount_paid_to_fi)
                            }
                        ],
                        labels: res.map(c=>c.ms)
                };

                var chart = new ApexCharts(document.getElementById('afi3'), options);

                chart.render();
    
    }
    /*
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
function AFI3() {
	console.log(dataexportafi1);

	let datarates=dataexportafi1.rates;
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
				rate: 0
			};
		}
		combinedData[country].rate += entry.total_amount_paid_to_fi/10000000 || 0;
	});


	let mergedList = [];

    // Iterar sobre las claves del objeto names
    for (let currency in dataexportafi1.names) {
        if (dataexportafi1.names.hasOwnProperty(currency)) {
            let currencyName = dataexportafi1.names[currency];
            let currencyRates = dataexportafi1.rates[currency];

            // Verificar si hay tasas de cambio para la moneda actual
            if (currencyRates) {
                let rate1 = currencyRates.from;
				let rate2 = currencyRates.to; // Puedes usar "to" si prefieres

                // Añadir el par (nombre, tasa) a la lista fusionada
                mergedList.push({ country: currency, moneda: currencyName, rate: rate1+rate2 });
            }
        }
    }

	mergedList.forEach(entry => {
          const country = entry.country;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  total_amount_paid_to_fi: 0,
                  rate:0
              };
          }
          combinedData[country].rate += entry.rate || 0;
      });
	countryData = Object.values(combinedData);
	console.log(countryData);

	new Chartist.Bar('#chart1', {
			labels: countryData.map(c=>c.country),
			series: 
			countryData.map(p =>p.rate)
			}, {
			seriesBarDistance: 10,
			reverseData: true,
			horizontalBars: true,
			axisY: {
				offset: 70
			}
			});

}

function RSG1() {
    const scatterData = dataproxyRSG.map(car => ({
        x: car.year,
        y: car.city_mpg, 
        name: `${car.make} ${car.model}`, 
        marker: {
            symbol: 'circle',
            radius: 5 
        }
    })).concat(dataRSG.map(test => ({
        x: test.year_week,
        y: test.new_cases, 
        name: test.country,
        marker: {
            symbol: 'square', 
            radius: 5 
        }
    })));

    const options = {
        chart: {
            height: 280,
            type: "scatter"
        },
        series: [{
            name: 'Cars City MPG',
            data: scatterData
        }],
        xaxis: {
            type: "category"
        },
        markers: {
            size: 6 
        }
    };

    const chart = new ApexCharts(document.getElementById('rsg1'), options);
    chart.render();
}*/

</script>
<div class="container-fluid">
	<h2>Cantidad monetaria pagada al fondo por pais y kilometros recorridos por millones de pasajeros clasificados por año</h2>
	<h2>API cars-by-motor Y API policy-program-stats</h2>
	<div id="afi1"></div>
	<h2>Cantidad monetaria pagada a un fondo y la cantidad total acumulada pagada a un fondo clasificado por paises</h2>
	<h2>API structural-investment-data Y API policy-program-stats</h2>
	<div id="char">
		<canvas id="afi2" width="400" height="100"></canvas>
	</div>
    <div id="afi3"></div>
	<div class="ct-chart ct-golden-section" id="chart1">
		<style>
			.nm {
			  width: 100%;
			  height: 300px;
			}
		  </style>
	</div>
</div>