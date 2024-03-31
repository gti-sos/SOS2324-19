<script>
    

    import {onMount} from "svelte";
    import {dev} from "$app/environment";
    

    let API = "http://localhost:10000/api/v2/eu-payment-info";
   
    let errorMsg = "";
    let Msg = ""; 
    let payment=[];
    let newDato=
    {
        ms: 'DE',
        ms_name: 'Germany',
        cci: '2024DE987654321',
        title: 'Bavaria - Innovation and Entrepreneurship',
        fund: 'EAFRD',
        category_of_region: 'More developed',
        year: 2024,
        init_plan_eu_amt_1_adoption: 55000000,
        transfers: 0,
        actual_plan_eu_amt_latest_adop: 55000000,
        pre_fin: 1375000,
        recovery_of_pre_financing: 0,
        net_pre_financing: 1375000,
        interim_payments: 6500000,
        recovery_of_expenses: 0,
        net_interim_payments: 6500000,
        total_net_payments: 7875000,
        eu_payment_rate_init_plan_eu_amt: 0.025,
        eu_payment_rate_actual_plan_eu_amt: 0.025
    };

    onMount(()=>{

      getPaymentInfo();

    })

    
    async function getInitial(){
        try{
            

                let response = await fetch(API+"/loadInitialData",{
                                      method: "GET"
                });

                if(response.ok){
                    getPaymentInfo();
                    errorMsg = "Datos cargados correctamente";
                } else {
                    errorMsg = "Error al cargar los datos";
                }
            
            
        } catch(e){
            errorMsg = e;
        }
        
    }

    async function getPaymentInfo(){
        try{
            let response= await fetch(API,{
            method:"GET"
        });

        let data = await response.json();
        payment=data;
        console.log(data);
        }catch(e){
            errorMsg=e;
        }
       
    }

    async function deletePaymentInfo(n){
        try{
            let response= await fetch(API+"/"+n,{
            method:"DELETE"
        });

        
        if(response.ok){
                    getPaymentInfo();
                    errorMsg = "Dato con cci "+n+" borrado correctamente";
                } else {
                    errorMsg = "Error al cargar los datos";
                }
        }catch(e){
            errorMsg=e;
        }
       
    }


    async function createPaymentInfo() {
    try {
        let response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newDato)
        });

        let status = await response.status;
        console.log(`Creation response status ${status}`);

        if (status == 201) {
            getPaymentInfo();
            errorMsg = "Dato creado correctamente Status code: " + status;
        } else {
            if (response.status == 400) {
                errorMsg = 'Error en la estructura de los datos';
                alert(errorMsg);
            } else if (response.status == 409) {
                errorMsg = 'Ya existe un dato con los mismos datos';
                alert(errorMsg);
            }
        }
    } catch (e) {
        errorMsg = e;
    }
}


    async function DeleteAllInfo() {
        try {
            let response = await fetch(API,{
                method: "DELETE"
            });
            
            if (response.status == 200) {
				getPaymentInfo();
                console.log("Se borraron todos los datos")
			} else {
				errorMsg = 'Ya estan borrados todos los datos';
				alert(errorMsg);
			}
        } catch(e) {
            errorMsg = e;
            
        }
    }
    
          

</script>

<table>
    <thead> 
        <tr>
            <th>ms</th>
            <th>ms_name</th>
            <th>cci</th>
            <th>title</th>
            <th>fund</th>
            <th>category_of_region</th>
            <th>year</th>
            <th>init_plan_eu_amt_1_adoption</th>
            <th>transfers</th>
            <th>actual_plan_eu_amt_latest_adop</th>
            <th>pre_fin</th>
            <th>recovery_of_pre_financing</th>
            <th>net_pre_financing</th>
            <th>interim_payments</th>
            <th>recovery_of_expenses</th>
            <th>net_interim_payments</th>
            <th>total_net_payments</th>
            <th>eu_payment_rate_init_plan_eu_amt</th>
            <th>eu_payment_rate_actual_plan_eu_amt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={newDato.ms}>
            </td>
            <td>
                <input bind:value={newDato.ms_name}>
            </td>
            <td>
                <input bind:value={newDato.cci}>
            </td>
            <td>
                <input bind:value={newDato.title}>
            </td>
            <td>
                <input bind:value={newDato.fund}>
            </td>
            <td>
                <input bind:value={newDato.category_of_region}>
            </td>
            <td>
                <input bind:value={newDato.year} type="number">
            </td>
            <td>
                <input bind:value={newDato.init_plan_eu_amt_1_adoption} type="number">
            </td>
            <td>
                <input bind:value={newDato.transfers} type="number">
            </td>
            <td>
                <input bind:value={newDato.actual_plan_eu_amt_latest_adop} type="number">
            </td>
            <td>
                <input bind:value={newDato.pre_fin} type="number">
            </td>
            <td>
                <input bind:value={newDato.recovery_of_pre_financing} type="number">
            </td>
            <td>
                <input bind:value={newDato.net_pre_financing} type="number">
            </td>
            <td>
                <input bind:value={newDato.interim_payments} type="number">
            </td>
            <td>
                <input bind:value={newDato.recovery_of_expenses} type="number">
            </td>
            <td>
                <input bind:value={newDato.net_interim_payments} type="number">
            </td>
            <td>
                <input bind:value={newDato.total_net_payments} type="number">
            </td>
            <td>
                <input bind:value={newDato.eu_payment_rate_init_plan_eu_amt} type="number">
            </td>
            <td>
                <input bind:value={newDato.eu_payment_rate_actual_plan_eu_amt} type="number">
            </td>
        </tr>
    </tbody>
    
</table>





<ul>
    {#each payment as payment}
        <li><a href="/eu-payment-info/{payment.ms_name}/{payment.year}">{payment.ms_name}</a> - {payment.cci}<button  style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click="{deletePaymentInfo(payment.cci)}">DELETE</button>
        </li>
    {/each}
   
</ul>
<button
            style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
            on:click="{getInitial}"
            >Cargar datos
</button>
<div style="margin-top: 20px; display: flex; justify-content: space-between;">
    <button
        style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
        on:click={() => {
            createPaymentInfo();
        }}>Crear Nuevo Dato</button
    >
    <button
        style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
        on:click={() => {
            DeleteAllInfo();
        }}>Eliminar Todos</button
    >
</div>

   
{#if errorMsg!=""}

{errorMsg}

{/if}

