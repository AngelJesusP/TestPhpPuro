const historialVenta = {
    template: `
        <div>
            <div class="d-flex">
                <div class="col-sm-7">
                    <div class="card mt-3">
                        <div class="card-header bg-dark">
                             <router-link class="btn btn-outline-light float-right" to="/">Menu principal</router-link> 
                             <button v-on:click="setGraficar" class="btn btn-outline-light">mostrar</button>         
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col">
                                    <div class="form-check">
                                      <input class="form-check-input" type="radio" name="exampleRadios" id="radioProductoMasVendidos" value="prod" checked>
                                      <label class="form-check-label" for="radioProductoMasVendidos">
                                        Productos mas vendidos
                                      </label>
                                    </div>
                                    <hr />
                                    
                                    <div class="form-check mt-2">
                                      <input class="form-check-input" type="radio" name="exampleRadios" id="radioVendiosFecha" value="prod">
                                      <label class="form-check-label" for="radioVendiosFecha">
                                        Productos vendidos por fecha
                                      </label>
                                    </div>
                                    <label class="mt-4" for="fecha">Escoja la fecha a consultar: </label>
                                    <input type="date" class="form-control" id="fecha" />
                                    
                                    <hr />
                                    <div class="form-check mt-2">
                                      <input class="form-check-input" type="radio" name="exampleRadios" id="radioProductoCliente" value="prod">
                                      <label class="form-check-label" for="radioProductoCliente">
                                        Productos mas vendidos por un cliente
                                      </label>
                                    </div>
                                    <label class="mt-4" for="cedulaBuscar">*Digite la cedula del cliente a buscar: </label>
                                    <input type="number" class="form-control" id="cedulaBuscar" 
                                     autocomplete="off" placeholder="Digite la cedula del cliente" required="true"/>
                                    
                                    <button v-on:click="setCargarTodosProdutos" class="btn btn-dark mt-3">Realizar consulta</button>
                                </div>
                                <div class="col">
                                    <div class="card">
                                        <div class="card-header bg-dark">
                                            <label class="text-white">Tipos de diagramas</label>
                                        </div>
                                        <div class="card-body">
                                            <div class="form-check">
                                              <input class="form-check-input" type="radio" name="exampleRadios2" id="diagramaLinea" value="line" checked>
                                              <label class="form-check-label" for="diagramaLinea">
                                                Diagrama de linea
                                              </label>
                                            </div>
                                            <div class="form-check mt-2">
                                              <input class="form-check-input" type="radio" name="exampleRadios2" id="diagramaBarra" value="bar" checked>
                                              <label class="form-check-label" for="diagramaBarra">
                                                Diagrama de Barra
                                              </label>
                                            </div>
                                            <div class="form-check mt-2">
                                              <input class="form-check-input" type="radio" name="exampleRadios2" id="diagramaCircular" value="pie" checked>
                                              <label class="form-check-label" for="diagramaCircular">
                                                Diagrama Circular
                                              </label>
                                            </div>
                                            <div class="form-check mt-2">
                                              <input class="form-check-input" type="radio" name="exampleRadios2" id="tabla" value="tabla" checked>
                                              <label class="form-check-label" for="tabla">
                                                Ver solo en una tabla
                                              </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>           
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-5">
                    <canvas id="myChart" width="400" height="400"></canvas>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            nombreProductos: [],
            datosProductos: [],
            coloresDiagrama: []
        }
    },
    methods: {

        setCargarTodosProdutos: function () {
            let productosVendidos = document.getElementById('radioProductoMasVendidos').checked;
            let radioVendiosFecha = document.getElementById('radioVendiosFecha').checked;
            let radioProductoCliente = document.getElementById('radioProductoCliente').checked;
            let tipoDiagrama = '';
            const radios = document.getElementsByTagName('input');

            /* bucle para obtener el tipo de diagrama segun el radio button */
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].type === 'radio' && radios[i].checked) {
                    if  (radios[i].value !== 'prod') {
                        tipoDiagrama = radios[i].value;
                    }
                }
            }

            if (productosVendidos) {
                const json = { "consulta": "all" }
                this.getAxios(json, tipoDiagrama);

            } else if(radioVendiosFecha) {
                var dateControl = document.querySelector('input[type="date"]');
                const json = {
                    "consulta": "fecha",
                    "fecha": dateControl.value
                }
                this.getAxios(json, tipoDiagrama);

            } else if (radioProductoCliente) {
                let cedulaBuscar = document.getElementById('cedulaBuscar').value;
                if (cedulaBuscar === "") {
                    this.getMessageALert('Debe ingresar la cedula','Ingrese la cedula del cliente para realizar la busqueda', 'Campo vacio')
                } else {
                    const json = {
                        "consulta": "buscar",
                        "cedula": cedulaBuscar
                    }
                    this.getAxios(json, tipoDiagrama);
                }
            } else {
                this.getMessageALert('Debe seleccionar una opcion','Seleccione una opcion para realizar la consulta','Campos vacios')
            }
        },
        getAxios: function (json, tipoDiagrama) {
            this.nombreProductos = [];
            this.datosProductos = [];
            axios.get('Php/Api/historial.php', {
                params: json
            }).then(response => {
                let cantidad = response.data.data.length;
                this.calcularDatosProductos(cantidad, response.data.data, tipoDiagrama);
            }).catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Sin resultados',
                    text: 'No se encontraron resultados de la consulta',
                    footer: '<a href>Proceso completado</a>'
                });
            });
        },
        calcularDatosProductos: function (cantidad, response, tipoDiagrama) {
            let posicion = -1;
            let contador = 0;
            for (let i=0; i<cantidad; i++) {
                let encontrado = false;
                for (let j=0; j<contador; j++) {
                    if (this.nombreProductos.length === 0) {
                        encontrado = false;
                    } else if (response[i].nombreProducto === this.nombreProductos[j]) {
                        encontrado = true;
                        posicion = j;
                    }
                }
                if (encontrado) {
                    this.datosProductos[posicion]++;
                } else {
                    this.nombreProductos.push(response[i].nombreProducto);
                    this.datosProductos.push(1);
                    contador++;
                }
            }
            this.setGraficar(tipoDiagrama);
        },
        setGraficar: function (tipo) {
            this.setGenerarColores();
            var ctx = document.getElementById('myChart').getContext('2d');

            var myChart = new Chart(ctx, {
                type: tipo,
                data: {
                    labels: this.nombreProductos,
                    datasets: [{
                        label: 'GRAFICA DE HISTORIAL DE COMPRAS',
                        data: this.datosProductos,
                        backgroundColor: this.coloresDiagrama,
                        borderColor: 'rgb(34,32,111)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                },
                legend: {
                    onHover: function(e) {
                        e.target.style.cursor = 'pointer';
                    }
                },
                hover: {
                    onHover: function(e) {
                        var point = this.getElementAtEvent(e);
                        if (point.length) e.target.style.cursor = 'pointer';
                        else e.target.style.cursor = 'default';
                    }
                }
            });
        },
        setGenerarColores: function () {
            for (let i=0; i<10; i++) {
                this.coloresDiagrama.push('rgba('+parseInt(Math.random()*785)+',' +
                    ''+parseInt(Math.random()*653)+',' +
                    ''+parseInt(Math.random()*329)+', 0.7)')
            }
        },
        getMessageALert: function (titulo, texto, footer) {
            Swal.fire({
                icon: 'error',
                title: titulo,
                text: texto,
                footer: '<a href>footer</a>'
            });
        }
    }
}

export default {
    historialVenta
}