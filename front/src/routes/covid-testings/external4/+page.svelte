<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let APIRSG = `/api/v2/covid-testings`;
    let APIRSG1 = `https://api.api-ninjas.com/v1/interestrate?country=United Kingdom`;

    // Si estás en modo desarrollo, cambia las URLs de la API
    if (dev) {
      APIRSG = 'http://localhost:10000' + APIRSG;
    }

    let covidData = [];
    let interestRateData = [];

    onMount(async () => {
      try {
        await fetchData();
        drawChart();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    async function fetchData() {
      const covidResponse = await getData(APIRSG);
      const interestRateResponse = await getDataWithApiKey(APIRSG1);

      // Procesamiento de datos de COVID
      covidData = covidResponse
        .filter((data) => data.year_week.startsWith('2021'))
        .map((d) => ({
          year: parseInt(d.year_week.split('-')[0]),
          new_cases: d.new_cases
        }))
        .sort((a, b) => a.year - b.year);

      // Procesamiento de datos de tasas de interés
      interestRateData = interestRateResponse
        .filter((data) => data.last_updated.startsWith('2021'))
        .map((d) => ({
          year: new Date(d.last_updated).getFullYear(),
          rate_pct: d.rate_pct
        }))
        .sort((a, b) => a.year - b.year);
    }

    async function getData(url) {
      try {
        const res = await fetch(url);
        return await res.json();
      } catch (error) {
        console.log(`Error fetching data from ${url}: ${error}`);
        return [];
      }
    }

    async function getDataWithApiKey(url) {
      try {
        const response = await fetch(url, {
          headers: {
            'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk'
          }
        });
        return await response.json();
      } catch (error) {
        console.error(`Error fetching data from ${url}: ${error}`);
        return [];
      }
    }

    function drawChart() {
      // Dibujar el gráfico de dispersión
      const margin = { top: 20, right: 30, bottom: 30, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select('#scatterplot-container')
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

      // Escalas para los datos de COVID
      const x1 = d3.scaleLinear().domain(d3.extent(covidData, d => d.year)).range([0, width]);
      const y1 = d3.scaleLinear().domain(d3.extent(covidData, d => d.new_cases)).range([height, 0]);

      // Escalas para los datos de tasas de interés
      const y2 = d3.scaleLinear().domain(d3.extent(interestRateData, d => d.rate_pct)).range([height, 0]);

      // Ejes
      const xAxis = d3.axisBottom(x1);
      const yAxis1 = d3.axisLeft(y1).ticks(5);
      const yAxis2 = d3.axisRight(y2).ticks(5);

      svg.append('g')
         .attr('transform', `translate(0,${height})`)
         .call(xAxis);

      svg.append('g')
         .call(yAxis1);

      svg.append('g')
         .attr('transform', `translate(${width},0)`)
         .call(yAxis2);

      // Puntos de datos para los nuevos casos de COVID-19
      svg.selectAll('.covid-circle')
         .data(covidData)
         .enter()
         .append('circle')
         .attr('class', 'covid-circle')
         .attr('cx', d => x1(d.year))
         .attr('cy', d => y1(d.new_cases))
         .attr('r', 5)
         .style('fill', 'steelblue')
         .style('opacity', 0.7)
         .append('title')
         .text(d => `Year: ${d.year}, New Cases: ${d.new_cases}`);

      // Línea para las tasas de interés
      const line = d3.line()
                     .x(d => x1(d.year))
                     .y(d => y2(d.rate_pct));

      svg.append('path')
         .datum(interestRateData)
         .attr('fill', 'none')
         .attr('stroke', 'red')
         .attr('stroke-width', 2)
         .attr('d', line);
    }
</script>

<svelte:head>
    <script src="https://d3js.org/d3.v7.min.js"></script>
</svelte:head>

<div id="scatterplot-container"></div>
