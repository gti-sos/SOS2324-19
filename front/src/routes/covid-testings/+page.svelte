<script>
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/covid-testings';

    if(dev)
        API = "http://localhost:10000" + API;

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
                errorMsg = 'HTTP error! status: '+ response.status;
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
        console.log(`Deleting testing for year and week ${year_week}`);

        try {
            let response = await fetch(API+"/"+ country + "/"+ year_week,
                {
                    method: 'DELETE'
                }
            );

            if (response.status === 200) {
                console.log('Testing deleted');
                getTestings();
            } else {
                errorMsg = "code" + response.status;
            }
        } catch (e) {
            errorMsg = "Error: " + e;
        }
    }

    async function deleteAllTestings() {
        console.log(`Deleting all testings`);

        try {
            let response = await fetch(API,
                {
                    method: 'DELETE'
                }
            );

            if (response.status === 200) {
                console.log('Testings deleted');
            } else {
                errorMsg = "code" + response.status;
            }
        } catch (e) {
            errorMsg = "Error: " + e;
        }
    }
</script>


<table>
    <thead>
        <tr>
            <th>
                Country
            </th>
            <th>
                Country Code
            </th>
            <th>
                Year Week
            </th>
            <th>
                Level
            </th>
            <th>
                Region
            </th>
            <th>
                Region Name
            </th>
            <th>
                New Cases
            </th>
            <th>
                Tests Done
            </th>
            <th>
                Population
            </th>
            <th>
                Testing Rate
            </th>
            <th>
                Positivity Rate
            </th>
            <th>
                Testing Data Source
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value="{newTesting.country}">
            </td>
            <td>
                <input bind:value="{newTesting.country_code}">
            </td>
            <td>
                <input bind:value="{newTesting.year_week}">
            </td>
            <td>
                <input bind:value="{newTesting.level}">
            </td>
            <td>
                <input bind:value="{newTesting.region}">
            </td>
            <td>
                <input bind:value="{newTesting.region_name}">
            </td>
            <td>
                <input bind:value="{newTesting.new_cases}">
            </td>
            <td>
                <input bind:value="{newTesting.tests_done}">
            </td>
            <td>
                <input bind:value="{newTesting.population}">
            </td>
            <td>
                <input bind:value="{newTesting.testing_rate}">
            </td>
            <td>
                <input bind:value="{newTesting.positivity_rate}">
            </td>
            <td>
                <input bind:value="{newTesting.testing_data_source}">
            </td>
        </tr>
    </tbody>
    
    
</table>

<ul>
    {#each testings as testing}
        <li><a href="/covid-testings/{testing.country}/{testing.year_week}">{testing.country}</a> {testing.year_week} <button on:click="{deleteTesting(testing.country,testing.year_week)}">Delete</button></li>
    {/each}
</ul>

<button on:click="{createTesting}">Create</button>
<button on:click="{deleteAllTestings}">Delete All</button>

{#if errorMsg != ""}
    ERROR: {errorMsg}
{/if}
