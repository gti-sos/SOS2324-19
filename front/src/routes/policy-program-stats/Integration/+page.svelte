<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chartist"></script>
    <script src="https://cdn.canvasjs.com/canvasjs.min.js"></script>
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
        AFI1();
        AFI2();
        AFI3();
        AFI4();
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
		dataexportafi1 = await fetchData2(APIexport1,optionsexport1);
        dataexportafi2 = await fetchData2(APIexport2,optionsexport2);
        dataexportafi3=await fetchData2(APIexport3,optionsexport3);
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
        const tiposfi_name = [...new Set(combinedData.map(c=>c.country))];
                var options = {
                    chart: {
                        height: 280,
                        type: "area"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    
                    series:tiposfi_name.map(c=>({
                        name:c,
                        data: combinedData.filter(j=>j.country===c).map(k => k.value)
                    })),
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
            too: entry.too,
            };
        }
       // combined[country].too += entry.too || 0;
        });

        const combinedData = [];
        console.log(combined)
        // Agregar los valores totales por país
        Object.entries(combined).forEach(([country, data]) => {
        const total_amount = data.too;
        
        // Iterar sobre cada producto en dataexportafi2.products
        dataexportafi2.products.forEach(product => {
            const ja=product.id%882400;
            const newValue = ja/total_amount;
            combinedData.push({
                country: country,
                id: ja,
                name: product.name,
                value: newValue
            });
        });
    });

    console.log(combinedData);
    const tiposfi_name = [...new Set(combinedData.map(c=>c.name))];
    const tipos = [...new Set(combinedData.map(c=>c.country))];
    const ctx = document.getElementById('afi2');

    const myChart = new Chart(ctx, {
        height: 280,
        type: 'polarArea',
        data: {
			labels:tiposfi_name,
            datasets:tipos.map(k=> ({
                label:k,
                data:combinedData.filter(p=>p.country===k).map(i=> parseInt(i.value)),
                backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
            }))
            /*[{
                label:[...new Set(combinedData.map(c=>c.country))],
                data: combinedData.map(k=> parseInt(k.value)),
                backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(75, 192, 192)',
						'rgb(255, 205, 86)',
						'rgb(201, 203, 207)',
						'rgb(54, 162, 235)'
						]
            }
            ]*/
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
            too:entry.too,
            esif_amount_paid_to_fi: entry.esif_amount_paid_to_fi,
            };
        }
        combined[country].esif_amount_paid_to_fi += entry.esif_amount_paid_to_fi || 0;
        combined[country].too += entry.too || 0;
        });
        console.log(dataexportafi1)
        const combinedData = [];
        console.log(combined);
        Object.entries(combined).forEach(([country,entry]) => {
        const total_amount = entry.esif_amount_paid_to_fi;
        Object.entries(dataexportafi1.names).forEach(([ms, name]) => {
            const rate = dataexportafi1.rates[ms];
            const value = rate ? rate.from * rate.to : 0; 
            combinedData.push({
                country: country,
                esif_amount_paid_to_fi: total_amount,
                too:entry.too,
                ms: ms,
                name: name,
                value: value
            });
        });
    });

    console.log(combinedData);
    var chart = new CanvasJS.Chart("afi33", {
	animationEnabled: true,
	zoomEnabled: true,
	theme: "light2",
	title:{
		text:"Numero de destinos, cantidad monetaria pagado al fondo y ratio from y to de por cada moneda y pais"
	},
	axisX: {
		title:"From y too ratio",
		minimum: 0,
		maximum: 3,
		gridThickness: 1
	},
	axisY:{
		title: "Numero de destinos del fondo",
		suffix: "und"
	},
	data: [{
		type: "bubble",
		toolTipContent: "<b>{name}</b><br/>Ratio from y to: {x} <br/> Nº destinos: {y}und sq. km<br/> Cantidad monetaria: {z}$",
		dataPoints: combinedData.map(g=>({
            x:g.value,
            y:g.too,
            z:g.esif_amount_paid_to_fi,
            name:g.name+" ("+g.ms+") "+g.country
        }))
	}]
});
chart.render();

    
    }
    function AFI4(){
        const combined = [];
        dataAFI.forEach(entry => {
        const country = entry.country;
        if (!combined[country]) {
            combined[country] = {
            name: country,
            too: entry.too,
            };
        }
        combined[country].too += entry.too || 0;
        });

        const combinedData = [];
        console.log(combined);
        Object.entries(combined).forEach(([country, entry]) => {
        Object.entries(dataexportafi3.data).forEach(([ms, n]) => {
            combinedData.push({
                country: country,
                too: entry.too/10,
                id: parseInt(n.id),
                name: n.first_name,
            });
        });
    });
    console.log(combinedData);
    var chart = new CanvasJS.Chart("afi4", {
            exportEnabled: true,
            animationEnabled: true,
            title:{
                text: "Nombre y id de la persona y pais y destinos"
            },
            subtitles: [{
                text: "Integracion con Api externa 4"
            }], 
            axisX: {
                title: "Nombres y Paises"
            },
            axisY: {
                title: "too",
                titleFontColor: "#4F81BC",
                lineColor: "#4F81BC",
                labelFontColor: "#4F81BC",
                tickColor: "#4F81BC",
                includeZero: true
            },
            axisY2: {
                title: "id",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E",
                includeZero: true
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: [{
                type: "column",
                name: "too",
                showInLegend: true,      
                yValueFormatString: "#,##0.#",
                dataPoints: combinedData.map(c=>({
                    label:c.country+" "+c.name,
                    y:c.too
                }))
            },
            {
                type: "column",
                name: "id",
                axisYType: "secondary",
                showInLegend: true,
                yValueFormatString: "#,##0.#",
                dataPoints: combinedData.map(c=>({
                    label:c.country+" "+c.name,
                    y:c.id
                }))
            }]
        });
        chart.render();
    }
    function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}

</script>
<div class="container-fluid">
    <h2>API externa 1 con proxy</h2>
	<h2>Cantidad monetaria pagada al fondo entre el valor de cada moneda clasificado por pais</h2>
	<div id="afi1"></div>
    <h2>Api externa 2 sin proxy </h2>
	<h2>Id de cada producto clasificado por el numero de destinos, mostrando el nombre de cada producto y su pais</h2>
	<div id="char">
		<canvas id="afi2" width="200" height="200"></canvas>
	</div>
    <h2>Api externa 3</h2>
    <div id="afi33" style="height: 300px; width: 100%;"></div>
    <h2>Api externa 4</h2>
    <div id="afi4" style="height: 300px; width: 100%;"></div>
</div>