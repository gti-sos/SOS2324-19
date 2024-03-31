<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	let API = 'api/v2/esif-payments';
	if (dev) API = 'http://localhost:10000/' + API;

	let message = '';
	let err = '';
	let data = [];
	let structure = {
		ms: 'string',
		ms_name: 'string',
		cci: 'string',
		title: 'string',
		fund: 'string',
		category_of_region: 'string',
		year: 'number',
		net_planned_eu_amount: 'number',
		cumulative_initial_pre_financing: 'number',
		cumulative_additional_initial_pre_financing: 'number',
		recovery_of_initial_pre_financing: 'number',
		cumulative_annual_pre_financing: 'number',
		pre_financing_covered_by_expenditure: 'number',
		recovery_of_annual_pre_financing: 'number',
		net_pre_financing: 'number',
		cumulative_interim_payments: 'number',
		recovery_of_expenses: 'number',
		net_interim_payments: 'number',
		total_net_payments: 'number',
		eu_payment_rate: 'number',
		eu_payment_rate_on_planned_eu_amount: 'number'
	};

	onMount(() => {
		getPayments();
	});

	async function getInitialPayments() {
		let response = await fetch(API + '/loadInitialData', {
			method: 'GET'
		});
		if (response.status === 201) {
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
	async function deletePayment() {
		let response = await fetch(API + '/' + ms_name + '/' + cci, {
			method: 'DELETE'
		});
		if (response.status === 200) {
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
			body: JSON.stringify(newPayment)
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
	<button class="btn btn-primary" on:click={getInitialPayments}>Cargar datos</button>
	<button class="btn btn-primary" on:click={getPayments}>Obtener todos los datos</button>
	<button class="btn btn-success" on:click={createPayment}>Crear un nuevo dato</button>
	<button class="btn btn-danger" on:click={deleteAllPayments}>Eliminar todos los datos</button>
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
