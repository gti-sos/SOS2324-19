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
