<script>
    import {page} from '$app/stores';
    import { dev } from '$app/environment';
    import { Button, Col, Row, Input} from '@sveltestrap/sveltestrap';
    import { onMount } from 'svelte';

    let API = '/api/v2/policy-program-stats';

    if (dev) API = 'http://localhost:10000/api/v2/policy-program-stats';
   
    //let stat = {};
    let errorMsg = '';
    let Msg = '';
    let showForm = false;
    let modifiedData = {};
    
    let country = $page.params.country;
    let year = $page.params.year;

    let dato = [];

    onMount(async () => {
        await getStat(country,year);
    })

    async function getStat(country,year) {
        try {
            let response = await fetch(API + '/' + country + '/' + year, {
                method: 'GET',
                headers: {
					'Content-Type': 'application/json'
				}
            });
            if (response.status == 200) {
                let res = await response.json();
                dato = res;
                console.log("Dato: "+ dato);
            } else {
                if (response.status == 400) {
                errorMsg = 'Error en la estructura de los datos';
            } else if (response.status == 409) {
                errorMsg = 'Ya existe una entrada con ese país y año';
            } else if(response.status == 404){
				errorMsg = "Dato no encontrado";
			}
            }
			console.log("Datos Originales: " + JSON.stringify(dato))
        } catch (e) {
            errorMsg = e;
        }
    }
      // Función para enviar la modificación
      async function putStat() {
        if (Object.values(dato).some(value => value === '' || value === null)) {
            showForm = false;
            errorMsg = 'Por favor, completa todos los campos.';
            return;
        }
        try {
			
            let response = await fetch(API+'/'+country+'/'+year, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dato)
            });
            if (response.status == 200) {
				modifiedData = JSON.stringify(dato);
                showForm = false; // Cerrar el formulario después de modificar
                await getStat(country, year);
                Msg=`Datos modificados con exito del stat ${country} y ${year}`;
            } else {
				if(response.status == 404){
                    errorMsg = "Dato no encontrado";
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
    {#if Object.keys(dato).length > 0}
        <div class="container">
            <div class="card">
                <table>
                    <thead>
                        <th> Atributos </th>
                        <th> Valor </th>
                    </thead>
                    <tbody>
                        {#each Object.entries(dato) as [key, value]}
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
                    <button
                        style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                        
						on:click={() => { window.location.href = 'https://sos2324-19.appspot.com/policy-program-stats'; }}
                    >
                        Ir a la pagina principal
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
						{#each Object.entries(dato) as [key, value]}
							<tr>
								<td class="attribute">{key}:</td>
								<td class="value">
									{#if key=="country" || key=="year"}
                                        {dato[key]}
                                    {:else}
                                        {#if key=="cci"}
                                            <input id="cciimpute" type="text" bind:value={dato[key]} />
                                        {:else}
                                            <input id="${key}impute" type="text" bind:value={dato[key]} />
                                        {/if}
                                    {/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<div style="margin-top: 20px; display: flex; justify-content: space-between;">
					<button id="editButton"
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

{#if errorMsg != ""}
        <hr>ERROR: {errorMsg}
{:else}
    {#if Msg != ""}
        <hr>EXITO: {Msg}
    {/if}
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
</style>