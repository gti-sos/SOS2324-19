<script>
    //@ts-nocheck
    import { onMount } from 'svelte';

    let p=[];
    onMount(async () => {
        p= await getData();
        
    });

    async function getData(){
        const url = 'https://restaurant70.p.rapidapi.com/rest';
        const options = {
            method: 'GET',
            headers: {
    'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
    'X-RapidAPI-Host': 'restaurant70.p.rapidapi.com'
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

<!-- <ul>
    {#each p as product}
        <li>{product.id}: {product.name}</li>
    {/each}
</ul> -->