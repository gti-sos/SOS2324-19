<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/pyramid.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    import Highcharts from 'highcharts';
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    onMount(() => {
            InitialData();
            getData();
    });

    // Si pongo Number.MAX_VALUE da error
    const TOP = 9999999999999999999;
    //let API = `/api/v2/esif-payments?limit=${TOP}`;
	let API = `/api/v2/esif-payments`;

    // Si estamos en un entorno de desarrollo, apuntamos a la URL local
    if (dev) API = 'http://localhost:10000' + API;

    async function InitialData() {
        // Obtener datos iniciales del servidor
        let response = await fetch(API + "/loadInitialData", {
            method: "GET",
        });
        // Verificar el estado de la respuesta
        let status = await response.status;
        if (status === 200) {
            // Si la respuesta es exitosa, obtener los datos completos
            await getData();
        }
    }

    async function getData() {
        try {
			API = API + `?limit=${TOP}`
            const res = await fetch(API);
            const data = await res.json();
            if (data.length > 0) {
                // Llamamos a las funciones después de asegurarnos de que los contenedores existen
                barGraph(data);
                pieGraph(data);
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    function barGraph(data) {
        // Extraer años y países únicos de los datos
        const years = [...new Set(data.map((item) => item.year))];
        const countries = [...new Set(data.map((item) => item.ms_name))];

        // Generar datos de series para el gráfico de barras
        const seriesData = countries.map((country) => ({
            name: country,
            data: years.map((year) => {
                const item = data.find((d) => d.ms_name === country && d.year === year);
                return item ? parseFloat(item.cumulative_initial_pre_financing) : 0;
            })
        }));

        // Configurar el gráfico de barras
        Highcharts.chart('container-bar', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Cantidad de financiación inicial de cada país cada año',
                align: 'left'
            },
            xAxis: {
                categories: years.map(String),
                title: {
                    text: null
                },
                gridLineWidth: 1,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Cantidad de financiación inicial',
                    align: 'high'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y} €'
            },
            plotOptions: {
                bar: {
                    borderRadius: '50%',
                    dataLabels: {
                        enabled: true
                    },
                    groupPadding: 0.1
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: seriesData
        });
    }

    function pieGraph(data) {
        const fundData = {};

        data.forEach((item) => {
            if (fundData[item.fund]) {
                fundData[item.fund] += parseFloat(item.net_planned_eu_amount);
            } else {
                fundData[item.fund] = parseFloat(item.net_planned_eu_amount);
            }
        });

        const regionsData = Object.keys(fundData).map((fund) => ({
            name: fund,
            y: fundData[fund]
        }));

        Highcharts.chart('container-pie', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Net Planned EU Amount by Region'
            },
            tooltip: {
                valueSuffix: ' €'
            },
            subtitle: {
                text: 'Source: <a href="https://your-source-url.com" target="_blank">Your Source</a>'
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: [{
                        enabled: true,
                        distance: 20
                    }, {
                        enabled: true,
                        distance: -40,
                        format: '{point.y}',
                        style: {
                            fontSize: '1.2em',
                            textOutline: 'none',
                            opacity: 0.7
                        },
                        filter: {
                            operator: '>',
                            property: 'percentage',
                            value: 10
                        }
                    }]
                }
            },
            series: [{
                name: 'Cantidad',
                colorByPoint: true,
                data: regionsData
            }]
        });
    }
</script>

<div id="container-bar"></div>
<br />
<div id="container-pie"></div>
