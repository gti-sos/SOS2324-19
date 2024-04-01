<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let API = 'http://localhost:10000/api/v2/covid-testings';

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
    <p>Country Code: <input type="text" bind:value="{toEdit.country_code}" /></p>
    <p>Level: <input type="text" bind:value="{toEdit.level}" /></p>
    <p>Region: <input type="text" bind:value="{toEdit.region}" /></p>
    <p>Region Name: <input type="text" bind:value="{toEdit.region_name}" /></p>
    <p>New Cases: <input type="number" bind:value="{toEdit.new_cases}" /></p>
    <p>Tests Done: <input type="number" bind:value="{toEdit.tests_done}" /></p>
    <p>Population: <input type="number" bind:value="{toEdit.population}" /></p>
    <p>Testing Rate: <input type="number" bind:value="{toEdit.testing_rate}" /></p>
    <p>Positivity Rate: <input type="number" bind:value="{toEdit.positivity_rate}" /></p>
    <p>Testing Data Source: <input type="text" bind:value="{toEdit.testing_data_source}" /></p>

    <div class="button-center">
        <button on:click={editTesting} class="btn btn-primary">Save</button>
    </div>

    {#if errorMsg}
        <p>{errorMsg}</p>
    {/if}
</div>