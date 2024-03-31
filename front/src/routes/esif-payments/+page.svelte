<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { get } from 'express/lib/response';

	let API = 'http://localhost:10000/api/v1/esif-payments';

    let message = "";
	let err = "";
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
        let response = await fetch(API + "/loadInitialData",{
                            method: "GET"
                        });
        if (response.status === 201) {
            message = "Se han cargado los datos correctamente";
            err = "";
        } else if (response.status === 405) {
            message = "";
            err = "Los datos iniciales ya estan cargados";
        } else {
            message = "";
            err = "Ha ocurrido un error en el servidor";
        }
    }

	async function getPayments() {
		let response = await fetch(API,{
                            method: "GET"});
        if (response.status === 200) {
            data = await response.json();
            message = "Se han cargado los datos correctamente";
            err = "";
        } else if (response.status === 404) {
            message = "";
            err = "No se han encontrado datos";
        } else {
            message = "";
            err = "Ha ocurrido un error en el servidor";
        }
	}
    async function deletePayment(){
        let response = await fetch(API + "/" + ms_name + "/" + cci,{
                            method: "DELETE"});
        if (response.status === 200) {
            message = "Se han eliminado los datos correctamente";
            err = "";
        } else if (response.status === 404) {
            message = "";
            err = "No se han encontrado datos";
        } else {
            message = "";
            err = "Ha ocurrido un error en el servidor";
        }
    }
    async function deleteAllPayments() {
        let response = await fetch(API,{
                            method: "DELETE"});
        if (response.status === 200) {
            getPayments();
            message = "Se han eliminado los datos correctamente";
            err = "";
        } else if (response.status === 404) {
            message = "";
            err = "No se han encontrado datos";
        } else {
            message = "";
            err = "Ha ocurrido un error en el servidor";
        }
    }
    async function createPayment() {
        let response = await fetch(API,{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(newPayment)});

        if (response.status === 201) {
            getPayments();
            message = "Se han creado los datos correctamente";
            err = "";
        } else if (response.status === 400) {
            message = "";
            err = "Los datos no son correctos";
        } else if (response.status === 409) {
            message = "";
            err = "Ya existe ese dato";
        }else {
            message = "";
            err = "Ha ocurrido un error en el servidor";
        }
    }


</script>
