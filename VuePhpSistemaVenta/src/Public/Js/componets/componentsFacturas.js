const componentFactura = {
    template: `
        <div>
            <div class="">
                <div class="d-flex">
                    <div class="col-md-4">
                        <div class="card mt-3">
                            <div class="card-header bg-dark">
                                <img src="Public/img/factura.png" style="height: 300px" class="img-fluid w-100" alt="" />
                            </div>
                            <div class="card-body">
                                <label for="cedula">*Digite la cedula: </label>
                                <input type="number" class="form-control" placeholder="Digite la cedula del cliente" 
                                autocomplete="off" id="cedula" v-model="cedulaBuscar"/>
                                <hr />
                                <button v-on:click="getFacturasCliente" class="btn btn-secondary">Buscar facturas</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="card mt-3">
                            <div class="card-header bg-dark">
                                <span class="text-white">INFORMACION DEL CLIENTE</span>
                                <router-link class="btn btn-outline-light float-right" to="/">Menu principal</router-link>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <label><b>C.C:</b> {{cliente.cedula}}</label>
                                    </div>
                                    <div class="col">
                                        <label><b>NOMBRE:</b> {{cliente.nombre}}</label>
                                    </div>
                                    <div class="col">
                                        <label><b>APELLIDOS: </b> {{cliente.apellido}}</label>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-4">
                                        <label><b>DIRECCIÓN:</b> {{cliente.direccion}}</label>
                                    </div>
                                    <div class="col">
                                        <label><b>Numero Telefono:</b> {{cliente.telefono}}</label>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <div class="card mt-5">
                            <div class="card" style="height: 260px">
                                <div class="card-header bg-dark">
                                    <span class="h5 text-white">INFORMACIÓN DE FACTURAS</span>
                                    <button v-on:click="getSiguiente" class="btn btn-secondary float-right ml-3" id="siguiente" disabled="true">Siguiente</button>
                                    <button v-on:click="getAnterior" class="btn btn-secondary float-right" id="anterior" disabled="true">Anterior</button>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-4">
                                            <label><b>Consecutivo:</b> {{factura.consecutivo}} </label>
                                        </div>
                                        <div class="col">
                                            <label><b>Fecha de cancelacion:</b> {{factura.fechaCancelacion}} </label>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-4">
                                            <label><b>Cantidad vendida:</b> {{factura.cantidadVendida}}</label>
                                        </div>
                                        <div class="col">
                                            <label><b>TOTAL $</b> {{factura.total}} </label>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                <div class="col-sm-12">
                    <table class="table table-hover table-striped mt-3">
                        <thead CLASS="bg-dark text-white">
                            <th>COD. PRODUCTO</th>
                            <th>NOMBRE</th>
                            <th>FOTO PRODUCTO</th>
                            <th>PRECIO</th>
                            <th>CANTIDAD COM.</th>
                            <th>TOTAL</th>
                            <th>FECHA DE CANCELACION</th>
                        </thead>
                        <tbody id="cuerpoTabla"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            cedulaBuscar: "",
            cliente: {
                cedula: 0,
                nombre: "",
                apellido: "",
                direccion: "",
                telefono: 0
            },
            factura: {
                consecutivo: 0,
                fechaCancelacion: "",
                cantidadVendida: 0,
                total: 0
            },
            fechaClafificacion: [],
            posicionNavegacion: -1,
            datos: null
        }
    },
    methods: {
        getFacturasCliente: function () {
            axios.get('Php/Api/factura.php', {
                params: {
                    "cedula": parseInt(this.cedulaBuscar)
                }
            }).then(response => {
                let datos = response.data.data;
                this.datos = datos;
                if (datos != null) {
                    this.setLlenarCliente(datos);

                    this.fechaClafificacion = [];
                    this.setClasificarFechas(datos);

                    if (this.fechaClafificacion.length == 1) {
                        document.getElementById('siguiente').disabled = true;
                        document.getElementById('anterior').disabled = true;
                    } else {
                        document.getElementById('siguiente').disabled = false;
                        document.getElementById('anterior').disabled = false;
                    }
                    this.posicionNavegacion = 0;
                    this.setCargarProductos(datos);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Cliente aun no tiene facturas registradas',
                        text: 'No hay facturas que mostras',
                        footer: '<a href></a>'
                    });
                }
            });
        },
        setLlenarCliente: function (response) {
            this.cliente.cedula = response[0].cedula;
            this.cliente.nombre = response[0].nombre;
            this.cliente.apellido = response[0].apellido;
            this.cliente.direccion = response[0].direccion;
            this.cliente.telefono = response[0].telefono;
        },
        setClasificarFechas: function (response) {
            let contador = 0;
            for (let i=0; i<response.length; i++) {
                let encontrado = false;
                for (let j=0; j<contador; j++) {
                    if (this.fechaClafificacion.length === 0) {
                        encontrado = false;
                    }
                    let bandera = response[i].fechaCancelacion === this.fechaClafificacion[j].fecha;
                    if (bandera) {
                        encontrado = true;
                    }
                 }
                if (!encontrado) {
                    this.fechaClafificacion.push({
                        "fecha": response[i].fechaCancelacion.toString()
                    });
                    contador++;
                }
            }
        },
        setCargarProductos: function (response) {
            let fecha = this.fechaClafificacion[this.posicionNavegacion].fecha;
            let codigoHtml = '';
            let bandera = true;
            for (let i=0; i<response.length; i++) {
                if (response[i].fechaCancelacion === fecha) {
                    codigoHtml += `
                        <tr>
                            <td>${response[i].codigoProducto}</td>
                            <td>${response[i].nombreProducto}</td>
                            <td><img src="${response[i].fotoRuta}" 
                                     class="img-fluid" style="width: 100px; height: 80px; border-radius: 100% " /></td>
                            <td>${response[i].precio}</td>
                            <td>${response[i].cantidadVendida}</td>
                            <td>${parseFloat(response[i].cantidadVendida)*parseFloat(response[i].precio)}</td>
                            <td>${response[i].fechaCancelacion}</td>
                            
                        </tr>
                    `;
                    if (bandera) {
                        this.factura.consecutivo = response[i].consecutivo;
                        this.factura.cantidadVendida = response[i].cantidad;
                        this.factura.fechaCancelacion = response[i].fechaCancelacion;
                        this.factura.total = response[i].total;
                        bandera = false;
                    }
                }
            }
            document.getElementById('cuerpoTabla').innerHTML = codigoHtml;
        },
        getSiguiente: function () {
            if (this.posicionNavegacion === this.fechaClafificacion.length-1) {
                Swal.fire({
                    icon: 'error',
                    title: 'No hay mas facturas que mostrar',
                    text: 'El numero de facturas ya fue completado',
                    footer: '<a href>No hay mas facturas</a>'
                });
            } else {
                this.posicionNavegacion++;
                this.setCargarProductos(this.datos);
            }
        },
        getAnterior: function () {
            if (this.posicionNavegacion === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'No hay mas facturas que mostrar hacia atras',
                    text: 'El numero de facturas ya fue completado',
                    footer: '<a href>No hay mas facturas</a>'
                });
            } else {
                this.posicionNavegacion--;
                this.setCargarProductos(this.datos);
            }
        }
    }
}

export default {
    componentFactura
}