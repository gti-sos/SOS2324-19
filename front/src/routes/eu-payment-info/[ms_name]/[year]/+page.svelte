<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let API = "http://localhost:10000/api/v2/eu-payment-info";
    
    let country = $page.params.ms_name;
    let year = $page.params.year;
    let errorMsg = '';
    let newData=[];
    let data = [];
    let message = '';
    let err = '';
    let countryData = {
        ms: '',
        ms_name: '',
        cci: '',
        title: '',
        fund: '',
        category_of_region: '',
        year: 0,
        init_plan_eu_amt_1_adoption: 0,
        transfers: 0,
        actual_plan_eu_amt_latest_adop: 0,
        pre_fin: 0,
        recovery_of_pre_financing: 0,
        net_pre_financing: 0,
        interim_payments: 0,
        recovery_of_expenses: 0,
        net_interim_payments: 0,
        total_net_payments: 0,
        eu_payment_rate_init_plan_eu_amt: 0,
        eu_payment_rate_actual_plan_eu_amt: 0
    };
    let structure={
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
    

    onMount( () => {
         loadCountry();
    });

    async function loadCountry() {
        console.log(country+year);
        try {
            let response = await fetch(`${API}/${country}/${year}`);
            if (response.ok) {
                let data = await response.json();
                countryData = { ...countryData, ...data };
            } else {
                errorMsg = 'Error : ' + response.statusText;
            }
        } catch (error) {
            errorMsg = 'Error : ' + error;
        }
    }

    async function putPayment() {
        let response = await fetch(API + '/' + country + '/' + year, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(countryData)
        });
        if (response.status === 200) {
			newData = JSON.stringify(countryData)
			message = 'Se han actualizado los datos correctamente';
			err = '';
        }else if (response.status === 404) {
			message = '';
			err = 'No se ha encontrado el dato';} 
        else if (response.status === 400) {
			message = '';
			err = 'Los datos no son correctos';
		} else if (response.status === 409) {
			message = '';
			err = 'Ya existe ese dato';
		} else {
			message = '';
			err = 'Ha ocurrido un error en el servidor';
		}
        loadCountry()
    }

    console.log(country+year);
</script>

<h1>Payments details of {country}</h1>


<div class="container my-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    Actualizar Datos
                </div>
                <div class="card-body">
                    {#each Object.entries(structure) as [key, value]}
                        <div class="form-group">
                            <label for={key}>{key}</label>
                            <input type="text" class="form-control" id={key} bind:value={countryData[key]} />
                        </div>
                    {/each}
                    <div class="text-center">
                        <button class="btn btn-primary" on:click={putPayment}>Actualizar dato</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
