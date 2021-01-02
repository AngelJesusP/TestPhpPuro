<?php

    include '../conexion/ConexionMysql.php';

    $SELECT = "SELECT cli.*, fac.*, det.*,
       pro.nombreProducto,
       pro.codigoProducto,
       pro.fotoRuta,
       pro.precio
    FROM detalleFactura det 
    INNER JOIN factura fac ON fac.consecutivo = det.consecutivo 
    INNER JOIN producto pro ON pro.codigoProducto = det.codigoProducto 
    INNER JOIN cliente cli ON cli.cedula = fac.cedulaCliente 
    WHERE cli.cedula = :cedula ORDER BY fac.fechaCancelacion";


    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $cedula = $_REQUEST['cedula']; // valor que llega como parametro

        $conexion = new Conexion();
        $conexionMysql = $conexion->getConexion();
        $preparedStatement = $conexionMysql->prepare($SELECT);
        $preparedStatement->bindParam(':cedula', $cedula);
        $response = $preparedStatement->execute();

        if($response) {
            $data['data'] = null;
            while ($resultados = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $data['data'][] = $resultados;
            }
            if ($data != null) {
                echo json_encode($data);
            } else {
                echo json_encode(array(
                    "msg" => "Este cliente no tiene facturas aun.",
                    "status" => 500
                ));
            }
        } else {
            echo json_encode(array(
               "msg" => "Error, no se pudo realizar la consulta del cliente",
               "status" => 500
            ));
        }
        $conexionMysql = null;
        $preparedStatement->closeCursor();
    }