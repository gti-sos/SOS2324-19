<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/covid-testings';

    if (dev) API = 'http://localhost:10000/api/v2/covid-testings';

    let country = $page.params.country;
    let year_week = $page.params.year_week;
    let toEdit = {
        country: country,
        country_code: '',
        year_week: year_week,
        level: '',
        region: '',
        region_name: '',
        new_cases: 0,
        tests_done: 0,
        population: 0,
        testing_rate: 0.0,
        positivity_rate: 0.0,
        testing_data_source: ''
    };
    let errorMsg = '';

    onMount(async () => {
        await loadTesting(); 
    });

    async function loadTesting() {
        try {
            let response = await fetch(`${API}/${country}/${year_week}`);
            if (response.ok) {
                let data = await response.json();
                toEdit = { ...toEdit, ...data };
            } else {
                errorMsg = 'Error : ' + response.statusText;
            }
        } catch (error) {
            errorMsg = 'Error : ' + error;
        }
    }

    async function editTesting() {
        if (Object.values(toEdit).some(value => value === '' || value === null)) {
            errorMsg = 'Por favor, completa todos los campos.';
            alert(errorMsg);
            return;
        }
        try {
            let response = await fetch(`${API}/${country}/${year_week}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(toEdit)
            });
            if (response.ok) {
                console.log('Testing edited ok');
                await loadTesting();
                alert('Datos actualizados');
                window.history.back();
                location.reload()
            } else {
                errorMsg = 'Error: ' + response.statusText;
            }
        } catch (error) {
            errorMsg = 'Error: ' + error;
        }
    }
</script>

<div class="container mx-auto mt-5" style="width: 60%;">
    <h2 class="title">Datos de {country} - {year_week}</h2>
    <p>Country Code: <input id="countryCodeInput" type="text" bind:value="{toEdit.country_code}" /></p>
    <p>Level: <input id="levelInput" type="text" bind:value="{toEdit.level}" /></p>
    <p>Region: <input id="regionInput" type="text" bind:value="{toEdit.region}" /></p>
    <p>Region Name: <input id="regionNameInput" type="text" bind:value="{toEdit.region_name}" /></p>
    <p>New Cases: <input id="newCasesInput" type="number" bind:value="{toEdit.new_cases}" /></p>
    <p>Tests Done: <input id="testsDoneInput" type="number" bind:value="{toEdit.tests_done}" /></p>
    <p>Population: <input id="populationInput" type="number" bind:value="{toEdit.population}" /></p>
    <p>Testing Rate: <input id="testingRateInput" type="number" bind:value="{toEdit.testing_rate}" /></p>
    <p>Positivity Rate: <input id="positivityRateInput" type="number" bind:value="{toEdit.positivity_rate}" /></p>
    <p>Testing Data Source: <input id="testingDataSourceInput" type="text" bind:value="{toEdit.testing_data_source}" /></p>

    <div class="button-center">
        <button id="editButton" on:click={editTesting} class="btn btn-primary">Guardar</button>
    </div>

    {#if errorMsg}
        <p>{errorMsg}</p>
    {/if}
</div>
