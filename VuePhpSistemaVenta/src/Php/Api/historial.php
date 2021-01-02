<?php

    include  '../conexion/ConexionMysql.php';

    $SELECT= "SELECT
       pro.nombreProducto
    FROM detalleFactura det 
    INNER JOIN factura fac ON fac.consecutivo = det.consecutivo 
    INNER JOIN producto pro ON pro.codigoProducto = det.codigoProducto 
    INNER JOIN cliente cli ON cli.cedula = fac.cedulaCliente 
    WHERE cli.cedula = fac.cedulaCliente";


    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $valorParametro = $_REQUEST['consulta'];

        $conexion = new Conexion();
        $conexionMysql = $conexion->getConexion();

        $preparedStatement = null;
        switch ($valorParametro) {
            case "all":
                $preparedStatement = $conexionMysql->prepare($SELECT);
                break;
            case "fecha":
                $SELECT .= " AND det.fechaDetalle LIKE '%".$_REQUEST['fecha']."%'";
                $preparedStatement = $conexionMysql->prepare($SELECT);
                break;
            case "buscar":
                $SELECT .= " AND cli.cedula = :cedula";
                $preparedStatement = $conexionMysql->prepare($SELECT);
                $preparedStatement->bindParam(":cedula", $_REQUEST['cedula']);
                break;
        }

        $response = $preparedStatement->execute();

        if ($response) {
            $data['data'] = null;
            while ($resultados = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $data['data'][] = $resultados;
            }
            if ($data != null) {
                echo json_encode($data);
            } else {
                echo json_encode(array(
                    "msg" => "No hay registros de venta en la base de datos",
                    "status" => 400
                ));
            }
        } else {
            echo json_encode(array(
                "msg" => "No se pudo realiar la consulta",
                "status" => 500
            ));
        }
    }
