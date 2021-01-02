const cardOpciones = `
    <div id="cuerpoOpciones">
            <div class="card mt-4">
                <div class="card-header text-center bg-dark">
                    <img src="Public/img/cardHeaderPrincipal.jpg" class="img-fluid" />           
                </div>
                <div class="card-body">
                    <h4 class="w-100 text-center">MENU DE OPCIONES PARA NAVEGAR</h4>
                    <hr />
                    <router-link class="btn btn-outline-dark btn-block" to="/generarVenta">Generar un venta</router-link>
                    <hr />
                    <router-link class="btn btn-outline-info btn-block" to="/HistorialVenta">Ver historial de ventas</router-link>
                    <router-link class="btn btn-outline-info btn-block" to="/verFacturas">Ver facturas</router-link>
                </div>
                <div class="card-footer text-center bg-dark">
                    <p class="text-white">Sistema de venta - Opciones de nevegacion</p>
                </div>
            </div>
    </div>
`;

const cardFormularios = `
      <div>
          <div id="cuerpoFormulario" class="card mt-4">
            <div class="card-header bg-dark">
                <h4 class="text-white">{{titulo}}</h4>
            </div>
            <div class="card-body">
                <div class="row">
                   <div class="col-5">
                        <select class="form-control" id="registros">
                            <option value="none"> -- Seleccionar --</option>
                            <option value="cliente">&#128100; Registrar cliente</option>
                            <option value="producto">&#128230; Registrar producto</option> 
                        </select>
                    </div>
                    <button v-on:click="generarFormulario" class="btn btn-outline-dark">Generar formulario</button>
                </div>
                <hr />
                <div v-if="opcionRegistro == -1">
                    
                </div>
                <div v-else-if="opcionRegistro == 0">
                    <h4>{{titulo}}</h4>
                    <div class="row">
                        <div class="col-5">
                            <input type="number" class="form-control" placeholder="Digite numero de cedula" 
                             v-model="cliente.cedula"  autocomplete="off" required="true">
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-5">
                            <label for="nombreCliente">Digite el nombre del cliente: </label>
                            <input type="text" class="form-control"  placeholder=" Digite el nombre del cliente" 
                             v-model="cliente.nombre"  autocomplete="off" id="nombreCliente" required="true"/>
                        </div>
                        <div class="col">
                            <label for="ClieteApellido1">Digite primer Apellido: </label>
                            <input type="text" class="form-control"  placeholder="Primer apellido" 
                             v-model="cliente.primerApellido" autocomplete="off" id="ClienteApellido1" required="true"/>
                        </div>
                        <div class="col">
                            <label for="ClienteApellido2">Digite segundo Apellido: </label>
                            <input type="text" class="form-control"  placeholder="Segundo apellido" 
                             v-model="cliente.segundoApellido" value="" autocomplete="off" id="ClienteApellido2" required="true"/>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-5">
                            <label for="direccionCliente">Digite la direccion cliente: </label>
                            <input type="text" class="form-control"  placeholder="Digite la direccion del cliente" 
                              v-model="cliente.direccion" autocomplete="off" id="direccionCliente" required="true"/>
                        </div>
                        <div class="col">
                            <label for="numeroTelefono">Digite num. Telefono: </label>
                            <input type="number" class="form-control"  placeholder="(+57) 999-9999999" 
                             v-model="cliente.numTelefono" maxlength="12" autocomplete="off" id="numeroTelefono" required="true"/>
                        </div>
                    </div>
                    <button v-on:click="registrarCliente" class="btn btn-primary mt-3 w-25">Registrar cliente</button>
                </div>
                <div v-else>
                        <h4>{{titulo}}</h4>
                    <div class="row">
                        <div class="col-5">
                            <input type="number" class="form-control" placeholder="Digite id del producto" 
                             v-model="producto.codigoProducto" autocomplete="off" required="true">
                        </div>
                        <div class="col-5">
                            <input type="file" @change="subidaImg" class="btn" name="photo" id="subirFoto" />
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-5">
                            <label for="nombreProducto">Digite el nombre del producto: </label>
                            <input type="text" class="form-control"  placeholder="Digite el nombre del producto" 
                             v-model="producto.nombreProducto" autocomplete="off" id="nombreProducto" required="true"/>
                        </div>
                        <div class="col">
                            <label for="precioProducto">Digite el precio: </label>
                            <input type="number" class="form-control"  placeholder="$ Precio del producto" 
                             v-model="producto.precioProducto" autocomplete="off" id="ClienteApellido1" required="true"/>
                        </div>
                        <div class="col">
                            <label for="stockProduto">Digite el stock: </label>
                            <input type="number" class="form-control"  placeholder="Stock del producto" 
                             v-model="producto.stockProducto" autocomplete="off" id="stockProduto" required="true"/>
                        </div>
                    </div>
                    <hr />
                    <div class="row" id="cuerpoFila">
                        <div class="col-8">
                            <textarea v-model="producto.descripcion" class="form-control" placeholder="(opcional) Descripcion del producto"></textarea>
                            <button v-on:click="registrarProducto" class="btn btn-primary mt-3">Registrar producto</button>
                        </div>
                        <div class="col">
                            <div id="preview"></div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="card-footer text-center bg-dark">
                <p class="text-white">SISTEMA DE VENTA - VUEPHP</p>
            </div>
          </div>
      </div>
`;

export default {
    cardOpciones,
    cardFormularios
}