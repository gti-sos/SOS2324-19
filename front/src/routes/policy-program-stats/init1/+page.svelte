<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let player = [];
    onMount(async () => {
        player = await getData();
 
    });

    
  
   async function getData(){
        const url = 'https://currency-converter241.p.rapidapi.com/all';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            let result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    function AFI1(dataAFI,dataexportfi) {
      
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

</script>

{#if player.success}
  <ul>
    {#each Object.entries(player.names) as [currency, name]}
      <li>{currency}: {name}</li>
    {/each}
  </ul>

  <ul>
    {#each Object.entries(player.rates) as [currency, rate]}
      <li>{currency}: {rate.from}   {rate.to}</li>
    {/each}
  </ul>
{/if}
