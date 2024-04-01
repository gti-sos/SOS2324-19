<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = 'api/v2/esif-payments';
	if (dev) API = 'http://localhost:10000/' + API;

	let message = '';
	let err = '';
	let data = [];
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
	let showForm = false;
	let formData = { ...structure };

	onMount(() => {
		getPayments();
	});

	async function getInitialPayments() {
		let response = await fetch(API + '/loadInitialData', {
			method: 'GET'
		});
		if (response.status === 201) {
			getPayments();
			message = 'Se han cargado los datos correctamente';
			err = '';
		} else if (response.status === 405) {
			message = '';
			err = 'Los datos iniciales ya están cargados';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
		}
	}

	async function getPayments() {
		let response = await fetch(API, {
			method: 'GET'
		});
		if (response.status === 200) {
			data = await response.json();
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
			message = 'Se han eliminado los datos correctamente';
			err = '';
		} else if (response.status === 404) {
			message = '';
			err = 'No se han encontrado datos';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
		}
	}
	async function deleteAllPayments() {
		let response = await fetch(API, {
			method: 'DELETE'
		});
		if (response.status === 200) {
			getPayments();
			message = 'Se han eliminado los datos correctamente';
			err = '';
		} else if (response.status === 404) {
			message = '';
			err = 'No se han encontrado datos';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
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
			getPayments();
			message = 'Se han creado los datos correctamente';
			err = '';
		} else if (response.status === 400) {
			message = '';
			err = 'Los datos no son correctos';
		} else if (response.status === 409) {
			message = '';
			err = 'Ya existe ese dato';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
		}
	}
	function toggleForm() {
		showForm = !showForm;
		if (!showForm) {
			formData = { ...structure }; // Reset form data
		}
	}

	let showDetails = false;
	let selectedData = {};

	function toggleDetails(dato) {
		selectedData = dato;
		showDetails = !showDetails;
	}
</script>

<div class="container-fluid">
	<div class="row">
		{#each data as dato}
			<div class="col-md-4 mb-3">
				<div class="card custom-card">
					<div class="card-header">
						<a href="/esif-payments/{dato.ms_name}/{dato.cci}">
							<h5 class="mb-0">{dato.ms_name}</h5>
							<!-- Nombre en negro -->
						</a>
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
							<button class="btn btn-danger" on:click={() => deletePayment(dato.ms_name, dato.cci)}
								>Eliminar</button
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
	</div>
</div>
<div class="container">
	<button class="btn btn-primary" on:click={getInitialPayments}>Cargar datos Iniciales</button>
	<button class="btn btn-primary" on:click={getPayments}>Obtener todos los datos</button>
	<button class="btn btn-danger" on:click={deleteAllPayments}>Eliminar todos los datos</button>
	{#if showForm}
		<!-- Formulario para crear un nuevo dato -->
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

			<button type="submit" class="btn btn-success">Crear</button>
		</form>
	{:else}
		<button class="btn btn-success" on:click={toggleForm}>Crear un nuevo dato</button>
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
</style>
export {getInitialPayments()}