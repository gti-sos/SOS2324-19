<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let API = "http://localhost:10000/api/v2/eu-payment-info";
    
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
        await loadCountry();
    });

    async function loadCountry() {
        try {
            let response = await fetch(`${API}/${country}/${year}`);
            if (response.ok) {
                let data = await response.json();
                countryData = { ...countryData, ...data };
            } else {
                errorMsg = 'Error : ' + response.statusText;
            }
        } catch (error) {
            errorMsg = 'Error : ' + error;
        }
    }

    async function updateCountry() {
        try {
            let response = await fetch(`${API}/${country}/${year}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(countryData)
            });
            if (response.ok) {
                console.log('Country data updated successfully');
                await loadCountry();
            } else {
                errorMsg = 'Error: ' + response.statusText;
            }
        } catch (error) {
            errorMsg = 'Error: ' + error;
        }
    }
</script>

<h1>Payments details of {country}</h1>

<div class="container mx-auto mt-5" style="width: 60%;">
    <h2 class="title">Data of {country} - {year}</h2>
    <p>MS: <input type="text" bind:value="{countryData.ms}" /></p>
    <p>MS Name: <input type="text" bind:value="{countryData.ms_name}" /></p>
    <p>CCI: <input type="text" bind:value="{countryData.cci}" /></p>
    <p>Title: <input type="text" bind:value="{countryData.title}" /></p>
    <p>Fund: <input type="text" bind:value="{countryData.fund}" /></p>
    <p>Category of Region: <input type="text" bind:value="{countryData.category_of_region}" /></p>
    <p>Year: <input type="number" bind:value="{countryData.year}" /></p>
    <p>Initial Plan EU Amount 1 Adoption: <input type="number" bind:value="{countryData.init_plan_eu_amt_1_adoption}" /></p>
    <p>Transfers: <input type="number" bind:value="{countryData.transfers}" /></p>
    <p>Actual Plan EU Amount Latest Adoption: <input type="number" bind:value="{countryData.actual_plan_eu_amt_latest_adop}" /></p>
    <p>Pre-Fin: <input type="number" bind:value="{countryData.pre_fin}" /></p>
    <p>Recovery of Pre-Financing: <input type="number" bind:value="{countryData.recovery_of_pre_financing}" /></p>
    <p>Net Pre-Financing: <input type="number" bind:value="{countryData.net_pre_financing}" /></p>
    <p>Interim Payments: <input type="number" bind:value="{countryData.interim_payments}" /></p>
    <p>Recovery of Expenses: <input type="number" bind:value="{countryData.recovery_of_expenses}" /></p>
    <p>Net Interim Payments: <input type="number" bind:value="{countryData.net_interim_payments}" /></p>
    <p>Total Net Payments: <input type="number" bind:value="{countryData.total_net_payments}" /></p>
    <p>EU Payment Rate Initial Plan EU Amount: <input type="number" bind:value="{countryData.eu_payment_rate_init_plan_eu_amt}" /></p>
    <p>EU Payment Rate Actual Plan EU Amount: <input type="number" bind:value="{countryData.eu_payment_rate_actual_plan_eu_amt}" /></p>

    <div class="button-center">
        <button on:click={updateCountry} class="btn btn-primary">Save</button>
    </div>

    {#if errorMsg}
        <p>{errorMsg}</p>
    {/if}
</div>
