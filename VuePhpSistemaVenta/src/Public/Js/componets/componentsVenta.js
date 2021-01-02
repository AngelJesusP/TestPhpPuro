const opcionRegistro = {
    template: `
        <div class="d-flex">
            <div class="col-sm-9">
                 <div class="card mt-4">
                    <div class="card-header bg-dark">
                        <span class="h4 text-white">REGISTRO DE VENTAS</span>
                        <router-link class="btn btn-outline-light float-right" to="/">Menu principal</router-link>      
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <label for="productos">Escoja el producto: </label>
                                <select v-on:change="cargarPrecioProducto" class="form-control" name="productos" id="productos">
                                    <option v-bind:key="0"  value="none">--- SELECCIONE ---</option>
                                    <option v-for="item in productosSelect.data" 
                                    v-bind:key="item.codigoProducto" :value="item.codigoProducto">{{item.nombreProducto}}</option>   
                                </select>
                            </div>
                            <div class="col">
                                <label for="cantidad">Digite la cantidad: </label>
                                <input type="number" id="cantidad" class="form-control" placeholder="Digite la cantidad" 
                                 v-model="inforacionCaja.cantidad" autocomplete="off" required/>                        
                            </div>
                            <div class="col">
                                <label for="stock">Cantidad disponible (Stock): </label>
                                <input type="number" id="stock" class="form-control" placeholder="STOCK"
                                     autocomplete="off" disabled="true" required/>                        
                            </div>
                            <div class="col">
                                <label for="precio">$ Precio del producto: </label>
                                <input type="number" id="precio" class="form-control" placeholder="$ precio del producto" 
                                  v-model="inforacionCaja.precio" autocomplete="off" disabled="true"/>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="col">
                                <label for="cedula">Digite la cedula del cliente: </label>
                                <input type="number" id="cedula" class="form-control" placeholder="Digite la cedula del cliente" 
                                  v-model="inforacionCaja.cedulaCliente"
                                  v-on:keyup="cargarCliente" autocomplete="off" required/>
                            </div>
                            <div class="col">
                                <label for="nombre">nombre del cliente: </label>
                                <input type="text" id="nombre" class="form-control" placeholder="NOMBRE DEL CLIENTE" 
                                  v-model="inforacionCaja.nombreCliente" autocomplete="off" required disabled="true"/>
                            </div>
                            <div class="col">
                                <label for="telefono">Num. Telefono: </label>
                                <input type="number" id="telefono" class="form-control" placeholder="(+57) 999-9999999" 
                                  v-model="inforacionCaja.numTelefono" autocomplete="off" required disabled="true"/>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <button v-on:click="agregarTabla" class="btn btn-outline-dark ml-3">Agregar a la tabla</button>
                            <button v-on:click="setLimparCampos" class="btn btn-outline-dark ml-4">Limpiar</button>
                        </div>
                    </div>
                 </div>
                <div class="mt-3">
                    <table id="tabla" class="table table-hover table-striped">
                        <thead class="text-white bg-dark">
                            <th>Cliente</th>
                            <th>ID Producto</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                            <th>ACCION</th>
                        </thead>
                        <tbody id="cuerpoTabla">
                                <tr v-if="productosRegistrar.length != 0" v-for="item in productosRegistrar" :key="item.codigoProducto">
                                    <td>{{item.cliente}}</td>
                                    <td>{{item.codigoProducto}}</td>
                                    <td>{{item.nombreProducto}}</td>
                                    <td>{{item.cantidad}}</td>
                                    <td>{{item.precio}}</td>
                                    <td>{{item.total}}</td>
                                    <td><button v-on:click="setEliminarProductoTabla(item)" class="btn btn-outline-danger btn-block">Eliminar</button></td>    
                                </tr>      
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="mt-4">
                <div class="col-sm-12">
                    <div class="card">
                        <div class="card-header p-0">
                            <img src="Public/img/venta.jpg" class="img-fluid" alt="">
                        </div>
                        <div class="card-body">
                            <div class="col">
                                <label for="cedulaCliente">Cedula del cliente:</label>
                                <input type="number" class="form-control" placeholder="CEDULA" id="cedulaCliente" 
                                 v-model="inforacionCaja.cedulaCliente" autocomplete="off" disabled="true">
                                <hr />
                                <label for="cantidadAgregada">Cantidad agregada:</label>
                                <input type="number" class="form-control" placeholder="CANTIDAD AGREGADA" id="cantidadAgregada" 
                                  autocomplete="off" disabled="true">
                                <hr />
                                <label for="total">Total a pagar:</label>
                                <input type="number" class="form-control" placeholder="$ TOTAL" id="total" 
                                 v-model="subTotal" autocomplete="off" disabled="true">
                                 <hr />
                                <button v-on:click="setGenerarVenta" class="btn btn-dark btn-block">Generar venta</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    `,
    data() {
        this.cargarProductosSelect();
        return {
            inforacionCaja: {
                cantidad: 0,
                precio: 0,
                cedulaCliente: 0,
                nombreCliente: "",
                numTelefono: 0
            },
            productosSelect: [],
            productosRegistrar: [],
            subTotal: 0
        }
    },
    methods: {
        cargarProductosSelect: function () {
            axios.get('Php/Api/productos.php').then(response => {
                this.productosSelect = response.data;
            });
        },
        cargarPrecioProducto: function (event) {
            const posicion = event.target.selectedIndex - 1;
            this.posicionSelect = posicion;
            this.inforacionCaja.precio = this.productosSelect.data[posicion].precio;
            document.getElementById('stock').value = this.productosSelect.data[posicion].stock;
        },
        cargarCliente: function (event) {
            if (this.inforacionCaja.cedulaCliente != "") {
                axios.get('Php/Api/cliente.php', {
                    params: {
                        "cedula": this.inforacionCaja.cedulaCliente
                    }
                }).then(response => {
                   let cantidad = response.data.data.length;
                    this.inforacionCaja.nombreCliente = (cantidad==2) ? response.data.data[1].nombre : "Cedula no registrada";
                    this.inforacionCaja.numTelefono = (cantidad==2)? response.data.data[1].telefono : 0;
                });
            }
        },
        agregarTabla: function () {
            let productosSelectPosicion = document.getElementById('productos');

            document.getElementById('cedula').disabled = true;
            let cedula = this.inforacionCaja.cedulaCliente;
            let cliente = this.inforacionCaja.nombreCliente;
            let codigoProducto = parseInt(productosSelectPosicion.value);
            let nombreProducto = productosSelectPosicion.options[productosSelectPosicion.selectedIndex].text;
            let cantidad = parseInt(this.inforacionCaja.cantidad);
            let cantidadStock = parseInt(document.getElementById('stock').value);
            let precio = parseFloat(this.inforacionCaja.precio);
            let total = parseInt(cantidad)*parseFloat(precio);
            let stock = parseInt(document.getElementById('stock').value);

            console.log("Cantidad: "+(stock-cantidad));

            if (cantidad <= cantidadStock) {
                let posicion = -1;
                if (this.productosRegistrar.length == 0) {
                    this.productosRegistrar.push({
                        "cedula": cedula,
                        "cliente": cliente,
                        "codigoProducto": codigoProducto,
                        "nombreProducto": nombreProducto,
                        "cantidad": cantidad,
                        "disponible": (stock - cantidad),
                        "precio": precio,
                        "total": total,
                    });
                } else {
                    posicion = this.getPosicionProductosAgregados(codigoProducto);
                    if (posicion == -1) {
                        this.productosRegistrar.push({
                            "cedula": cedula,
                            "cliente": cliente,
                            "codigoProducto": codigoProducto,
                            "nombreProducto": nombreProducto,
                            "cantidad": cantidad,
                            "disponible": (stock - cantidad),
                            "precio": precio,
                            "total": total,
                        });
                    } else {
                        this.productosRegistrar[posicion].cantidad += cantidad;
                        this.productosRegistrar[posicion].disponible = (stock - cantidad);
                        this.productosRegistrar[posicion].precio += precio;
                        this.productosRegistrar[posicion].total += total;
                    }
                }
                posicion = this.getPosicionSelect(codigoProducto);
                this.productosSelect.data[posicion].stock -= cantidad;
                document.getElementById('stock').value = this.productosSelect.data[posicion].stock;
                document.getElementById('cantidadAgregada').value = this.productosRegistrar.length;
                this.subTotal = this.getTotalPagar();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'CANTIDAD SUPERA EL STOCK',
                    text: 'La cantidad que desea agregar supera el stock',
                    footer: '<a href>ACCION NO PERMITIDA</a>'
                });
            }
        },
        getPosicionProductosAgregados: function (codigoProducto) {
            let posicion = -1;
            for (let i=0; i < this.productosRegistrar.length; i++) {
                if(this.productosRegistrar[i].codigoProducto == codigoProducto) {
                    posicion = i;
                }
            }
            return posicion;
        },
        getPosicionSelect: function (codigoProducto) {
            let posicion = -1;
            for (let i = 0; i < this.productosSelect.data.length; i++) {
                if (this.productosSelect.data[i].codigoProducto == codigoProducto) {
                    posicion = i;
                }
            }
            return posicion;
        },
        getTotalPagar: function () {
            let suma = 0;
            for (let i = 0; i < this.productosRegistrar.length; i++) {
                suma += this.productosRegistrar[i].total;
            }
            return suma;
        },
        setEliminarProductoTabla: function (item) {
            let posicion = this.getPosicionProductosAgregados(item.codigoProducto);
            this.productosRegistrar.splice(posicion, 1);
            posicion = this.getPosicionSelect(item.codigoProducto);

            this.productosSelect.data[posicion].stock += item.cantidad;
            document.getElementById('stock').value = this.productosSelect.data[posicion].stock;
            document.getElementById('cantidadAgregada').value = this.productosRegistrar.length;
            this.subTotal = this.getTotalPagar();
        },
        setLimparCampos: function () {
            this.inforacionCaja.cantidad = 0;
            this.inforacionCaja.precio = 0;
            this.inforacionCaja.cedulaCliente = 0;
            this.inforacionCaja.nombreCliente = "";
            this.inforacionCaja.numTelefono = 0;
            this.productosRegistrar = [];
            this.subTotal = 0;
        },
        setGenerarVenta: function () {

            Swal.fire({
                title: '¿Desea generar la venta?',
                text: "Haga click en Si para generar la venta",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0c2234',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Generar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const bodyFormData = new FormData();
                    bodyFormData.append('datos',JSON.stringify(this.productosRegistrar));
                    bodyFormData.append('consecutivo',parseInt(Math.random()*10000));

                    axios.post('Php/Api/venta.php', bodyFormData).then(response => {

                        if(response.data.status == 200) {
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: response.data.msg,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            this.setLimparCampos();
                            this.cargarProductosSelect();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error al generar la venta',
                                text: response.data.msg,
                                footer: '<a href></a>'
                            });
                        }
                    });
                }
            })
        }
    }
}

export default {
    opcionRegistro
}