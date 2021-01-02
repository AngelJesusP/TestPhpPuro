<?php

    include '../conexion/ConexionMysql.php';

    $INSERT = "INSERT INTO producto(codigoProducto,nombreProducto,precio,stock,descripcion,fotoRuta) VALUES 
                (:codigoProducto, :nombreProducto, :precio, :stock, :descripcion, :fotoRuta)";

    $SELECT = "SELECT producto.codigoProducto, producto.nombreProducto, producto.precio, producto.stock FROM producto";

    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        if  (isset($_FILES['file']['name'])) {
            header('Content-Type: application/json');
            $nombreArchivo = $_FILES['file']['name'];

            $codigoProducto = $_POST['codigo'];
            $nombreProducto = $_POST['nombre'];
            $precioProducto = $_POST['precio'];
            $stockProducto = $_POST['stock'];
            $descripcion = $_POST['descripcion'];


            $ruta = $_SERVER['DOCUMENT_ROOT']."/VuePhpSistemaVenta/src/Php/serverImg/".$nombreArchivo;
            $rutaBaseDatos = $_POST['ruta']."Php/serverImg/".$nombreArchivo;


            $conexion = new Conexion();
            $conexionMysql = $conexion->getConexion();
            $preparedStatement = $conexionMysql->prepare($INSERT);
            $preparedStatement->bindParam(':codigoProducto', $codigoProducto);
            $preparedStatement->bindParam(':nombreProducto', $nombreProducto);
            $preparedStatement->bindParam(':precio', $precioProducto);
            $preparedStatement->bindParam(':stock', $stockProducto);
            $preparedStatement->bindParam(':descripcion', $descripcion);
            $preparedStatement->bindParam(':fotoRuta', $rutaBaseDatos);

            $response = $preparedStatement->execute();
            if($response) {
                move_uploaded_file($_FILES['file']['tmp_name'], $ruta);

                echo json_encode(array(
                   "msg" => "Producto regsitrado con exito",
                   "status" => 200

                ));
            } else {
                echo json_encode(array(
                    "msg" => "NO se pudo completar la accion",
                    "status" => 500
                ));
            }
            $conexion = null;
            $preparedStatement->closeCursor();

        } else {
            echo json_encode(array(
                "msg" => "No hay foto de producto para registrar, Vuelva a intentarlo",
                "status" => 400
            ));
        }
    }

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        $conexion = new Conexion();
        $conexionMysql = $conexion->getConexion();
        $preparedStatement = $conexionMysql->prepare($SELECT);
        $response = $preparedStatement->execute();
        if ($response) {
            while ($resultados = $preparedStatement->fetch(PDO::FETCH_ASSOC)) {
                $data['data'][] = $resultados;
            }
            $respuesta = json_encode($data);
            echo ($respuesta == null)? [] : $respuesta;
        } else {
            echo json_encode(array(
                "msg" => "Ocurrio un problema !!",
                "status" => 400
            ));
        }
        $conexion = null;
        $preparedStatement->closeCursor();
    }
