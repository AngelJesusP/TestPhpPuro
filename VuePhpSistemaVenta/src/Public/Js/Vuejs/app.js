
import ComponentsMain from '../componets/componentsMain.js'
import ComponentsVenta from '../componets/componentsVenta.js'
import ComponentsFacturas from '../componets/componentsFacturas.js'
import ComponentsHistorialVenta from '../componets/componentsHistorialVenta.js'

Vue.component('app-opciones', {
    template: ComponentsMain.cardOpciones
});

Vue.component('app-registro', {
    data() {
        return {
            titulo: 'REGISTRO DE INFORMACION',
            opcionRegistro: -1,
            cliente: {
                cedula : 0,
                nombre: "",
                primerApellido: "",
                segundoApellido: "",
                direccion: "",
                numTelefono: 0
            },
            producto: {
                codigoProducto: 0,
                nombreProducto: "",
                precioProducto: 0,
                stockProducto: 0,
                descripcion: ""
            }
        }
    },
    template: ComponentsMain.cardFormularios,
    methods: {
        generarFormulario: function() {
            let opcionFormulario = document.getElementById('registros').value;
            let altura = document.getElementById('cuerpoOpciones').offsetHeight;
            switch (opcionFormulario) {
                case "none":
                    Swal.fire({
                        icon: 'error',
                        title: 'Seleccione otra opcion',
                        text: 'Escoga una opcion para generar el formulario',
                        footer: '<a href>Opcion invalida</a>'
                    });
                    break;
                case "cliente":
                    this.titulo = "FORMULARIO PARA REGISTRAR NUEVO CLIENTE";
                    this.opcionRegistro = 0;

                    break;
                default:
                    this.titulo = "FORMULARIO DE REGISTRO PRODUCTOS";
                    this.opcionRegistro = 1;
                    break;
            }
            document.getElementById('cuerpoFormulario').style.height = altura + "px";
        },
        registrarCliente: function() {
            axios.post('Php/Api/cliente.php',this.cliente).then(response => {
                let status = response.data.status;
                if (status === 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: response.data.msg,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch(error => {
                console.log("Error");
                console.log(error);
            });
        },
        subidaImg: function (event) {
            let lecturaArchivo = new FileReader();
            lecturaArchivo.readAsDataURL(event.target.files[0]);
            lecturaArchivo.onload = function(){
                let preview = document.getElementById('preview');
                let image = document.createElement('img');
                let altura = document.getElementById('cuerpoFila').offsetHeight;

                image.className = "img-fluid rounded border w-100";
                image.style.height = altura+"px";
                image.src = lecturaArchivo.result;

                preview.innerHTML = '';
                preview.append(image);
            };
        },
        registrarProducto: function () {
            let img = document.getElementById('subirFoto').files[0];
            let formDate = new FormData();
            formDate.append('file', img);
            formDate.append('codigo', this.producto.codigoProducto);
            formDate.append('nombre', this.producto.nombreProducto);
            formDate.append('precio', this.producto.precioProducto);
            formDate.append('stock', this.producto.stockProducto);
            formDate.append('descripcion', this.producto.descripcion);
            formDate.append('ruta', document.URL.replace("#/", ""))

            axios.post('Php/Api/productos.php', formDate, {'Content-Type': 'multipart/form-data'}).then(response => {
                console.log(response.data);
                if (response.data.status == 200) {
                    getMessageSuccess(response.data.msg);
                }
                if (response.data.status == 400) {
                    getMessagetError(response.data.msg,'Foto sin registrar', 'Cargue la foto y vuela a intentarlo')
                }
            }).catch(error => {
                console.log("Error");
                console.log(error);
                getMessagetError(response.data.msg, 'Error en el servidor', 'Procesono completado')
            });

            function getMessageSuccess(message) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }

            function getMessagetError(message, titulo, footer) {
                Swal.fire({
                    icon: 'error',
                    title: titulo,
                    text: message,
                    footer: '<a href>footer</a>'
                })
            }
        }
    }
})

const facturas = { template: '<div>Facturas</div>' }


const routes = [
    {
        path: '/generarVenta',
        component: ComponentsVenta.opcionRegistro

    },
    {
        path: '/HistorialVenta',
        component: ComponentsHistorialVenta.historialVenta
    },
    {
        path: '/verFacturas',
        component: ComponentsFacturas.componentFactura
    },
]

const router = new VueRouter({routes});

const app = new Vue({
    router
}).$mount('#appPrincipal')

