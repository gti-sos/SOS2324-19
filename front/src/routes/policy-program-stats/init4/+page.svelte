<script>
    //@ts-nocheck
    import { onMount } from 'svelte';

    let p=[];
    const sim = [
    {id: 882458, name: 'Bacon', category: ''},
    {id: 882460, name: 'Keyboard', category: ''},
    {id: 882461, name: 'Cheese', category: ''},
    {id: 882462, name: 'Sausages', category: ''},
    {id: 882464, name: 'Salad', category: ''},
    {id: 882465, name: 'Ball', category: ''},
    {id: 882466, name: 'Shirt', category: ''},
    {id: 882467, name: 'Chair', category: ''},
    {id: 882468, name: 'Towels', category: ''},
    {id: 882470, name: 'Mouse', category: ''}
];
    onMount(async () => {
        //p= await getData();
        p=sim;
    });

    async function getData(){
        const url = 'https://my-store2.p.rapidapi.com/catalog/products';
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'b33bd31facmshcb364f07dd53a09p1c4286jsnab336cf4924b',
                'X-RapidAPI-Host': 'my-store2.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            let result = await response.json();
            console.log(result.products);
            return result.products;
        } catch (error) {
            console.error(error);
        }
    }

</script>

<ul>
    {#each p as product}
        <li>{product.id}: {product.name}</li>
    {/each}
</ul>