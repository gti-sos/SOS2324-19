<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let player = [];

    onMount(async () => {
        player = await getData();
    });

    
    async function getData(){
        const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/categories';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
            return []; // Devuelve una lista vacía en caso de error
        }
    }
</script>

<ul id="miLista">
    {#if Array.isArray(player)}
        {#each player as joke}
            <li>{joke}</li>
        {/each}
    {:else}
        <li>Cargando...</li>
    {/if}
</ul>