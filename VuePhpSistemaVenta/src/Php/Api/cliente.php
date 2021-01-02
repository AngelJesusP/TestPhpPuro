<?php

    include '../conexion/ConexionMysql.php';

    $INSERT = "INSERT INTO cliente(cedula, nombre, apellido, direccion, telefono)VALUES(:cedula, :nombre, :apellido, :direccion, :telefono)";
    $SELECT = "SELECT cliente.cedula, cliente.nombre, cliente.telefono FROM cliente WHERE cedula LIKE :cedula";

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $inpust = json_decode(file_get_contents("php://input"), true);

        $cedula = $inpust['cedula'];
        $nombre = $inpust['nombre'];
        $apellido1 = $inpust['primerApellido'];
        $apellido2 = $inpust['segundoApellido'];
        $apellidos = $apellido1 ." ".$apellido2;
        $direccion = $inpust['direccion'];
        $numTelefono = $inpust['numTelefono'];

        $conexion = new Conexion();
        $conexionMysql = $conexion->getConexion();

        $preparedStatement = $conexionMysql->prepare($INSERT);
        $preparedStatement->bindParam(":cedula", $cedula);
        $preparedStatement->bindParam(":nombre", $nombre);
        $preparedStatement->bindParam(":apellido", $apellidos);
        $preparedStatement->bindParam(":direccion", $direccion);
        $preparedStatement->bindParam(":telefono", $numTelefono);

        $response = $preparedStatement->execute();
        if ($response) {
            echo json_encode(array(
               "msg" => "Registro de cliente completado con exito.",
               "status" => 200
            ));
        } else {
            echo json_encode(array(
                "msg" => "No se pudo completar el regitro",
                "status" => 400
            ));
        }
        $conexion = null;
        $preparedStatement->closeCursor();
    }

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        header('Content-Type: application/json');
        $cedula = $_REQUEST['cedula']; // valor que llega como parametro

        $conexion = new Conexion();
        $conexionMysql = $conexion->getConexion();
        $preparedStatement = $conexionMysql->prepare($SELECT);
        $preparedStatement->bindParam(':cedula', $cedula);
        $response = $preparedStatement->execute();
        if ($response) {
            $data['data'][] = null;
            while ($resultados = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $data['data'][] = $resultados;
            }
            if ($data != null) {
                echo json_encode($data);
            } else {
                echo json_encode(array(
                    "msg" => "Cedula no registrada",
                    "status" => 500
                ));
            }
        } else {
            echo json_encode(array(
                "msg" => "Ocurrio un problema al momento de realizar la consulta",
                "status" => 500
            ));
        }

    }
