<script>
    import { page } from '$app/stores';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let API = '/api/v2/esif-payments';

    if (dev) API = 'http://localhost:10000/api/v2/esif-payments';

    let message = '';
    let err = '';
    let data = [];
    let country = $page.params.country;
    let cci = $page.params.cci;
    let structure = {
        ms: 'PLE',
        ms_name: 'Poland',
        cci: '2014PL16M2OP008',
        title: 'Opolskie Voivodeship - ERDF/ESF',
        fund: 'ERDF',
        category_of_region: 'REACT-EU',
        year: 2024,
        net_planned_eu_amount: 13123568,
        cumulative_initial_pre_financing: 4955701.95,
        recovery_of_initial_pre_financing: 0,
        cumulative_annual_pre_financing: 482724.78,
        pre_financing_covered_by_expenditure: 4759.17,
        recovery_of_annual_pre_financing: 215494.25,
        net_pre_financing: 5218173.31,
        cumulative_interim_payments: 7472694.41,
        recovery_of_expenses: 0,
        net_interim_payments: 7477453.58,
        total_net_payments: 12695626.89,
        eu_payment_rate: 967391405294658,
        eu_payment_rate_on_planned_eu_amount: 967391405294658
    };

    let isEditing = false; // Variable para controlar si se está editando o no

    onMount(() => {
        getPayment();
    });

    async function getPayment() {
        let response = await fetch(API + '/' + country + '/' + cci, {
            method: 'GET'
        });
        if (response.ok) {
            data = await response.json();
            structure = data
        } else {
            err = `No se ha encontrado el dato con  ${ms_name} , ${cci}`;
            alert(err);
        }
    }

    async function putPayment() {
        let response = await fetch(API + '/' + country + '/' + cci, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(structure)
        });
        if (response.status === 200) {
            message = 'Se han actualizado los datos correctamente';
            err = '';
            alert(message);
            isEditing = false; // Después de editar, cambiar a no editar
            history.back(); // Redirigir a la página anterior
        } else if (response.status === 404) {
            message = '';
            err = 'No se ha encontrado el dato';
            alert(err);
        } else if (response.status === 400) {
            message = '';
            err = 'Los datos no son correctos';
        } else if (response.status === 409) {
            message = '';
            err = 'Ya existe ese dato';
            alert(err);
        } else {
            message = '';
            err = 'Ha ocurrido un error en el servidor';
            alert(err);
        }
    }
</script>

<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    Actualizar Datos
                </div>
                <div class="card-body">
                    {#each Object.entries(structure) as [key, value]}
                        <div class="form-group">
                            <label for={key}>{key}</label>
                            <input type="text" class="form-control" id={key} bind:value={structure[key]} readonly={!isEditing} />
                        </div>
                    {/each}
                    <div class="text-center">
                        {#if isEditing}
                            <button class="btn btn-primary" on:click={putPayment}>Guardar</button>
                        {:else}
                            <button id = "SendButton" class="btn btn-primary" on:click={() => isEditing = true}>Editar</button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
