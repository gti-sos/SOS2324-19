<script>
    import {page} from '$app/stores';
    import { dev } from '$app/environment';
    import { Button, Col, Row, Input} from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';

    let API = '/api/v2/policy-program-stats';

    if (dev) API = 'http://localhost:10000/api/v2/policy-program-stats';
   
    let stat = {};
    let errorMsg = '';
    let showForm = false;
    let modifiedData = {}; // Para almacenar los datos modificados

    let country = $page.params.country;
    let year = $page.params.year;


    onMount(async () => {
        await getStat(country,year);
    })

    async function getStat(country,year) {
        try {
            let response = await fetch(API + '/' + country + '/' + year, {
                method: 'GET'
            });

            if (response.status == 200) {
                let res = await response.json();
                stat = res[0];
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
			
            let response = await fetch(API + '/' + country + '/' + year, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stat)
            });

            if (response.status == 200) {
				modifiedData = JSON.stringify(stat);
                showForm = false; // Cerrar el formulario después de modificar
                await getStat(country, year); // Volver a cargar los datos actualizados
            } else {
				if (response.status == 400) {
                errorMsg = 'No puedes cambiar ni el país ni el año';
                alert(errorMsg);
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
    // async function updateStat(){
    //     const updatedStat = {
    //         country:statData?.country,
    //         cci:statData?.cci,
    //         short_title:statData?.short_title,
    //         year:statData?.year,
    //         priority:statData?.priority,
    //         fund:statData?.fund,
    //         to:statData?.to,
    //         fi_name:statData?.fi_name,
    //         fi_address:statData?.fi_address,
    //         is_set_up_at_union_level:statData?.is_set_up_at_union_level,
    //         fi_type:statData?.fi_type,
    //         ex_ante_completion_date:statData?.ex_ante_completion_date,
    //         funding_agreement_signature_date:statData?.funding_agreement_signature_date,
    //         total_amount_committed_to_fi:statData?.total_amount_committed_to_fi,
    //         esif_amount_committed_to_fi:statData?.esif_amount_committed_to_fi,
    //         total_amount_paid_to_fi:statData?.total_amount_paid_to_fi,
    //         esif_amount_paid_to_fi:statData?.esif_amount_paid_to_fi,
    //         management_costs_amount:statData?.management_costs_amount,
    //         base_renumeration_amount:statData?.base_renumeration_amount,
    //         performance_based_renumeration_paid_amount:statData?.performance_based_renumeration_paid_amount,
    //         total_amount_committed_to_final_recipients:statData?.total_amount_committed_to_final_recipients,
    //         esif_amount_committed_to_final_recipients:statData?.esif_amount_committed_to_final_recipients,
    //         total_amount_paid_to_final_recipients:statData?.total_amount_paid_to_final_recipients,
    //         esif_amount_paid_to_final_recipients:statData?.esif_amount_paid_to_final_recipients,
    //         to_code_short_title:statData?.to_code_short_title,
    //         to_long_title:statData?.to_long_title,
    //     };

    //     try{
    //         let response = await fetch(API,{
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(updatedStat)
    //         });
    //     if (response.status == 200){
    //         Msg = "Successfully updated stat"
    //         getStat();
    //         setTimeout(() => {
    //                 Msg= "";
    //             }, 3000);
    //     } else {
    //         errorMsg = "That stat does not exist";
    //         setTimeout(() => {
    //             errorMsg= "";
    //             }, 3000);
    //     }
    //     } catch(e) {
    //         errorMsg = e;
    //     }
    // }
    
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
<!-- 
// </script>
// Details of {stat.country,stat.year}


// {#if statData}
//     <table>
//         <thead>
//             <tr>
//                 <th>
//                     País
//                 </th>
//                 <th>
//                     CCI
//                 </th>
//                 <th>
//                     Título Corto
//                 </th>
//                 <th>
//                     Año
//                 </th>
//                 <th>
//                     Prioridad
//                 </th>
//                 <th>
//                     Fondo
//                 </th>
//                 <th>
//                     Donde va dirigido el fondo
//                 </th>
//                 <th>
//                     Nombre del Fondo
//                 </th>
//                 <th>
//                     Dirección del Fondo
//                 </th>
//                 <th>
//                     Configuración de nivel de Unión
//                 </th>
//                 <th>
//                     Tipo de Fondo
//                 </th>
//                 <th>
//                     Fecha de emisión de financiamiento
//                 </th>
//                 <th>
//                     Fecha de acuerdo de financiamiento
//                 </th>
//                 <th>
//                     Cantidad total comprometido al fondo
//                 </th>
//                 <th>
//                     Cantidad total promedio comprometido al fondo
//                 </th>
//                 <th>
//                     Cantidad total pagado al fondo
//                 </th>
//                 <th>
//                     Cantidad total promedio pagado al fondo
//                 </th>
//                 <th>
//                     Cantidad de costos de gestión
//                 </th>
//                 <th>
//                     Cantidad base de remuneración
//                 </th>
//                 <th>
//                     Cantidad de remuneración basado en el desempeño pagado
//                 </th>
//                 <th>
//                     Cantidad total comprometido a los destinatarios finales
//                 </th>
//                 <th>
//                     Cantidad promedio comprometido a los destinatarios finales
//                 </th>
//                 <th>
//                     Cantidad total pagado a los destinatarios finales
//                 </th>
//                 <th>
//                     Cantidad promedio pagado a los destinatarios finales
//                 </th>
//                 <th>
//                     Código de Título Corto
//                 </th>
//                 <th>
//                     Título Largo
//                 </th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>
//                     <input bind:value={statData.country}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.cci}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.short_title}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.year}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.priority}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.fund}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.to}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.fi_name}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.fi_address}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.is_set_up_at_union_level}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.fi_type}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.ex_ante_completion_date}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.funding_agreement_signature_date}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.total_amount_committed_to_fi}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.esif_amount_committed_to_fi}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.total_amount_paid_to_fi}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.esif_amount_paid_to_fi}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.management_costs_amount}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.base_renumeration_amount}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.performance_based_renumeration_paid_amount}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.total_amount_committed_to_final_recipients}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.esif_amount_committed_to_final_recipients}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.total_amount_paid_to_final_recipients}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.esif_amount_paid_to_final_recipients}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.to_code_short_title}>
//                 </td>
//                 <td>
//                     <input bind:value={statData.to_long_title}>
//                 </td>
//                 <td>
//                     <Button color="primary" on:click="{updateStat}">Actualizar</Button>
//                 </td>
//             </tr>            
//         </tbody>
//     </table>
// {/if}

// {#if Msg != ""}
// <hr>
// {Msg}
// {/if}


// {#if errorMsg != ""}
// <hr>
// ERROR: {errorMsg}
// {/if} -->

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