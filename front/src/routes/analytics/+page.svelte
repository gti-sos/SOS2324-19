<svelte:head>

  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/modules/exporting.js"></script>
  <script src="https://code.highcharts.com/modules/export-data.js"></script>
  <script src="https://code.highcharts.com/modules/accessibility.js"></script>

</svelte:head>

<script>

  import { onMount } from 'svelte';

  // Define las URLs de las tres APIs
  let API_AFI="https://sos2324-19.appspot.com/api/v2/policy-program-stats";
  let API_PHT="https://sos2324-19.appspot.com/api/v2/eu-payment-info";
  let API_RSG="https://sos2324-19.appspot.com/api/v2/covid-testings";
  let API_JPR="https://sos2324-19.appspot.com/api/v2/esif-payments";

  let countryData = [];

  // Función para obtener datos 
  async function fetchData(url) {
    try{
            const res = await fetch(url);
            const dat = await res.json();
            return dat;
    }catch(error){
         console.log(`Error fetching data: ${error}`);
    }
    
  }

  // Función para procesar los datos de las tres fuentes de datos
  async function processCountryData() {

      const data1 = await fetchData(API_AFI);
      console.log(data1)
      const data2 = await fetchData(API_PHT);
      console.log(data2)
      const data3 = await fetchData(API_RSG);
      console.log(data3)
      const data4 = await fetchData(API_JPR);
      console.log(data4)

      // Combinar los datos de las tres fuentes
      const combinedData = {};

      // Procesar datos de la primera fuente
      data1.forEach(entry => {
          const country = entry.country;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  esif_amount_committed_to_fi: 0,
                  total_net_payment: 0,
                  total_net_payments:0,
                  population:0
              };
          }
          combinedData[country].esif_amount_committed_to_fi += entry.esif_amount_committed_to_fi || 0;
      });

      // Procesar datos de la segunda fuente
      data2.forEach(entry => {
          const country = entry.ms;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  esif_amount_committed_to_fi: 0,
                  total_net_payment: 0,
                  total_net_payments:0,
                  population:0
              };
          }
          combinedData[country].total_net_payment += entry.total_net_payment || 0;
      });

      // Procesar datos de la tercera fuente
      data3.forEach(entry => {
          const country = entry.country_code;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  esif_amount_committed_to_fi: 0,
                  total_net_payment: 0,
                  total_net_payments:0,
                  population:0
              };
          }
          combinedData[country].population += entry.population || 0;
      });

      data4.forEach(entry => {
          const country = entry.ms;
          if (!combinedData[country]) {
              combinedData[country] = {
                  name: country,
                  esif_amount_committed_to_fi: 0,
                  total_net_payment: 0,
                  total_net_payments:0,
                  population:0
              };
          }
          combinedData[country].total_net_payments += entry.total_net_payments || 0;
      });

    }
  // Función para crear el gráfico
  function createChart() {

      Highcharts.chart('chart-container', {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Datos de los países'
          },
          xAxis: {
              title: {
                  text: 'País'
              },
              categories: countryData.map(country => country.name)
          },
          yAxis: [{
              title: {
                  text: 'esif_amount_committed_to_fi'
              }
          }, {
              title: {
                  text: 'total_net_payment'
              },
              opposite: true
          }, {
              title: {
                  text: 'total_net_payments'
              },
              opposite: true
          }, {
              title: {
                  text: 'population'
              },
              opposite: true
          }],
          series: [{
              name: 'esif_amount_committed_to_fi',
              data: countryData.map(country => country.esif_amount_committed_to_fi)
          }, {
              name: 'total_net_payment',
              data: countryData.map(country => country.total_net_payment),
              yAxis: 1
          }, {
              name: 'total_net_payments',
              data: countryData.map(country => country.total_net_payments),
              yAxis: 2
          }, {
              name: 'population',
              data: countryData.map(country => country.population),
              yAxis: 3
          }]
      });

  }

  onMount(async () => {

    try {
      await processCountryData();
      createChart();

    } catch (error) {
      console.error('Error al obtener datos o crear el gráfico:', error);
    }

  });

</script>

<style>

  #chart-container {
  width: 100%; 
  max-width: 1000px; 
  margin: 0 auto; 
  }

</style>

<div id="chart-container"></div>