<script>
    import {page} from '$app/stores';
    import { dev } from '$app/environment';
    import { onMount } from 'svelte';

    let API = 'api/v2/esif-payments';

	if (dev) API = 'http://localhost:10000/' + API;

    let message = '';
    let err = '';
    let data = [];
    let country = $page.params.ms_name;
    let cci = $page.params.cci;
    console.log(data);

    let structure = {
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

    onMount(async () => {
        await getPayment();
    });
    async function getPayment() {
        let response = await fetch(API + '/' + country + '/' + cci, {
            method: 'GET'
        });
        if (response.status === 200) {
            console.log("entro");
            data = await response.json();
        }else if(response.status === 404){
            console.log("me cago");
            err = `No se ha encontrado el dato del pais ${country} con cci ${cci} `;
    }   else {
            err = 'Ha ocurrido un error en el servidor';
        }
    }
    async function putPayment(){
        let response = await fetch(API + '/' + country + '/' + cci, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(structure)
        });
        if (response.status === 200) {
            getPayment();
            message = 'Se ha actualizado correctamente';
            err = '';
        }else if (response.status === 404){
            message = '';
            err = `No se ha encontrado el dato del pais ${country} con cci ${cci} `;
        }else if (response.status === 400) {
            message = '';
            err = 'La estructura del dato no es la correcta';
        }else {
            message = '';
            err = 'Ha ocurrido un error en el servidor';
        }
    }
    console.log(data);
</script>
HOla
