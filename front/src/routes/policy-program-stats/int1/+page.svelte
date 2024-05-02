<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let player = [];

    onMount(async () => {
        player = await getData();
    });

    
    async function getData(){
        const url = 'https://currency-exchange.p.rapidapi.com/listquotes';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            let result = await response.json();
            console.log(result);
            return result.leaderboardRows;
        } catch (error) {
            console.error(error);
        }
    }
   
</script>

<ul>

    {#each player as x}
        <li>{x.name}</li>
    {/each}
</ul>