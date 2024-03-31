<script>
    import { onMount } from 'svelte';

    let API = 'http://localhost:10000/api/v2/covid-testings';

    let testings = [];

    let newTesting = {
        country: 'China',
        country_code: 'CN',
        year_week: '2023-W39',
        level: 'national',
        region: 'CN',
        region_name: 'China',
        new_cases: 555,
        tests_done: 555,
        population: 555555,
        testing_rate: 55.555,
        positivity_rate: 55.555,
        testing_data_source: 'TESSy COVID-19'
    };

    let errorMsg = "";

    onMount(() => {
        getTestings();
    });

    async function getTestings() {
        try {
            let response = await fetch(API, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            testings = data;
            console.log(data);
        } catch (error) {
            errorMsg = 'Error fetching data:' + error;
        }
    }

    async function createTesting() {
        try {
            let response = await fetch(API, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newTesting)
            });

            if (!response.ok) {
                errorMsg = response.status;
            }

            console.log('Testing created successfully');
        } catch (error) {
            errorMsg = 'Se ha producido un error al crear un testing: '+ error;
        }
    }

    async function deleteTesting(country, year_week) {
        console.log(`Deleting ${country} for year and week ${year_week}`);

        try {
            let response = await fetch(
                `${API}/country/${encodeURIComponent(country)}/${encodeURIComponent(year_week)}`,
                {
                    method: 'DELETE'
                }
            );

            if (response.status === 200) {
                console.log('Testing deleted');
            } else {
                errorMsg = "code" + response.status;
            }
        } catch (e) {
            errorMsg = "Error: " + e;
        }
    }
</script>

<ul>
    {#each testings as testing}
        <li>{testing.country}</li>
    {/each}
</ul>

<button on:click="{createTesting}">Create</button>

{#if errorMsg != ""}
    ERROR: {errorMsg}
{/if}
