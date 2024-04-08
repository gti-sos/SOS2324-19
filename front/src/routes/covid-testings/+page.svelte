<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = '/api/v2/covid-testings';
	if (dev) API = 'http://localhost:10000' + API;

	let testings = [];
	let currentPage = 1;
    let totalPages = 1;

	let formData = {};
	let showForm = false;

	let errorMsg = '';

	onMount(() => {
		getTestings();
	});

	async function getTestings() {
        try {
            let response = await fetch(`${API}?from=${from}&to=${to}`, { method: 'GET' });
            let data = await response.json();
            testings = data;
            console.log(data);
        } catch (error) {
            if (testings.length === 0){
                errorMsg='';
                console.log("No hay datos disponibles")
            }else{
                errorMsg = error;
            }
        }
    }

    let from = ''; // Variable para almacenar el año de inicio de la búsqueda
    let to = ''; // Variable para almacenar el año final de la búsqueda

    function handleSearch() {
        from = document.getElementById('from').value;
        to = document.getElementById('to').value;

        getTestings();
    }

    async function navigateToPage(page) {
        currentPage = page;
        await getTestings();
    }

    async function getinitialTestings() {
        try {
            let response = await fetch(API + '/loadInitialData', { method: 'GET' });
            if (response.status === 201) {
                await getTestings();
                alert('Datos iniciales cargados correctamente');
                errorMsg = 'Datos cargados correctamente';
            } else if (response.status === 200) {
                alert('Los datos iniciales ya están cargados');
            } else {
                errorMsg = 'No se han podido cargar los datos';
                alert('No se han podido cargar los datos');
            }
        } catch (error) {
            if (testings.length === 0){
                errorMsg='';
                console.log("No hay datos disponibles")
            } else {
                errorMsg = 'Error cargando los datos:' + error;
            }
        }
    }

	async function createTesting() {
		showForm = true;

		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.status == 201) {
				getTestings();
				console.log('Creado correctamente. Codigo: ' + response.status);
				alert('Creado correctamente');
				location.reload();
			} else {
				if (response.status == 400) {
					errorMsg = 'Todos los campos son obligatorios';
					alert(errorMsg);
					} else if (response.status == 409) {
					errorMsg = 'Datos ya registrados';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = 'Se ha producido un error al crear un testing: ' + error;
		}
	}

	async function deleteTesting(country, year_week) {
		console.log(`Deleting testing for year and week ${year_week}`);

		try {
			let response = await fetch(API + '/' + country + '/' + year_week, {
				method: 'DELETE'
			});

			if (response.status === 200) {
				getTestings();
				console.log('Testing deleted');
				alert('Dato eliminado');
				location.reload();
			} else {
				errorMsg = 'code' + response.status;
			}
		} catch (e) {
			if (testings.length === 0) {
				errorMsg = '';
				alert('No hay datos disponibles');
				console.log('There are no data');
			} else {
				errorMsg = 'Error: ' + e;
			}
		}
	}

	async function deleteAllTestings() {
		console.log(`Deleting all testings`);

		try {
			let response = await fetch(API, {
				method: 'DELETE'
			});

			if (response.status === 200) {
				getTestings();
				console.log('Testings deleted');
				alert('Testings eliminados');
				location.reload();
			} else {
				errorMsg = 'code' + response.status;
				alert("Error al eliminar los datos");
			}
		} catch (e) {
			errorMsg = 'Error: ' + e;
		}
	}
</script>

<label>
    From:
    <input type="text" id="from">
</label>
<label>
    To:
    <input type="text" id="to">
</label>
<button on:click="{handleSearch}">Buscar</button>

<table>
	<thead>
		<tr>
			<th>Country</th>
			<th>Country Code</th>
			<th>Year Week</th>
			<th>Level</th>
			<th>Region</th>
			<th>Region Name</th>
			<th>New Cases</th>
			<th>Tests Done</th>
			<th>Population</th>
			<th>Testing Rate</th>
			<th>Positivity Rate</th>
			<th>Testing Data Source</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each testings as testing}
			<tr id="testingItem">
				<td>{testing.country}</td>
				<td>{testing.country_code}</td>
				<td>{testing.year_week}</td>
				<td>{testing.level}</td>
				<td>{testing.region}</td>
				<td>{testing.region_name}</td>
				<td>{testing.new_cases}</td>
				<td>{testing.tests_done}</td>
				<td>{testing.population}</td>
				<td>{testing.testing_rate}</td>
				<td>{testing.positivity_rate}</td>
				<td>{testing.testing_data_source}</td>
				<td>
					<button
						id="deleteButton-{testing.country}-{testing.year_week}"
						class="delete-button"
						on:click={() => deleteTesting(testing.country, testing.year_week)}>Eliminar</button
					>
					<button
						id="editButton-{testing.country}-{testing.year_week}"
						class="edit-button"
						on:click={() =>
							(window.location.href = `/covid-testings/${testing.country}/${testing.year_week}`)}
						>Editar</button
					>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if showForm}
	<form on:submit|preventDefault={() => createTesting(formData)}>
		<label>
			Country:
			<input id="countryInput" type="text" bind:value={formData.country} />
		</label>
		<label>
			Country Code:
			<input id="countryCodeInput" type="text" bind:value={formData.country_code} />
		</label>
		<label>
			Year Week:
			<input id="yearWeekInput" type="text" bind:value={formData.year_week} />
		</label>
		<label>
			Level:
			<input id="levelInput" type="text" bind:value={formData.level} />
		</label>
		<label>
			Region:
			<input id="regionInput" type="text" bind:value={formData.region} />
		</label>
		<label>
			Region Name:
			<input id="regionNameInput" type="text" bind:value={formData.region_name} />
		</label>
		<label>
			New Cases:
			<input id="newCasesInput" type="text" bind:value={formData.new_cases} />
		</label>
		<label>
			Tests Done:
			<input id="testsDoneInput" type="text" bind:value={formData.tests_done} />
		</label>
		<label>
			Population:
			<input id="populationInput" type="text" bind:value={formData.population} />
		</label>
		<label>
			Testing Rate:
			<input id="testingRateInput" type="text" bind:value={formData.testing_rate} />
		</label>
		<label>
			Positivity Rate:
			<input id="positivityRateInput" type="text" bind:value={formData.positivity_rate} />
		</label>
		<label>
			Testing Data Source:
			<input id="testingDataSourceInput" type="text" bind:value={formData.testing_data_source} />
		</label>
		<button id="submitButton" type="submit" class="create-button">Crear</button>
	</form>
{/if}

<button id="loadData" class="load-button" on:click={getinitialTestings}>Cargar Datos</button>
<button id="createButton" class="create-button" on:click={createTesting}>Crear</button>
<button id="deleteAllButton" class="delete-button" on:click={deleteAllTestings}>Eliminar todo</button>

<div>
	<button class="page-button" on:click="{() => navigateToPage(currentPage - 1)}" disabled="{currentPage === 1}">Página anterior</button>
	<button class="page-button" on:click="{() => navigateToPage(currentPage + 1)}" disabled="{currentPage === totalPages}">Página siguiente</button>
</div>

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 20px;
	}

	th,
	td {
		padding: 10px;
		text-align: left;
		border-bottom: 1px solid #ddd;
	}

	th {
		background-color: #f2f2f2;
	}

	tr:hover {
		background-color: #f5f5f5;
	}

	.delete-button {
		background-color: #f44336;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
		border-radius: 4px;
	}

	.delete-button:hover {
		background-color: #d32f2f;
	}

	.create-button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
		border-radius: 4px;
	}

	.create-button:hover {
		background-color: #45a049;
	}

	.load-button {
		background-color: #2196f3;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
		border-radius: 4px;
	}

	.load-button:hover {
		background-color: #1e87db;
	}

	.edit-button {
		background-color: #2196f3;
		color: white;
		border: none;
		padding: 8px 16px;
		cursor: pointer;
		border-radius: 4px;
	}

	.edit-button:hover {
		background-color: #1e87db;
	}
</style>
