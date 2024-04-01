<script>
    import {onMount} from "svelte";
    import { dev } from "$app/environment";
    import {Styles,Button, Col, Row,Table,Input} from '@sveltestrap/sveltestrap';

    let API = "http://localhost:10000/api/v2/policy-program-stats"
   
    let stats = []
    let errorMsg = "";
    let Msg = ""; 
    let showForm = false;
	let showFilter = false;
	let page = 1;
	let totalPages = 1;
	let totalDatos = 0;
	let selectedFilter = {
		country: '',
		cci: '',
		short_title: '',
		year: '',
		priority: '',
		fund: '',
		to: '',
		fi_name: '',
		fi_address: '',
        is_set_up_at_union_level:'', 
        fi_type: '', 
        ex_ante_completion_date: '', 
        funding_agreement_signature_date: '', 
        total_amount_committed_to_fi:'', 
        esif_amount_committed_to_fi:'', 
        total_amount_paid_to_fi: '', 
        esif_amount_paid_to_fi: '', 
        management_costs_amount: '', 
        base_renumeration_amount:'', 
        performance_based_renumeration_paid_amount:'', 
        total_amount_committed_to_final_recipients:'', 
        esif_amount_committed_to_final_recipients:'', 
        total_amount_paid_to_final_recipients: '', 
        esif_amount_paid_to_final_recipients: '', 
        to_code_short_title: '', 
        to_long_title: ''
	};

    const newStat = { 
        country: '',
		cci: '',
		short_title: '',
		year: '',
		priority: '',
		fund: '',
		to: '',
		fi_name: '',
		fi_address: '',
        is_set_up_at_union_level:'', 
        fi_type: '', 
        ex_ante_completion_date: '', 
        funding_agreement_signature_date: '', 
        total_amount_committed_to_fi:'', 
        esif_amount_committed_to_fi:'', 
        total_amount_paid_to_fi: '', 
        esif_amount_paid_to_fi: '', 
        management_costs_amount: '', 
        base_renumeration_amount:'', 
        performance_based_renumeration_paid_amount:'', 
        total_amount_committed_to_final_recipients:'', 
        esif_amount_committed_to_final_recipients:'', 
        total_amount_paid_to_final_recipients: '', 
        esif_amount_paid_to_final_recipients: '', 
        to_code_short_title: '', 
        to_long_title: ''
    }

    onMount(async() => {
        await getStats();
    })

    async function getStatsFilter() {
		try {
			// Construye la URL de búsqueda a partir de los filtros proporcionados
			let searchParams = new URLSearchParams();
			if (selectedFilter.length == 0) {
				selectedFilter = {
					country: '',
                    cci: '',
                    short_title: '',
                    year: '',
                    priority: '',
                    fund: '',
                    to: '',
                    fi_name: '',
                    fi_address: '',
                    is_set_up_at_union_level:'', 
                    fi_type: '', 
                    ex_ante_completion_date: '', 
                    funding_agreement_signature_date: '', 
                    total_amount_committed_to_fi:'', 
                    esif_amount_committed_to_fi:'', 
                    total_amount_paid_to_fi: '', 
                    esif_amount_paid_to_fi: '', 
                    management_costs_amount: '', 
                    base_renumeration_amount:'', 
                    performance_based_renumeration_paid_amount:'', 
                    total_amount_committed_to_final_recipients:'', 
                    esif_amount_committed_to_final_recipients:'', 
                    total_amount_paid_to_final_recipients: '', 
                    esif_amount_paid_to_final_recipients: '', 
                    to_code_short_title: '', 
                    to_long_title: ''
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
				stats = data;
				console.log(data);
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
			console.error(error);
		}
	}

    async function getInitial(){
        try{
            if(stats.length === 0){

                let response = await fetch(API+"/loadInitialData",{
                                      method: "GET"
                });

                if(response.ok){
                    getStats();
                    alert('Datos Cargados Correctamente');
                    errorMsg = "";
					
                } else {
                    errorMsg = "Error al cargar los datos";
                }
            } else {
                errorMsg = "Ya existen datos en la base de datos";
            }
            
        } catch(e){
            errorMsg = e;
        }
        
    }
    async function getStats() {
        try {
            let response = await fetch(API,{
                                      method: "GET"
            });
            if(response.ok){
                let data = await response.json();
                stats = data;
                console.log(data);
                Msg = "Se han cargado los stats";
                errorMsg = "";
            } else {
                if(response.status == 404){
                    let data = await response.json();
                    stats = data;
                    console.log(data);
                    errorMsg = "No hay datos en la base de datos";
                } else {
                    errorMsg = `Error ${response.status}: ${response.statusText}`;
                }
            }
        } catch(e) {
            errorMsg = e;
        }
            
    }
    function goToPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      getStats(currentPage);
    }
  }

  // Función para ir a la página siguiente
  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      getStats(currentPage);
    }
  }
  function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      getStats();
    }
  }

    async function DeleteStat(c,y) {
        try {
            let response = await fetch(API+'/'+c+'/'+y,{
                method: "DELETE"
            });
            console.log(`Deleting stat with country ${c} in year ${y}`);
        
        if (response.status == 200){
            await getStats();
            if (stats.length === 0) {
                    errorMsg = "No hay datos disponibles";
                }
                Msg = "Dato eliminado correctamente";
                errorMsg = "";
        } else {
			errorMsg = 'No se ha podido borrar';
			alert(errorMsg);	
		}
        } catch(e) {
            errorMsg = e;
        }
    }

    async function DeleteAllStats() {
        try {
            let response = await fetch(API,{
                method: "DELETE"
            });
            if (response.status == 200) {
                alert("Todas las entradas han sido eliminadas");
                getStats();
                location.reload();
			} else {
				errorMsg = 'Ya estan borrados todas las stats';
				alert(errorMsg);
			}
        } catch(e) {
            errorMsg = e;
            
        }
        }
    
            
    async function CreateStat() {
        try {
            let response = await fetch(API,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newStat)
            });
            let status = await response.status;
            console.log(`Creation response status ${status}`)

         if(response.status == 201){
            showForm = false;
            await getStats();
            Msg = "Dato creado correctamente";
            errorMsg = "";
        } else {
            if (response.status == 400) {
                errorMsg = 'Error en la estructura de los datos';
                alert(errorMsg);
            } else if (response.status == 409) {
                errorMsg = 'Ya existe un stat con los mismos datos';
                alert(errorMsg);
            } else if (response.status == 404) {
                errorMsg = 'Dato no encontrado';
                alert(errorMsg);
            }
        }
        } catch(e) {
            errorMsg = e;
            console.error(error);
        }
    }

</script>

{#if stats && stats.length > 0}
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
		<table>
			<thead>
				<tr>
					<th>Vista detallada</th>
					<th>
                        País
                    </th>
                    <th>
                        CCI
                    </th>
                    <th>
                        Título Corto
                    </th>
                    <th>
                        Año
                    </th>
                    <th>
                        Prioridad
                    </th>
                    <th>
                        Fondo
                    </th>
                    <th>
                        Donde va dirigido el fondo
                    </th>
                    <th>
                        Nombre del Fondo
                    </th>
                    <th>
                        Dirección del Fondo
                    </th>
                    <th>
                        Configuración de nivel de Unión
                    </th>
                    <th>
                        Tipo de Fondo
                    </th>
                    <th>
                        Fecha de emisión de financiamiento
                    </th>
                    <th>
                        Fecha de acuerdo de financiamiento
                    </th>
                    <th>
                        Cantidad total comprometido al fondo
                    </th>
                    <th>
                        Cantidad total promedio comprometido al fondo
                    </th>
                    <th>
                        Cantidad total pagado al fondo
                    </th>
                    <th>
                        Cantidad total promedio pagado al fondo
                    </th>
                    <th>
                        Cantidad de costos de gestión
                    </th>
                    <th>
                        Cantidad base de remuneración
                    </th>
                    <th>
                        Cantidad de remuneración basado en el desempeño pagado
                    </th>
                    <th>
                        Cantidad total comprometido a los destinatarios finales
                    </th>
                    <th>
                        Cantidad promedio comprometido a los destinatarios finales
                    </th>
                    <th>
                        Cantidad total pagado a los destinatarios finales
                    </th>
                    <th>
                        Cantidad promedio pagado a los destinatarios finales
                    </th>
                    <th>
                        Código de Título Corto
                    </th>
                    <th>
                        Título Largo
                    </th>
					<th>Eliminar dato</th>
				</tr>
			</thead>
			<tbody>
				{#each stats as dato}
					<tr>
						<td>
							<!-- Botón de eliminar -->
							<a
								href="/policy-program-stats/{dato.country}/{dato.year}"
								style="text-decoration: none; background-color: #666666; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; display: inline-block;"
							>
								Ver detalles
							</a>
						</td>
						{#each Object.values(dato) as value}
							<td>{value}</td>
						{/each}
						<td>
							<button
								style="background-color: #FF0000; color: white; padding: 5px 20px; border: none; border-radius: 5px; cursor: pointer;"
								on:click={() => DeleteStat(dato.country, dato.year)}>Eliminar</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button
                style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {
                    showForm = true;
                }}>Crear Nuevo Dato
            </button>
            <button
                style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {
<<<<<<< HEAD
=======
                     DeleteAllStats();
                }}>Eliminar Todos Los Datos
            </button>
<<<<<<< HEAD
=======
            <button
                style="background-color: #FF0000; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                on:click={() => {
>>>>>>> c4c714dcf01ad517a25ab551ea7a23edc2422a15
                    DeleteAllStats();
                }}>Eliminar Todos</button
            >
>>>>>>> 5b41d661fadd9198175db98d1edc602e41334987
        </div>
    </div>


    {#if showForm}
            <div class="modal">
                <div class="modal-content">
                    <span
                        class="close"
                        on:click={() => {
                            showForm = false;
                        }}>&times;</span>
                    <h2 style="color: #0366d6;">Crear Nueva Entrada</h2>
                    <form on:submit|preventDefault={CreateStat}>
                        <label>
                            Pais:
                            <input type="text" bind:value={newStat.country} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cci:
                            <input type="text" bind:value={newStat.cci} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Titulo Corto:
                            <input type="text" bind:value={newStat.short_title} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Año:
                            <input type="number" bind:value={newStat.year} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Prioridad:
                            <input type="text" bind:value={newStat.priority} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Fondo:
                            <input type="text" bind:value={newStat.fund} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Donde va dirigido:
                            <input type="text" bind:value={newStat.to} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Nombre del Fondo:
                            <input type="text" bind:value={newStat.fi_name} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Dirección del Fondo:
                            <input type="text" bind:value={newStat.fi_address} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Configuración de nivel de Unión:
                            <input type="text" bind:value={newStat.is_set_up_at_union_level} style="margin-bottom: 10px;" required/>

                        </label>
                        <label>
                            Tipo de Fondo:
                            <input type="text" bind:value={newStat.fi_type} style="margin-bottom: 10px;" required/>

                        </label>
                        <label>
                            Fecha de emisión de financiamiento:
                            <input bind:value={newStat.ex_ante_completion_date} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Fecha de acuerdo de financiamiento:
                            <input bind:value={newStat.funding_agreement_signature_date} style="margin-bottom: 10px;" required/>

                        </label>
                        <label>
                            Cantidad total comprometido al fondo:
                            <input type="number" bind:value={newStat.total_amount_committed_to_fi} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad total promedio comprometido al fondo:
                            <input type="number" bind:value={newStat.esif_amount_committed_to_fi} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad total pagado al fondo:
                            <input type="number" bind:value={newStat.total_amount_paid_to_fi} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad total promedio pagado al fondo:
                            <input type="number" bind:value={newStat.esif_amount_paid_to_fi} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad de costos de gestión:
                            <input type="number" bind:value={newStat.management_costs_amount} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad base de remuneración:
                            <input type="number" bind:value={newStat.base_renumeration_amount} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad de remuneración basado en el desempeño pagado:
                            <input type="number" bind:value={newStat.performance_based_renumeration_paid_amount} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad total comprometido a los destinatarios finales:
                            <input type="number" bind:value={newStat.total_amount_committed_to_final_recipients} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad promedio comprometido a los destinatarios finales:
                            <input type="number" bind:value={newStat.esif_amount_committed_to_final_recipients} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad total pagado a los destinatarios finales:
                            <input type="number" bind:value={newStat.total_amount_paid_to_final_recipients} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Cantidad promedio pagado a los destinatarios finales:
                            <input type="number" bind:value={newStat.esif_amount_paid_to_final_recipients} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Código de Título Corto:
                            <input type="text" bind:value={newStat.to_code_short_title} style="margin-bottom: 10px;" required/>
                        </label>
                        <label>
                            Título Largo:
                            <input type="text" bind:value={newStat.to_long_title} style="margin-bottom: 10px;" required/>
                        </label>
                        <button
                            type="submit"
                            style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
                            >Crear</button
                        >
                    </form>
                </div>
            </div>
    {/if}

    {#if showFilter}
            <div class="modal">
                <div class="modal-content">
                    <span
                        class="close"
                        on:click={() => {
                            showFilter = false;
                        }}>&times;</span>
                    <h2 style="color: #0366d6;">Aplicar filtros</h2>
                    <form on:submit|preventDefault={getStatsFilter}>
                        <label>
                            Pais:
                            <input type="text" bind:value={selectedFilter.country} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cci:
                            <input type="text" bind:value={selectedFilter.cci} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Titulo Corto:
                            <input type="text" bind:value={selectedFilter.short_title} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Año:
                            <input type="number" bind:value={selectedFilter.year} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Prioridad:
                            <input type="text" bind:value={selectedFilter.priority} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Fondo:
                            <input type="text" bind:value={selectedFilter.fund} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Donde va dirigido:
                            <input type="text" bind:value={selectedFilter.to} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Nombre del Fondo:
                            <input type="text" bind:value={selectedFilter.fi_name} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Dirección del Fondo:
                            <input type="text" bind:value={selectedFilter.fi_address} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Configuración de nivel de Unión:
                            <input type="text" bind:value={selectedFilter.is_set_up_at_union_level} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Tipo de Fondo:
                            <input type="text" bind:value={selectedFilter.fi_type} style="margin-bottom: 5px;" />
            
                        </label>
                        <label>
                            Fecha de emisión de financiamiento:
                            <input bind:value={selectedFilter.ex_ante_completion_date} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Fecha de acuerdo de financiamiento:
                            <input bind:value={selectedFilter.funding_agreement_signature_date} style="margin-bottom: 5px;" />
            
                        </label>
                        <label>
                            Cantidad total comprometido al fondo:
                            <input type="number" bind:value={selectedFilter.total_amount_committed_to_fi} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad total promedio comprometido al fondo:
                            <input type="number" bind:value={selectedFilter.esif_amount_committed_to_fi} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad total pagado al fondo:
                            <input type="number" bind:value={selectedFilter.total_amount_paid_to_fi} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad total promedio pagado al fondo:
                            <input type="number" bind:value={selectedFilter.esif_amount_paid_to_fi} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad de costos de gestión:
                            <input type="number" bind:value={selectedFilter.management_costs_amount} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad base de remuneración:
                            <input type="number" bind:value={selectedFilter.base_renumeration_amount} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad de remuneración basado en el desempeño pagado:
                            <input type="number" bind:value={selectedFilter.performance_based_renumeration_paid_amount} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad total comprometido a los destinatarios finales:
                            <input type="number" bind:value={selectedFilter.total_amount_committed_to_final_recipients} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad promedio comprometido a los destinatarios finales:
                            <input type="number" bind:value={selectedFilter.esif_amount_committed_to_final_recipients} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad total pagado a los destinatarios finales:
                            <input type="number" bind:value={selectedFilter.total_amount_paid_to_final_recipients} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Cantidad promedio pagado a los destinatarios finales:
                            <input type="number" bind:value={selectedFilter.esif_amount_paid_to_final_recipients} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Código de Título Corto:
                            <input type="text" bind:value={selectedFilter.to_code_short_title} style="margin-bottom: 5px;" />
                        </label>
                        <label>
                            Título Largo:
                            <input type="text" bind:value={selectedFilter.to_long_title} style="margin-bottom: 5px;" />
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
        {#if errorMsg != ''}
            ERROR: {errorMsg}
        {/if}
{:else}
<div style="justify-content: center; text-align: center; margin-top: 20px">
    <button
        style="background-color: #0366d6; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
        on:click={() => getInitial()}>
        Cargar Los Datos
    </button>
</div>
<p class="container">No hay datos disponibles</p>
{/if}

<style>
	.container {
		margin: 50px auto;
		padding: 20px;
	}

	table {
		width: 200px;
		border-collapse: collapse;
	}

	th,
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

	/* Estilos para los inputs del formulario */
	input[type='text'],
	input[type='number'] {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 4px;
		resize: vertical;
	}

	input[type='text']:focus,
	input[type='number']:focus {
		border: 3px solid #555;
	}
</style>
