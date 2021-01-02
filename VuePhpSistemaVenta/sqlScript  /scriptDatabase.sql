DROP DATABASE IF EXISTS sistemaVenta;
CREATE DATABASE IF NOT EXISTS sistemaVenta;
USE sistemaVenta;

CREATE TABLE IF NOT EXISTS cliente(
    cedula INT NOT NULL,
    nombre CHAR(40) NOT NULL,
    apellido CHAR(70) NOT NULL,
    direccion VARCHAR(40) NOT NULL,
    telefono VARCHAR(12) NOT NULL,
    PRIMARY KEY(cedula)
);

CREATE TABLE IF NOT EXISTS producto(
    codigoProducto INT NOT NULL,
    nombreProducto VARCHAR(30) NOT NULL,
    precio FLOAT NOT NULL,
    stock INT NOT NULL,
    descripcion VARCHAR(100),
    fotoRuta VARCHAR(100) NOT NULL,
    PRIMARY KEY(codigoProducto)
);

CREATE TABLE IF NOT EXISTS venta(
    cedula INT NOT NULL,
    codigoProducto INT NOT NULL,
    fechaVenta TIMESTAMP NOT NULL,
    PRIMARY KEY(cedula, codigoProducto, fechaVenta),
    FOREIGN KEY(cedula) REFERENCES cliente(cedula),
    FOREIGN KEY(codigoProducto) REFERENCES producto(codigoProducto)
);

CREATE TABLE IF NOT EXISTS factura(
    consecutivo INT NOT NULL,
    cedulaCliente INT NOT NULL,
    cantidad INT NOT NULL,
    total FLOAT NOT NULL,
    fechaCancelacion TIMESTAMP NOT NULL,
    PRIMARY KEY(consecutivo),
    FOREIGN KEY(cedulaCliente) REFERENCES cliente(cedula)
);

CREATE TABLE IF NOT EXISTS detalleFactura(
    consecutivo INT NOT NULL,
    codigoProducto INT NOT NULL,
    cantidadVendida INT NOT NULL,
    fechaDetalle TIMESTAMP NOT NULL,
    PRIMARY KEY(consecutivo, codigoProducto, fechaDetalle),
    FOREIGN KEY(consecutivo) REFERENCES factura(consecutivo),
    FOREIGN KEY(codigoProducto) REFERENCES producto(codigoProducto)
);

