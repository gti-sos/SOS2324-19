<script>
    import { onMount } from 'svelte';
    let products = [];
  
    onMount(async () => {
      try {
        products = await getData();
        if (products && products.length > 0) {
          createRadarBarChart(products);
        } else {
          console.error('No hay productos para mostrar');
        }
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    });
  
    async function getData() {
      const url = 'https://real-time-amazon-data.p.rapidapi.com/search';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'e20b1471cemsh05c3472abd0fee3p19865ejsn3912bd863cc9',
          'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
        }
      };
  
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        if (result && result.data && result.data.products) {
          return result.data.products;
        } else {
          throw new Error('No se encontraron productos en la respuesta de la API');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud a la API:', error);
        throw error;
      }
    }
  
    function createRadarBarChart(products) {
      const labels = products.map(product => product.title);
      const prices = products.map(product => product.price);
  
      const ctx = document.getElementById('radarBarChart').getContext('2d');
      new Chart(ctx, {
        type: 'radarBar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Precios',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: prices
          }]
        },
        options: {
          scale: {
            ticks: {
              beginAtZero: true
            }
          }
        }
      });
    }
  </script>
  
  {#if products.length > 0}
    <ul>
      {#each products as product}
        <li>{product.title}: {product.price}</li>
      {/each}
    </ul>
  {/if}
  
  <canvas id="radarBarChart" width="400" height="400"></canvas>
  