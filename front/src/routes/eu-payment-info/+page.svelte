<script>
	import { onMount } from 'svelte';
	let showCountryDetails = false;

	import { dev } from '$app/environment';

	let API = 'api/v2/eu-payment-info';
	if (dev) API = 'http://localhost:10000/' + API;

	let errorMsg = '';
	let Msg = '';
	let payment = [];
	let limit = 10;
	let showFilter = false;
	let newDato = {
		ms: 'DE',
		ms_name: 'Germany',
		cci: '2024DE987654321',
		title: 'Bavaria - Innovation and Entrepreneurship',
		fund: 'EAFRD',
		category_of_region: 'More developed',
		year: 2024,
		init_plan_eu_amt_1_adoption: 55000000,
		transfers: 0,
		actual_plan_eu_amt_latest_adop: 55000000,
		pre_fin: 1375000,
		recovery_of_pre_financing: 0,
		net_pre_financing: 1375000,
		interim_payments: 6500000,
		recovery_of_expenses: 0,
		net_interim_payments: 6500000,
		total_net_payments: 7875000,
		eu_payment_rate_init_plan_eu_amt: 0.025,
		eu_payment_rate_actual_plan_eu_amt: 0.025
	};
	let selectedFilter = {};

	let selectedCountryData = {};
	onMount(() => {
		console.log("pepe")
		getPaymentInfo();
	});
 
	async function getInitial() {
		try {
			let response = await fetch(API + '/loadInitialData', {
				method: 'GET'
			});
			let status = await response.status;

			if (status == 200) {
				getPaymentInfo();
				let messageText = document.createElement('p');
				messageText.textContent = 'Datos creados correctamente';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			} else {
				let messageText = document.createElement('p');
				messageText.textContent = 'Error al cargar los datos';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function getPaymentInfo() {
		try {
			let response = await fetch(API + `?offset=0&&limit=${limit}`, {
				method: 'GET'
			});

			let data = await response.json();
			payment = data;
			console.log(data);
		} catch (e) {
			errorMsg = e;
		}
	}

	async function getNextPage() {
		let response = await fetch(API + `?offset=10&&limit=${limit}`, {
			method: 'GET'
		});
		try {
			let dat = await response.json();
			payment = dat;
			console.log(dat);
		} catch (error) {
			console.log(`Error al parsear el resultado: ${error}`);
		}
	}

	let getFrom = null;
	let getTo = null;
	async function getFromTo(getFrom, getTo) {
		let response = await fetch(API + `?from=${getFrom}&to=${getTo}`, {
			method: 'GET'
		});
		try {
			let dat = await response.json();
			payment = dat;
			console.log(stats);
		} catch (error) {
			console.log(`Error al parsear el resultado: ${error}`);
		}
		let status = await response.status;
		if (status == 200) {
			let messageText = document.createElement('p');
			messageText.textContent = 'Busqueda realizada ';
			messageText.style.backgroundColor = 'pink';
			messageText.style.padding = '10px';
			messageText.style.position = 'fixed';
			messageText.style.top = '20px';
			messageText.style.left = '20px';
			messageText.style.zIndex = '9999';
			document.body.appendChild(messageText);

			setTimeout(() => {
				document.body.removeChild(messageText);
			}, 2000);
			Msg = 'Se ha realizado la petición correctamente';
		} else if (status == 400) {
			Msg = 'La petición no es correcta.';
		} else if (status == 500) {
			Msg = 'Error del servidor';
		}
	}

	async function deletePaymentInfo(n) {
		try {
			let response = await fetch(API + '/' + n, {
				method: 'DELETE'
			});

			let status = await response.status;

			if (status == 200) {
				getPaymentInfo();
				let messageText = document.createElement('p');
				messageText.textContent = 'Dato con cci ' + n + ' borrado correctamente ';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);
				document.body.appendChild(messageText);
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			} else {
				let messageText = document.createElement('p');
				messageText.textContent = 'Error al borrar el dato';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			}
		} catch (e) {
			errorMsg = e;
		}
	}

	async function createPaymentInfo() {
		try {
			let response = await fetch(API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newDato)
			});

			let status = await response.status;
			console.log(`Creation response status ${status}`);

			if (status == 201) {
				getPaymentInfo();
				let messageText = document.createElement('p');
				messageText.textContent = 'Dato creado correctamente. ';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			} else {
				if (response.status == 400) {
					let messageText = document.createElement('p');
					messageText.textContent = 'Error en la estructura de los datos ';
					messageText.style.backgroundColor = 'pink';
					messageText.style.padding = '10px';
					messageText.style.position = 'fixed';
					messageText.style.top = '20px';
					messageText.style.left = '20px';
					messageText.style.zIndex = '9999';
					document.body.appendChild(messageText);
					setTimeout(() => {
						document.body.removeChild(messageText);
					}, 2000);
				} else if (response.status == 409) {
					let messageText = document.createElement('p');
					messageText.textContent = 'Ya existe un dato con los mismos datos';
					messageText.style.backgroundColor = 'pink';
					messageText.style.padding = '10px';
					messageText.style.position = 'fixed';
					messageText.style.top = '20px';
					messageText.style.left = '20px';
					messageText.style.zIndex = '9999';
					document.body.appendChild(messageText);
					setTimeout(() => {
						document.body.removeChild(messageText);
					}, 2000);
				}
			}
		} catch (e) {
			alert(e);
		}
	}

	async function DeleteAllInfo() {
		try {
			let response = await fetch(API, {
				method: 'DELETE'
			});
			let status = await response.status;
			if (status == 200) {
				let messageText = document.createElement('p');
				messageText.textContent = 'Datos borrados con exito ';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);

				getPaymentInfo();
				console.log('Se borraron todos los datos');
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			} else {
				let messageText = document.createElement('p');
				messageText.textContent = 'Hubo un error al borrar los datos. ';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);

				getPaymentInfo();
				console.log('Se borraron todos los datos');
				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			}
		} catch (e) {
			alert(e);
		}
	}

	async function showCountryData(cci) {
		selectedCountryData = payment.find((country) => country.cci === cci);
		showCountryDetails = true;
	}

	async function getStatsFilter() {
		try {
			// Construye la URL de búsqueda a partir de los filtros proporcionados
			let searchParams = new URLSearchParams();
			if (selectedFilter.length == 0) {
				selectedFilter = {
					ms: '',
					ms_name: '',
					cci: '',
					title: '',
					fund: '',
					category_of_region: '',
					year: '',
					init_plan_eu_amt_1_adoption: '',
					transfers: '',
					actual_plan_eu_amt_latest_adop: '',
					pre_fin: '',
					recovery_of_pre_financing: '',
					net_pre_financing: '',
					interim_payments: '',
					recovery_of_expenses: '',
					net_interim_payments: '',
					total_net_payments: '',
					eu_payment_rate_init_plan_eu_amt: '',
					eu_payment_rate_actual_plan_eu_amt: ''
				};
			}
			for (const key in selectedFilter) {
				if (selectedFilter[key] !== '') {
					searchParams.append(key, selectedFilter[key]);
				}
			}
			let searchUrl = `${API}/?${searchParams.toString()}`;
			console.log(searchUrl);
			// Realiza la petición GET a la API con la URL de búsqueda generada
			let response = await fetch(searchUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			// Manejo de la respuesta de la API
			let status = response.status;
			console.log(`Response status: ${status}`);

			if (response.status == 200) {
				// Actualiza los datos después de una búsqueda exitosa
				let data = await response.json();
				payment = data;
				console.log(data);
				let messageText = document.createElement('p');
				messageText.textContent = 'Filtrado de datos realizado';
				messageText.style.backgroundColor = 'pink';
				messageText.style.padding = '10px';
				messageText.style.position = 'fixed';
				messageText.style.top = '20px';
				messageText.style.left = '20px';
				messageText.style.zIndex = '9999';
				document.body.appendChild(messageText);

				setTimeout(() => {
					document.body.removeChild(messageText);
				}, 2000);
			} else {
				// Manejo de errores
				if (response.status == 400) {
					errorMsg = 'Error en la estructura de los datos';
					alert(errorMsg);
				} else if (response.status == 409) {
					errorMsg = 'Ya existe una entrada con ese país y año';
					alert(errorMsg);
				} else if (response.status == 404) {
					errorMsg = 'Dato no encontrado';
					alert(errorMsg);
				}
			}
		} catch (error) {
			errorMsg = error;
		}
	}
</script>

Tabla para crear datos

<table>
	<thead>
		<tr>
			<th>ms</th>
			<th>ms_name</th>
			<th>cci</th>
			<th>title</th>
			<th>fund</th>
			<th>category_of_region</th>
			<th>year</th>
			<th>init_plan_eu_amt_1_adoption</th>
			<th>transfers</th>
			<th>actual_plan_eu_amt_latest_adop</th>
			<th>pre_fin</th>
			<th>recovery_of_pre_financing</th>
			<th>net_pre_financing</th>
			<th>interim_payments</th>
			<th>recovery_of_expenses</th>
			<th>net_interim_payments</th>
			<th>total_net_payments</th>
			<th>eu_payment_rate_init_plan_eu_amt</th>
			<th>eu_payment_rate_actual_plan_eu_amt</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<input bind:value={newDato.ms} />
			</td>
			<td>
				<input bind:value={newDato.ms_name} />
			</td>
			<td>
				<input bind:value={newDato.cci} />
			</td>
			<td>
				<input bind:value={newDato.title} />
			</td>
			<td>
				<input bind:value={newDato.fund} />
			</td>
			<td>
				<input bind:value={newDato.category_of_region} />
			</td>
			<td>
				<input bind:value={newDato.year} type="number" />
			</td>
			<td>
				<input bind:value={newDato.init_plan_eu_amt_1_adoption} type="number" />
			</td>
			<td>
				<input bind:value={newDato.transfers} type="number" />
			</td>
			<td>
				<input bind:value={newDato.actual_plan_eu_amt_latest_adop} type="number" />
			</td>
			<td>
				<input bind:value={newDato.pre_fin} type="number" />
			</td>
			<td>
				<input bind:value={newDato.recovery_of_pre_financing} type="number" />
			</td>
			<td>
				<input bind:value={newDato.net_pre_financing} type="number" />
			</td>
			<td>
				<input bind:value={newDato.interim_payments} type="number" />
			</td>
			<td>
				<input bind:value={newDato.recovery_of_expenses} type="number" />
			</td>
			<td>
				<input bind:value={newDato.net_interim_payments} type="number" />
			</td>
			<td>
				<input bind:value={newDato.total_net_payments} type="number" />
			</td>
			<td>
				<input bind:value={newDato.eu_payment_rate_init_plan_eu_amt} type="number" />
			</td>
			<td>
				<input bind:value={newDato.eu_payment_rate_actual_plan_eu_amt} type="number" />
			</td>
		</tr>
	</tbody>
</table>

{#if payment && payment.length > 0}
	<div class="container">
		<div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
			<button
				style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
				on:click={() => {
					showFilter = true;
				}}
				>Filtros
			</button>
		</div>
	</div>
	<div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
		<label>
			Desde:
			<input type="number" bind:value={getFrom} />
		</label>
		<label>
			Hasta:
			<input type="number" bind:value={getTo} />
		</label>
		<button
			style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
			on:click={getFromTo(getFrom, getTo)}
			>Buscar
		</button>
	</div>

	<table class="countryItem">
		<thead>
			<tr>
				<th>MS</th>
				<th>Country Name</th>
				<th>CCI</th>
				<th>Title</th>
				<th>Fund</th>
				<th>Category of Region</th>
				<th>Year</th>
				<th>Initial EU Plan Amount</th>
				<th>Transfers</th>
				<th>Actual EU Plan Amount</th>
				<th>Pre-financing</th>
				<th>Recovery of Pre-financing</th>
				<th>Net Pre-financing</th>
				<th>Interim Payments</th>
				<th>Recovery of Expenses</th>
				<th>Net Interim Payments</th>
				<th>Total Net Payments</th>
				<th>EU Payment Rate (Initial EU Plan Amount)</th>
				<th>EU Payment Rate (Actual EU Plan Amount)</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each payment as pepe}
				<tr>
					<td>{pepe.ms}</td>
					<td><a href="/eu-payment-info/{pepe.ms_name}/{pepe.year}">{pepe.ms_name}</a></td>
					<td>{pepe.cci}</td>
					<td>{pepe.title}</td>
					<td>{pepe.fund}</td>
					<td>{pepe.category_of_region}</td>
					<td>{pepe.year}</td>
					<td>{pepe.init_plan_eu_amt_1_adoption}</td>
					<td>{pepe.transfers}</td>
					<td>{pepe.actual_plan_eu_amt_latest_adop}</td>
					<td>{pepe.pre_fin}</td>
					<td>{pepe.recovery_of_pre_financing}</td>
					<td>{pepe.net_pre_financing}</td>
					<td>{pepe.interim_payments}</td>
					<td>{pepe.recovery_of_expenses}</td>
					<td>{pepe.net_interim_payments}</td>
					<td>{pepe.total_net_payments}</td>
					<td>{pepe.eu_payment_rate_init_plan_eu_amt}</td>
					<td>{pepe.eu_payment_rate_actual_plan_eu_amt}</td>
					<td>
						<button
							style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
							on:click={() => deletePaymentInfo(pepe.cci)}>BORRAR</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div style="margin-top: 20px; display: flex; justify-content: space-between;">
		<button
			style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
			on:click={() => getPaymentInfo()}
			>Anterior
		</button>
		<button
			style="background-color: #0366d6; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
			on:click={() => getNextPage()}
		>
			Siguiente
		</button>
	</div>
{/if}

{#if showFilter}
	<div class="modal">
		<div class="modal-content">
			<span
				class="close"
				on:click={() => {
					showFilter = false;
				}}>&times;</span
			>
			<h2 style="color: #0366d6;">Aplicar filtros</h2>
			<form on:submit|preventDefault={getStatsFilter}>
				<label>
					MS:
					<input type="text" bind:value={selectedFilter.ms} style="margin-bottom: 5px;" />
				</label>
				<label>
					Country Name:
					<input type="text" bind:value={selectedFilter.ms_name} style="margin-bottom: 5px;" />
				</label>
				<label>
					CCI:
					<input type="text" bind:value={selectedFilter.cci} style="margin-bottom: 5px;" />
				</label>
				<label>
					Title:
					<input type="text" bind:value={selectedFilter.title} style="margin-bottom: 5px;" />
				</label>
				<label>
					Fund:
					<input type="text" bind:value={selectedFilter.fund} style="margin-bottom: 5px;" />
				</label>
				<label>
					Category of Region:
					<input
						type="text"
						bind:value={selectedFilter.category_of_region}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Year:
					<input type="number" bind:value={selectedFilter.year} style="margin-bottom: 5px;" />
				</label>
				<label>
					Initial EU Plan Amount:
					<input
						type="number"
						bind:value={selectedFilter.init_plan_eu_amt_1_adoption}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Transfers:
					<input type="number" bind:value={selectedFilter.transfers} style="margin-bottom: 5px;" />
				</label>
				<label>
					Actual EU Plan Amount:
					<input
						type="number"
						bind:value={selectedFilter.actual_plan_eu_amt_latest_adop}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Pre-financing:
					<input type="number" bind:value={selectedFilter.pre_fin} style="margin-bottom: 5px;" />
				</label>
				<label>
					Recovery of Pre-financing:
					<input
						type="number"
						bind:value={selectedFilter.recovery_of_pre_financing}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Net Pre-financing:
					<input
						type="number"
						bind:value={selectedFilter.net_pre_financing}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Interim Payments:
					<input
						type="number"
						bind:value={selectedFilter.interim_payments}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Recovery of Expenses:
					<input
						type="number"
						bind:value={selectedFilter.recovery_of_expenses}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Net Interim Payments:
					<input
						type="number"
						bind:value={selectedFilter.net_interim_payments}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					Total Net Payments:
					<input
						type="number"
						bind:value={selectedFilter.total_net_payments}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					EU Payment Rate (Initial EU Plan Amount):
					<input
						type="number"
						bind:value={selectedFilter.eu_payment_rate_init_plan_eu_amt}
						style="margin-bottom: 5px;"
					/>
				</label>
				<label>
					EU Payment Rate (Actual EU Plan Amount):
					<input
						type="number"
						bind:value={selectedFilter.eu_payment_rate_actual_plan_eu_amt}
						style="margin-bottom: 5px;"
					/>
				</label>
				<button
					type="submit"
					style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
					>Filtrar</button
				>
			</form>
		</div>
	</div>
{/if}

<button
	id="cargarDatos"
	style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
	on:click={getInitial}
>
	Cargar datos
</button>

<div style="margin-top: 20px; display: flex; justify-content: space-between;">
	<button id="crearDatos"
		style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
		on:click={() => {
			createPaymentInfo();
		}}>Crear Nuevo Dato</button
	>
	<a href="https://sos2324-19.appspot.com/eu-payment-info/graphs" style="text-decoration: none;">
        <button id="verGraficas"
            style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Ver Gráficas
        </button>
    </a>
	<button id="eliminarDatos"
		style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
		on:click={() => {
			DeleteAllInfo();
		}}>Eliminar Todos</button
	>
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

	/* Estilos para el popup */
	.modal {
		display: block; /* Muestra el popup */
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.modal-content {
		background-color: #fefefe;
		margin: 15% auto;
		padding: 20px;
		border: 1px solid #888;
		width: 50%;
		border-radius: 5px;
		box-shadow:
			0 4px 8px 0 rgba(0, 0, 0, 0.2),
			0 6px 20px 0 rgba(0, 0, 0, 0.19);
	}

	/* Botón de cerrar (x) del popup */
	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
</style>
