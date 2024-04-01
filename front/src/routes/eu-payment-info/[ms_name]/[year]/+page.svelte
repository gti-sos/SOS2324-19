<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import {dev} from "$app/environment";

    let API = 'api/v2/eu-payment-info';
	if (dev) API = 'http://localhost:10000/' + API;
    let country = $page.params.ms_name;
    let year = $page.params.year;
    let errorMsg = '';
    let newData=[];
    let data = [];
    let message = '';
    let err = '';
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
    
    

    onMount( () => {
         loadCountry();
    });

    async function loadCountry() {
        console.log(country+year);
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

    async function putPayment() {
        try {
            let response = await fetch(API + '/' + country + '/' + year, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(countryData)
            });

            if (response.status === 200) {
                newData = JSON.stringify(countryData);
                errorMsg = 'Se han actualizado los datos correctamente';
                err = '';
            } else if (response.status === 404) {
                message = '';
                errorMsg = 'No se ha encontrado el dato';
            } else if (response.status === 400) {
                message = '';
                errorMsg = 'Los datos no son correctos (400) Bad request';
            } else if (response.status === 409) {
                message = '';
                errorMsg = 'Ya existe ese dato';
            } else {
                message = '';
                errorMsg = 'Ha ocurrido un error en el servidor';
            }
        } catch (error) {
            console.error(error);
            err = 'Ha ocurrido un error en la solicitud';
        }

        // Llama a loadCountry() solo después de procesar la respuesta
        await loadCountry();
    }
        

    console.log(country+year);
</script>

<h1>Payments details of {country}</h1>


<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    Actualizar Datos
                </div>
                <div class="card-body">
                    {#each Object.entries(countryData) as [key, value]}
                        <div class="form-group">
                            <label for={key}>{key}</label>
                            <input type="text" class="form-control" id={key} bind:value={countryData[key]} />
                        </div>
                    {/each}
                    <div class="text-center">
                        <button class="btn btn-primary" on:click={putPayment}>Actualizar dato</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{#if errorMsg != ""}
    {errorMsg}
{/if}