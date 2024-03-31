<script>
    import { onMount } from 'svelte';

    let API = 'http://localhost:10000/api/v2/covid-testings';
    let testing = [];
    let errorMsg = "";

    onMount(() => {
        getTesting();
    });

    async function getTesting() {
        try {
            let response = await fetch(API, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            let data = await response.json();
            testing = data;
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            errorMsg = 'Error fetching data. Please try again later.';
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
                console.log('Error: ' + response.status);
            }
        } catch (e) {
            console.log('Error: ' + e);
        }
    }
</script>

{#if errorMsg}
    <p>{errorMsg}</p>
{:else}
    <ul>
        {#each testing as testingData}
            <li>
                {testingData.entity} - {testingData.year_week}
                <button on:click={() => deleteTesting(testingData.country, testingData.year_week)}>Delete</button>
            </li>
        {/each}
    </ul>
{/if}
