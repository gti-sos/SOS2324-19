<script>
    import {page} from '$app/stores';
    import { dev } from '$app/environment';
    import { Button, Col, Row, Input} from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';

    let API = '/api/v2/policy-program-stats';

    if (dev) API = 'http://localhost:10000/api/v2/policy-program-stats';
   
    //let stat = {};
    let errorMsg = '';
    let showForm = false;

    
    let country = $page.params.country;
    let year = $page.params.year;

    let stat = [];
    let modifiedData = {
        country: country,
		cci: '',
		short_title: '',
		year: year,
		priority: '',
		fund: '',
		too: 0,
		fi_name: '',
		fi_address: '',
        is_set_up_at_union_level:'', 
        fi_type: '', 
        ex_ante_completion_date: '', 
        funding_agreement_signature_date: '', 
        total_amount_committed_to_fi:0, 
        esif_amount_committed_to_fi:0, 
        total_amount_paid_to_fi: 0, 
        esif_amount_paid_to_fi: 0, 
        management_costs_amount: 0, 
        base_renumeration_amount:0, 
        performance_based_renumeration_paid_amount:0, 
        total_amount_committed_to_final_recipients:0, 
        esif_amount_committed_to_final_recipients:0, 
        total_amount_paid_to_final_recipients: 0, 
        esif_amount_paid_to_final_recipients: 0, 
        to_code_short_title: '', 
        to_long_title: ''
    };
    


    onMount(async () => {
        await getStat();
    })

    async function getStat() {
        try {
            let response = await fetch(`${API}/${country}/${year}`);
            if (response.status == 200) {
                let res = await response.json();
                stat = { ...stat, ...res };
            } else {
                if (response.status == 400) {
                errorMsg = 'Error en la estructura de los datos';
                alert(errorMsg);
            } else if (response.status == 409) {
                errorMsg = 'Ya existe una entrada con ese país y año';
                alert(errorMsg);
            } else if(response.status == 404){
				errorMsg = "Dato no encontrado";
				alert(errorMsg);
			}
            }
			console.log("Datos Originales: " + JSON.stringify(stat))
        } catch (e) {
            errorMsg = e;
        }
    }
      // Función para enviar la modificación
      async function putStat() {
        try {
			
            let response = await fetch(`${API}/${country}/${year}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stat)
            });
            if (response.status == 500) {
                showForm = true;
                errorMsg = 'No puedes cambiar ni el país ni el año';
                alert(errorMsg);
            } else {
				if (response.status == 200) {
                    modifiedData = JSON.stringify(stat);
                    showForm = false; // Cerrar el formulario después de modificar
                    await getStat(country, year); // Volver a cargar los datos actualizados
                } else if (response.status == 409) {
                    errorMsg = 'Ya existe una entrada con ese país y año';
                    alert(errorMsg);
                } else if(response.status == 404){
                    errorMsg = "Dato no encontrado";
                    alert(errorMsg);
			    }
            }
			
			console.log("Datos Modificados: "+JSON.stringify(modifiedData));
        } catch (e) {
            errorMsg = e;
        }
    }

</script>

<h2>Stat details from {country}:{year}</h2>

{#if !showForm}
    {#if Object.keys(stat).length > 0}
        <div class="container">
            <div class="card">
                <table>
                    <thead>
                        <th> Atributos </th>
                        <th> Valor </th>
                    </thead>
                    <tbody>
                        {#each Object.entries(stat) as [key, value]}
                            <tr>
                                <td class="attribute">{key}:</td>
                                <td class="value">
                                    {#if typeof value === 'object'}
                                        {JSON.stringify(value)}
                                    {:else}
                                        {value}
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
                <div style="text-align:center ;margin-top: 20px; display: flex; justify-content: space-between;">
                    <button
                        style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                        
						on:click={() => {  showForm = true; }}
                    >
                        Modificar Datos
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <p class="container">No hay datos disponibles</p>
    {/if}
{:else}
    <!-- Formulario para modificar la entrada -->
    <div class="container">
        <div class="card">
            <h2>Modificar Datos</h2>
            <form on:submit|preventDefault={putStat}>
				<table>
					<tbody>
						{#each Object.entries(stat) as [key, value]}
							<tr>
								<td class="attribute">{key}:</td>
								<td class="value">
									<input type="text" bind:value={stat[key]} />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div style="margin-top: 20px; display: flex; justify-content: space-between;">
					<button
						type="submit"
						style="text-align:center ;background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => { showForm = false; putStat(); }}
					>
						Guardar Cambios
					</button>
					<button
						style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
						on:click={() => { showForm = false; }}
					>
						Cancelar
					</button>
				</div>
			</form>
			
        </div>
    </div>
{/if}

{#if errorMsg}
    <p class="error">ERROR: {errorMsg}</p>
{/if}

<style>
	
	.card {
		background-color: #ffffff;
		border: 1px solid #a4caef;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		padding: 20px;
		max-width: 600px;
		margin: 0 auto;
	}
	

	table {
		width: 100%;
		border-collapse: collapse;
	}
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:nth-child(even) {
		background-color: #f2f2f2; /* Gris claro */
	}

	tr:hover {
		background-color: #e2e2e2; /* Gris más claro */
	}

	.value {
		width: 50%; /* Ancho de la columna de valores */
	}

	/* Estilo para los títulos */
	h2 {
		text-align: center;
		color: #0366d6; /* Azul */
	}

    /* Estilos para los inputs del formulario */
    input[type='text'] {
        width: 100%;
        padding: 12px 20px;
        margin: 8px 0;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
    }

    input[type='text']:focus {
        border: 3px solid #555;
    }

    /* Estilo para los mensajes de error */
    .error {
        color: red;
        font-weight: bold;
    }
</style>