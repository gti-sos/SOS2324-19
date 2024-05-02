<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    
    let cars = [];

    onMount(async () => {
        cars = await getData();
    });

    async function getData(){
        const url = 'https://api.api-ninjas.com/v1/cars';
        const options = {
            method: 'GET',
            headers: {
                'X-Api-Key': '+05AagkdJHHc3FZiAo0tEw==6JuQ0BNbd1SfqZsk',
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

    {#each cars as x}
        <li>{x.make}</li>
    {/each}
</ul>


    