<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { get } from 'express/lib/response';

	let API = 'http://localhost:10000/api/v1/esif-payments';

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
			err = 'Los datos iniciales ya estan cargados';
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
</script>

<div class="container-fluid">
	<table>
		<thead>
			<th>ms</th>
			<th>ms_name</th>
			<th>cci</th>
			<th>title</th>
			<th>fund</th>
			<th>category_of_region</th>
			<th>year</th>
			<th>net_planned_eu_amount</th>
			<th>cumulative_initial_pre_financing</th>
			<th>cumulative_additional_initial_pre_financing</th>
			<th>recovery_of_initial_pre_financing</th>
			<th>cumulative_annual_pre_financing</th>
			<th>pre_financing_covered_by_expenditure</th>
			<th>recovery_of_annual_pre_financing</th>
			<th>net_pre_financing</th>
			<th>cumulative_interim_payments</th>
			<th>recovery_of_expenses</th>
			<th>net_interim_payments</th>
			<th>total_net_payments</th>
			<th>eu_payment_rate</th>
			<th>eu_payment_rate_on_planned_eu_amount</th>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value={structure.ms} /></td>
				<td><input bind:value={structure.ms_name} /></td>
				<td><input bind:value={structure.cci} /></td>
				<td><input bind:value={structure.title} /></td>
				<td><input bind:value={structure.fund} /></td>
				<td><input bind:value={structure.category_of_region} /></td>
				<td><input bind:value={structure.year} /></td>
				<td><input bind:value={structure.net_planned_eu_amount} /></td>
				<td><input bind:value={structure.cumulative_initial_pre_financing} /></td>
				<td><input bind:value={structure.cumulative_additional_initial_pre_financing} /></td>
				<td><input bind:value={structure.recovery_of_initial_pre_financing} /></td>
				<td><input bind:value={structure.cumulative_annual_pre_financing} /></td>
				<td><input bind:value={structure.pre_financing_covered_by_expenditure} /></td>
				<td><input bind:value={structure.recovery_of_annual_pre_financing} /></td>
				<td><input bind:value={structure.net_pre_financing} /></td>
                <td><input bind:value={structure.cumulative_interim_payments} /></td>
                <td><input bind:value={structure.recovery_of_expenses} /></td>
                <td><input bind:value={structure.net_interim_payments} /></td>
                <td><input bind:value={structure.total_net_payments} /></td>
                <td><input bind:value={structure.eu_payment_rate} /></td>
                <td><input bind:value={structure.eu_payment_rate_on_planned_eu_amount} /></td>
			</tr>
		</tbody>
	</table>
    </ul>
</div>
