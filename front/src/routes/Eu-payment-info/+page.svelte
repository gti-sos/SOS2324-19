<script>
    import {onMount} from "svelte";



    let API_PHT="http://localhost:10000/api/v2/eu-payment-info/";
    let payment=[];

    onMount(()=>{

      getPaymentInfo();

    })

    async function getPaymentInfo(){
        let response= await fetch(API_PHT,{
            method:"GET"
        });

        let data = await response.json();
        payment=data;
        console.log(data);
    }




</script>

<ul>
    {#each payment as payment}
    <li>payment.cci</li>
    {/each}
   

</ul>