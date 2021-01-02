<?php

    include '../conexion/ConexionMysql.php';

    $INSERT_FACTURA = "INSERT INTO factura(consecutivo,cedulaCliente,cantidad,total,fechaCancelacion) VALUES (:consecutivo, :cedulaCliente, :cantidad, :total, :fechaCancelacion)";
    $INSERT_DETALLE_FACTURA = "INSERT INTO detalleFactura(consecutivo, codigoProducto, cantidadVendida, fechaDetalle)VALUES(:consecutivo, :codigoProducto, :cantidadVendida, :fechaDetalle)";
    $INSERT_VENTA = "INSERT INTO venta(cedula, codigoProducto, fechaVenta)VALUES(:cedula, :codigoProducto, :fechaVenta)";
    $UPDATE_PRODUCTO = "UPDATE producto SET stock = :stock WHERE codigoProducto = :codigoProducto";

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $inputs =$_POST['datos'];
        $consecutivo = (int)$_POST['consecutivo'];
        $inputs  = json_decode($inputs,1);
        $tamanio = sizeof($inputs);

        $total = getTotalPagar($tamanio, $inputs);

        $timestamp = new DateTime();
        $time = $timestamp->getTimestamp();
        $fecha = date('Y-m-d H:i:s',$time);

        $conexion = new Conexion();
        $conexionMsyql = $conexion->getConexion();
        $preparedStatement = $conexionMsyql->prepare($INSERT_FACTURA);
        $preparedStatement->bindParam(':consecutivo', $consecutivo);
        $cedula = (int)$inputs[0]['cedula'];
        $preparedStatement->bindParam(':cedulaCliente', $cedula);
        $preparedStatement->bindParam(':cantidad', $tamanio);
        $preparedStatement->bindParam(':total', $total);
        $preparedStatement->bindParam(':fechaCancelacion', $fecha);
        $response = $preparedStatement->execute();
        if ($response) {

            $preparedStatement_detalle = $conexionMsyql->prepare($INSERT_DETALLE_FACTURA);
            $preparedStatement_venta = $conexionMsyql->prepare($INSERT_VENTA);
            $preparedStatement_producto = $conexionMsyql->prepare($UPDATE_PRODUCTO);

            $contador = 0;
            for ($i=0; $i<$tamanio; $i++) {

                $preparedStatement_detalle->bindParam(':consecutivo', $consecutivo);
                $preparedStatement_detalle->bindParam(':codigoProducto', $inputs[$i]['codigoProducto']);
                $preparedStatement_detalle->bindParam(':cantidadVendida', $inputs[$i]['cantidad']);
                $preparedStatement_detalle->bindParam(':fechaDetalle', $fecha);

                $preparedStatement_venta->bindParam(':cedula', $cedula);
                $preparedStatement_venta->bindParam(':codigoProducto', $inputs[$i]['codigoProducto']);
                $preparedStatement_venta->bindParam(':fechaVenta', $fecha);

                $preparedStatement_producto->bindParam(':stock', $inputs[$i]['disponible']);
                $preparedStatement_producto->bindParam(':codigoProducto', $inputs[$i]['codigoProducto']);

                $response_detalle = $preparedStatement_detalle->execute();
                $response_venta = $preparedStatement_venta->execute();
                $response_producto = $preparedStatement_producto->execute();

                $contador++;
            }
            if ($contador == $tamanio) {
                echo json_encode(array(
                    "msg" => "Venta realizada con exito !!",
                    "status" => 200
                ));
            } else {
                echo json_encode(array(
                    "msg" => "Proceso no completado, Error al guardar.",
                    "status" => 500
                ));
            }
        } else {
            echo json_encode(array(
                "msg" => "Proceso no completado, Ocurrio un error al guardar la factura",
                "status" => 500
            ));
        }
        $conexion = null;
        $preparedStatement->closeCursor();

    }

    function getTotalPagar($tamanio, $inputs) {
        $suma = 0;
        for ($i=0; $i< $tamanio; $i++) {
            $suma += $inputs[$i]['total'];
        }
        return $suma;
    }