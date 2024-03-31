<script>
    import { onMount } from "svelte";

    let API = "http:localhost:10000/api/v1/esif-payments";

    onMount( () => {
        getPayments();
    });

    async function getPayments() {
        let response = await fetch(API,
                        {
                            method: "GET"
                        });

        let data = await response.json();
        console.log(data);
    }

</script>