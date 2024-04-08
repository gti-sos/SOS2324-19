<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = '/api/v2/esif-payments';
	if (dev) API = 'http://localhost:10000' + API;

	let message = '';
	let err = '';
	let data = [];
	let resources = [];
	let offset = 0;
	const limit = 10;
	let structure = {
		ms: 'FR',
		ms_name: 'France',
		cci: '2014FR05M9OP001',
		title: 'Youth Employment - FR - ESF/YEI',
		fund: 'YEI Specific Allocation',
		category_of_region: 'no',
		year: 2019,
		net_planned_eu_amount: 334883138,
		cumulative_initial_pre_financing: 6479079.6,
		cumulative_additional_initial_pre_financing: 62631102.8,
		recovery_of_initial_pre_financing: 0,
		cumulative_annual_pre_financing: 28518390.29,
		pre_financing_covered_by_expenditure: 7263707.11,
		recovery_of_annual_pre_financing: 11783891.79,
		net_pre_financing: 78580973.79,
		cumulative_interim_payments: 178211442.06,
		recovery_of_expenses: 7219112.08,
		net_interim_payments: 178256037.09,
		total_net_payments: 256837010.88,
		eu_payment_rate: 76.694518695056,
		eu_payment_rate_on_planned_eu_amount: 76.694518695056
	};
	let showSearchForm = false;
	let searchFormData = {
		ms: '',
		ms_name: '',
		cci: '',
		title: '',
		fund: '',
		category_of_region: '',
		year: '',
		net_planned_eu_amount: '',
		cumulative_initial_pre_financing: '',
		cumulative_additional_initial_pre_financing: '',
		recovery_of_initial_pre_financing: '',
		cumulative_annual_pre_financing: '',
		pre_financing_covered_by_expenditure: '',
		recovery_of_annual_pre_financing: '',
		net_pre_financing: '',
		cumulative_interim_payments: '',
		recovery_of_expenses: '',
		net_interim_payments: '',
		total_net_payments: '',
		eu_payment_rate: '',
		eu_payment_rate_on_planned_eu_amount: ''
	};

	function toggleSearchForm() {
		showSearchForm = !showSearchForm;
	}
	let showForm = false;
	let formData = { ...structure };
	let searchQuery = '';

	onMount(() => {
		getPayments();
	});

	async function getInitialPayments() {
		let response = await fetch(API + '/loadInitialData', {
			method: 'GET'
		});
		if (response.status === 201) {
			message = 'Se han inicializado los datos correctamente';
			err = '';
			alert(message);
			getPayments();
		} else if (response.status === 405) {
			message = '';
			err = 'Los datos iniciales ya están cargados';
			alert(err);
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
			alert(err);
		}
	}
	async function searchPayments() {
		searchQuery = '';
		for (let key in searchFormData) {
			if (searchFormData[key] !== '') {
				searchQuery += `${key}=${searchFormData[key]}&`;
			}
		}
		searchQuery = searchQuery.slice(0, -1);
		getPayments();
	}
	function nextPage() {
		offset += limit;
		getPayments();
	}

	function previousPage() {
		if (offset >= limit) {
			offset -= limit;
			getPayments();
		}
	}
	async function getPayments() {
		let url = API;
		if (searchQuery) {
			url += `?${searchQuery}`;
			url += `&limit=${limit}&offset=${offset}`;
		} else {
			url += `?limit=${limit}&offset=${offset}`;
		}
		console.log(url);
		let response = await fetch(url, {
			method: 'GET'
		});
		if (response.status === 200) {
			data = await response.json();
			console.log(data.length);
			message = 'Se han cargado los datos correctamente';
			err = '';
		} else if (response.status === 404) {
			message = '';
			err = 'No se han encontrado datos';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
		}
	}

	async function deletePayment(ms_name, cci) {
		let response = await fetch(API + '/' + ms_name + '/' + cci, {
			method: 'DELETE'
		});
		if (response.status === 200) {
			getPayments();
			message = `Se ha eliminado el dato ${ms_name} , ${cci}correctamente`;
			err = '';
			alert(message);
		} else if (response.status === 404) {
			message = '';
			err = `No se han encontrado datos con  ${ms_name} , ${cci}`;
			alert(err);
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
			alert(err);
		}
	}
	async function deleteAllPayments() {
		let response = await fetch(API, {
			method: 'DELETE'
		});
		if (response.status === 200) {
			message = 'Se han eliminado los datos correctamente';
			err = '';
			alert(message);
			location.reload();
			getPayments();
		} else if (response.status === 404) {
			message = '';
			err = 'No se han encontrado datos';
			alert(err);
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
			alert(err);
		}
	}
	async function createPayment() {
		let response = await fetch(API, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (response.status === 201) {
			message = 'Se ha creado el dato correctamente';
			err = '';
			alert(message);
			location.reload();
			getPayments();
		} else if (response.status === 400) {
			message = '';
			err = 'Los datos no son correctos';
			alert(err);
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
	function toggleForm() {
		showForm = !showForm;
		if (!showForm) {
			formData = { ...structure }; // Reset form data
		}
	}
	async function submitSearch() {
		await searchPayments();
		toggleSearchForm();
	}

	let showDetails = false;
	let selectedData = {};

	function toggleDetails(dato) {
		selectedData = dato;
		showDetails = !showDetails;
	}
	function esArray(dato) {
		return Array.isArray(dato);
	}
	function clearSearch() {
		searchFormData = {
			// Restablecer los datos de búsqueda
			ms: '',
			ms_name: '',
			cci: '',
			title: '',
			fund: '',
			category_of_region: '',
			year: '',
			net_planned_eu_amount: '',
			cumulative_initial_pre_financing: '',
			cumulative_additional_initial_pre_financing: '',
			recovery_of_initial_pre_financing: '',
			cumulative_annual_pre_financing: '',
			pre_financing_covered_by_expenditure: '',
			recovery_of_annual_pre_financing: '',
			net_pre_financing: '',
			cumulative_interim_payments: '',
			recovery_of_expenses: '',
			net_interim_payments: '',
			total_net_payments: '',
			eu_payment_rate: '',
			eu_payment_rate_on_planned_eu_amount: ''
		};
		searchQuery = '';
		getPayments();
	}
</script>

<div class="container-fluid">
    <div class="d-flex justify-content-between mb-3">
        <button class="btn btn-primary mr-auto" on:click={() => previousPage()}>Página Anterior</button>
        <button id = "nxtButton" class="btn btn-primary ml-auto"on:click={() => nextPage()}>Página Siguiente</button>
    </div>
	<div class="row">
		{#if !esArray(data)}
			<div id="DataItem" class="col-md-4 mb-3">
				<div class="card custom-card">
					<div class="card-header">
						<a href="/esif-payments/{data.ms_name}/{data.cci}">
							<h5 class="mb-0">{data.ms_name}</h5>
						</a>
					</div>
					<div class="card-body">
						<div class="card-info">
							<p><strong>CCI:</strong> {data.cci}</p>
							<p><strong>Year:</strong> {data.year}</p>
						</div>
						<div class="details-container">
							<button class="more-info-button" on:click={() => toggleDetails(data)}
								>Más Información</button
							>
							<button class="btn btn-danger" on:click={() => deletePayment(data.ms_name, data.cci)}
								>Eliminar</button
							>
							<!-- Botón para más información -->
							{#if showDetails && selectedData === data}
								<table>
									<tbody>
										{#each Object.entries(data) as [key, value]}
											<tr>
												<td>{key}</td>
												<td>{value}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{:else}
			<!-- Iterar sobre data cuando hay más de un elemento -->
			{#each data as dato}
				<div id="DataItem"class="col-md-4 mb-3">
					<div class="card custom-card">
						<div class="card-header">
							<div class="d-flex align-items-center">
								<h5 class="mb-0">{dato.ms_name}</h5>
								<a href="/esif-payments/{dato.ms_name}/{dato.cci}" class="ml-auto">
									<button id="Edit Button" class="btn btn-success">Editar</button>
								</a>
							</div>
						</div>
						<div class="card-body">
							<div class="card-info">
								<p><strong>CCI:</strong> {dato.cci}</p>
								<p><strong>Year:</strong> {dato.year}</p>
							</div>
							<div class="details-container">
								<button class="more-info-button" on:click={() => toggleDetails(dato)}
									>Más Información</button
								>
								<button
									class="btn btn-danger" id="DeleteButton"
									on:click={() => deletePayment(dato.ms_name, dato.cci)}>Eliminar</button
								>
								<!-- Botón para más información -->
								{#if showDetails && selectedData === dato}
									<table>
										<tbody>
											{#each Object.entries(dato) as [key, value]}
												<tr>
													<td>{key}</td>
													<td>{value}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<div class="container">
	<button id="LoadDataButton" class="btn btn-primary" on:click={getInitialPayments}>Cargar datos Iniciales</button>
	<button id="DeleteDataButton" class="btn btn-danger" on:click={deleteAllPayments}>Eliminar todos los datos</button>
	{#if showForm}
		<form on:submit|preventDefault={createPayment}>
			<div class="form-group">
				<label for="ms">MS:</label>
				<input type="text" id="ms" bind:value={formData.ms} class="form-control" />
			</div>
			<div class="form-group">
				<label for="ms_name">MS Name:</label>
				<input type="text" id="ms_name" bind:value={formData.ms_name} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cci">CCI:</label>
				<input type="text" id="cci" bind:value={formData.cci} class="form-control" />
			</div>
			<div class="form-group">
				<label for="title">Title:</label>
				<input type="text" id="title" bind:value={formData.title} class="form-control" />
			</div>
			<div class="form-group">
				<label for="fund">Fund:</label>
				<input type="text" id="fund" bind:value={formData.fund} class="form-control" />
			</div>
			<div class="form-group">
				<label for="category_of_region">Category of Region:</label>
				<input
					type="text"
					id="category_of_region"
					bind:value={formData.category_of_region}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="year">Year:</label>
				<input type="number" id="year" bind:value={formData.year} class="form-control" />
			</div>
			<div class="form-group">
				<label for="net_planned_eu_amount">Net Planned EU Amount:</label>
				<input
					type="number"
					id="net_planned_eu_amount"
					step="any"
					bind:value={formData.net_planned_eu_amount}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="cumulative_initial_pre_financing">Cumulative Initial Pre Financing:</label>
				<input
					type="number"
					id="cumulative_initial_pre_financing"
					step="any"
					bind:value={formData.cumulative_initial_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="cumulative_additional_initial_pre_financing"
					>Cumulative Additional Initial Pre Financing:</label
				>
				<input
					type="number"
					id="cumulative_additional_initial_pre_financing"
					step="any"
					bind:value={formData.cumulative_additional_initial_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="recovery_of_initial_pre_financing">Recovery of Initial Pre Financing:</label>
				<input
					type="number"
					id="recovery_of_initial_pre_financing"
					step="any"
					bind:value={formData.recovery_of_initial_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="cumulative_annual_pre_financing">Cumulative Annual Pre Financing:</label>
				<input
					type="number"
					id="cumulative_annual_pre_financing"
					step="any"
					bind:value={formData.cumulative_annual_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="pre_financing_covered_by_expenditure"
					>Pre Financing Covered by Expenditure:</label
				>
				<input
					type="number"
					id="pre_financing_covered_by_expenditure"
					step="any"
					bind:value={formData.pre_financing_covered_by_expenditure}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="recovery_of_annual_pre_financing">Recovery of Annual Pre Financing:</label>
				<input
					type="number"
					id="recovery_of_annual_pre_financing"
					step="any"
					bind:value={formData.recovery_of_annual_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="net_pre_financing">Net Pre Financing:</label>
				<input
					type="number"
					id="net_pre_financing"
					step="any"
					bind:value={formData.net_pre_financing}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="cumulative_interim_payments">Cumulative Interim Payments:</label>
				<input
					type="number"
					id="cumulative_interim_payments"
					step="any"
					bind:value={formData.cumulative_interim_payments}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="recovery_of_expenses">Recovery of Expenses:</label>
				<input
					type="number"
					id="recovery_of_expenses"
					step="any"
					bind:value={formData.recovery_of_expenses}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="net_interim_payments">Net Interim Payments:</label>
				<input
					type="number"
					id="net_interim_payments"
					step="any"
					bind:value={formData.net_interim_payments}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="total_net_payments">Total Net Payments:</label>
				<input
					type="number"
					id="total_net_payments"
					step="any"
					bind:value={formData.total_net_payments}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="eu_payment_rate">EU Payment Rate:</label>
				<input
					type="number"
					id="eu_payment_rate"
					step="any"
					bind:value={formData.eu_payment_rate}
					class="form-control"
				/>
			</div>
			<div class="form-group">
				<label for="eu_payment_rate_on_planned_eu_amount"
					>EU Payment Rate on Planned EU Amount:</label
				>
				<input
					type="number"
					id="eu_payment_rate_on_planned_eu_amount"
					step="any"
					bind:value={formData.eu_payment_rate_on_planned_eu_amount}
					class="form-control"
				/>
			</div>
			<button id= "SendButton" type="submit" class="btn btn-success">Crear</button>
		</form>
	{:else}
		<button id ="CreateButton"class="btn btn-success" on:click={toggleForm}>Crear un nuevo dato</button>
	{/if}
</div>
<div class="container">
	<button class="btn btn-primary" on:click={toggleSearchForm}>
		{#if !showSearchForm}
			Buscar
		{:else}
			Ocultar
		{/if}
	</button>
	{#if showSearchForm}
		<form on:submit|preventDefault={submitSearch} class="search-form">
			<div class="form-group">
				<label for="ms">MS:</label>
				<input type="text" id="ms" bind:value={searchFormData.ms} class="form-control" />
			</div>
			<div class="form-group">
				<label for="ms_name">MS Name:</label>
				<input type="text" id="ms_name" bind:value={searchFormData.ms_name} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cci">CCI:</label>
				<input type="text" id="cci" bind:value={searchFormData.cci} class="form-control" />
			</div>
			<div class="form-group">
				<label for="title">Title:</label>
				<input type="text" id="title" bind:value={searchFormData.title} class="form-control" />
			</div>
			<div class="form-group">
				<label for="fund">Fund:</label>
				<input type="text" id="fund" bind:value={searchFormData.fund} class="form-control" />
			</div>
			<div class="form-group">
				<label for="category_of_region">Category of Region:</label>
				<input type="text" id="category_of_region" bind:value={searchFormData.category_of_region} class="form-control" />
			</div>
			<div class="form-group">
				<label for="year">Year:</label>
				<input type="number" id="year" bind:value={searchFormData.year} class="form-control" />
			</div>
			<div class="form-group">
				<label for="net_planned_eu_amount">Net Planned EU Amount:</label>
				<input type="number" id="net_planned_eu_amount" step="any" bind:value={searchFormData.net_planned_eu_amount} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cumulative_initial_pre_financing">Cumulative Initial Pre Financing:</label>
				<input type="number" id="cumulative_initial_pre_financing" step="any" bind:value={searchFormData.cumulative_initial_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cumulative_additional_initial_pre_financing">Cumulative Additional Initial Pre Financing:</label>
				<input type="number" id="cumulative_additional_initial_pre_financing" step="any" bind:value={searchFormData.cumulative_additional_initial_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="recovery_of_initial_pre_financing">Recovery of Initial Pre Financing:</label>
				<input type="number" id="recovery_of_initial_pre_financing" step="any" bind:value={formData.recovery_of_initial_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cumulative_annual_pre_financing">Cumulative Annual Pre Financing:</label>
				<input type="number" id="cumulative_annual_pre_financing" step="any" bind:value={searchFormData.cumulative_annual_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="pre_financing_covered_by_expenditure">Pre Financing Covered by Expenditure:</label>
				<input type="number" id="pre_financing_covered_by_expenditure" step="any" bind:value={searchFormData.pre_financing_covered_by_expenditure} class="form-control" />
			</div>
			<div class="form-group">
				<label for="recovery_of_annual_pre_financing">Recovery of Annual Pre Financing:</label>
				<input type="number" id="recovery_of_annual_pre_financing" step="any" bind:value={searchFormData.recovery_of_annual_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="net_pre_financing">Net Pre Financing:</label>
				<input type="number" id="net_pre_financing" step="any" bind:value={searchFormData.net_pre_financing} class="form-control" />
			</div>
			<div class="form-group">
				<label for="cumulative_interim_payments">Cumulative Interim Payments:</label>
				<input type="number" id="cumulative_interim_payments" step="any" bind:value={searchFormData.cumulative_interim_payments} class="form-control" />
			</div>
			<div class="form-group">
				<label for="recovery_of_expenses">Recovery of Expenses:</label>
				<input type="number" id="recovery_of_expenses" step="any" bind:value={searchFormData.recovery_of_expenses} class="form-control" />
			</div>
			<div class="form-group">
				<label for="net_interim_payments">Net Interim Payments:</label>
				<input type="number" id="net_interim_payments" step="any" bind:value={searchFormData.net_interim_payments} class="form-control" />
			</div>
			<div class="form-group">
				<label for="total_net_payments">Total Net Payments:</label>
				<input type="number" id="total_net_payments" step="any" bind:value={searchFormData.total_net_payments} class="form-control" />
			</div>
			<div class="form-group">
				<label for="eu_payment_rate">EU Payment Rate:</label>
				<input type="number" id="eu_payment_rate" step="any" bind:value={searchFormData.eu_payment_rate} class="form-control" />
			</div>
			<div class="form-group">
				<label for="eu_payment_rate_on_planned_eu_amount">EU Payment Rate on Planned EU Amount:</label>
				<input type="number" id="eu_payment_rate_on_planned_eu_amount" step="any" bind:value={searchFormData.eu_payment_rate_on_planned_eu_amount} class="form-control" />
			</div>
			<button type="submit" class="btn btn-primary">Buscar</button>
		</form>
	{/if}
	{#if searchQuery}
		<button class="btn btn-secondary" on:click={clearSearch}> Deshabilitar filros </button>
	{/if}
</div>

<style>
	.custom-card {
		background-color: #1a1a1a; /* Fondo de la tarjeta */
		border-radius: 15px; /* Bordes redondeados */
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra */
		color: #fff; /* Texto blanco */
	}

	.custom-card .card-header {
		background-color: #000; /* Fondo del encabezado */
		color: #fff; /* Texto blanco */
		border-top-left-radius: 15px; /* Bordes redondeados para la esquina superior izquierda */
		border-top-right-radius: 15px; /* Bordes redondeados para la esquina superior derecha */
	}

	.more-info-button {
		background-color: #28a745; /* Fondo del botón "Más Información" */
		color: #fff; /* Texto blanco */
		border: none; /* Sin borde */
		border-radius: 5px; /* Bordes redondeados */
		padding: 10px 20px; /* Espaciado interno */
		margin-top: 20px; /* Margen superior */
	}

	table {
		width: 100%;
	}

	td {
		padding: 5px;
		border-bottom: 1px solid #ddd;
	}
	/* Estilos para el formulario de búsqueda */
	.search-form {
		background-color: #f8f9fa; /* Fondo del formulario */
		padding: 20px; /* Espaciado interno */
		border-radius: 10px; /* Bordes redondeados */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra */
	}

	.search-form .form-group {
		margin-bottom: 15px; /* Espaciado entre campos */
	}

	.search-form label {
		font-weight: bold; /* Texto en negrita */
		color: #333; /* Color del texto */
	}

	.search-form button[type='submit'] {
		background-color: #007bff; /* Color de fondo del botón */
		color: #fff; /* Color del texto */
		border: none; /* Sin borde */
		border-radius: 5px; /* Bordes redondeados */
		padding: 10px 20px; /* Espaciado interno */
		cursor: pointer; /* Cursor de puntero */
		transition: background-color 0.3s; /* Transición suave */
	}

	.search-form button[type='submit']:hover {
		background-color: #0056b3; /* Color de fondo al pasar el ratón */
	}
	.btn-success {
		background-color: #28a745; /* Color verde */
		color: #fff; /* Texto blanco */
		border: none; /* Sin borde */
		border-radius: 5px; /* Bordes redondeados */
		padding: 8px 20px; /* Espaciado interno */
		margin-left: 10px; /* Margen a la izquierda */
	}
</style>
