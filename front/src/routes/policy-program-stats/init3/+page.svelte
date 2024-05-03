<script>
    //@ts-nocheck
    import { onMount } from 'svelte';

    let p=[];
    onMount(async () => {
        p= await getData();
    });

    async function getData(){
        const url = 'https://tnd-exchange-rate.p.rapidapi.com/api';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'tnd-exchange-rate.p.rapidapi.com'
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
<ul>
    {#each Object.entries(p) as [currency, name]}
      <li>{currency}: {name}</li>
    {/each}
</ul>