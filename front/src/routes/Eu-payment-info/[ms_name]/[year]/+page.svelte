<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let API = "http://localhost:10000/api/v2/eu-payment-info";

    let name = $page.params.ms_name;
    let country = $page.params.ms_name;
    let year = $page.params.year;
    let errorMsg = '';
    
    let countryData = {
        ms: '',
        ms_name: '',
        cci: '',
        title: '',
        fund: '',
        category_of_region: '',
        year: 0,
        init_plan_eu_amt_1_adoption: 0,
        transfers: 0,
        actual_plan_eu_amt_latest_adop: 0,
        pre_fin: 0,
        recovery_of_pre_financing: 0,
        net_pre_financing: 0,
        interim_payments: 0,
        recovery_of_expenses: 0,
        net_interim_payments: 0,
        total_net_payments: 0,
        eu_payment_rate_init_plan_eu_amt: 0,
        eu_payment_rate_actual_plan_eu_amt: 0
    };

    let modificado = {};
 

    onMount(async () => {
        await getCountryData(country,year);
    });

    async function getCountryData(country,year) {
        try {
            let response = await fetch(API + '/' + country + '/' + year, {
                method: "GET"
            });

            if (response.status == 200) {
                let res = await response.json();
                countryData = res[0];
                
            } else {
                if (response.status == 400) {
                    errorMsg = 'Error en la estructura de los datos';
                    alert(errorMsg);
                } else if (response.status == 409) {
                    errorMsg = 'Ya existe una entrada con ese país y año';
                    alert(errorMsg);
                } else if (response.status == 404) {
                    errorMsg = "Dato no encontrado";
                    alert(errorMsg);
                }
            }             
            console.log("Datos Originales: " + JSON.stringify(countryData));

        } catch (e) {
            errorMsg = e;
        }
    }

    async function updateCountryData() {
        try {
            let response = await fetch(API + '/' + country + '/' + year, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(countryData)
            });

            if (response.status == 200) {
                modificado = JSON.stringify(countryData);
                await getCountryData(cci); // Volver a cargar los datos actualizados
            } else {
                if (response.status == 400) {
                    errorMsg = 'No puedes cambiar ni el país ni el año';
                    alert(errorMsg);
                } else if (response.status == 409) {
                    errorMsg = 'Ya existe una entrada con ese país y año';
                    alert(errorMsg);
                } else if (response.status == 404) {
                    errorMsg = "Dato no encontrado";
                    alert(errorMsg);
                }
            }
            console.log("Datos Modificados: " + JSON.stringify(modificado));
        } catch (e) {
            errorMsg = e;
        }
    }
</script>

<h1>Payments details of {name}</h1>

<form on:submit|preventDefault={updateCountryData}>
    <label for="ms">MS:</label>
    <input type="text" id="ms" bind:value={countryData.ms}>

    <label for="ms_name">MS Name:</label>
    <input type="text" id="ms_name" bind:value={countryData.ms_name}>

    <label for="cci">CCI:</label>
    <input type="text" id="cci" bind:value={countryData.cci}>

    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={countryData.title}>

    <label for="fund">Fund:</label>
    <input type="text" id="fund" bind:value={countryData.fund}>

    <label for="category_of_region">Category of Region:</label>
    <input type="text" id="category_of_region" bind:value={countryData.category_of_region}>

    <label for="year">Year:</label>
    <input type="number" id="year" bind:value={countryData.year}>

    <label for="init_plan_eu_amt_1_adoption">Initial Plan EU Amount 1 Adoption:</label>
    <input type="number" id="init_plan_eu_amt_1_adoption" bind:value={countryData.init_plan_eu_amt_1_adoption}>

    <label for="transfers">Transfers:</label>
    <input type="number" id="transfers" bind:value={countryData.transfers}>

    <label for="actual_plan_eu_amt_latest_adop">Actual Plan EU Amount Latest Adoption:</label>
    <input type="number" id="actual_plan_eu_amt_latest_adop" bind:value={countryData.actual_plan_eu_amt_latest_adop}>

    <label for="pre_fin">Pre-Fin:</label>
    <input type="number" id="pre_fin" bind:value={countryData.pre_fin}>

    <label for="recovery_of_pre_financing">Recovery of Pre-Financing:</label>
    <input type="number" id="recovery_of_pre_financing" bind:value={countryData.recovery_of_pre_financing}>

    <label for="net_pre_financing">Net Pre-Financing:</label>
    <input type="number" id="net_pre_financing" bind:value={countryData.net_pre_financing}>

    <label for="interim_payments">Interim Payments:</label>
    <input type="number" id="interim_payments" bind:value={countryData.interim_payments}>

    <label for="recovery_of_expenses">Recovery of Expenses:</label>
    <input type="number" id="recovery_of_expenses" bind:value={countryData.recovery_of_expenses}>

    <label for="net_interim_payments">Net Interim Payments:</label>
    <input type="number" id="net_interim_payments" bind:value={countryData.net_interim_payments}>

    <label for="total_net_payments">Total Net Payments:</label>
    <input type="number" id="total_net_payments" bind:value={countryData.total_net_payments}>

    <label for="eu_payment_rate_init_plan_eu_amt">EU Payment Rate Initial Plan EU Amount:</label>
    <input type="number" id="eu_payment_rate_init_plan_eu_amt" bind:value={countryData.eu_payment_rate_init_plan_eu_amt}>

    <label for="eu_payment_rate_actual_plan_eu_amt">EU Payment Rate Actual Plan EU Amount:</label>
    <input type="number" id="eu_payment_rate_actual_plan_eu_amt" bind:value={countryData.eu_payment_rate_actual_plan_eu_amt}>

    <button type="submit">Update</button>
</form>

