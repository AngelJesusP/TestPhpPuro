<?php
    class Conexion {
        private $host = "localhost";
        private $database = "sistemaVenta";
        private $user = "root";
        private $password = "";
        private $conexion = null;

        /* Metodo para conectarse a MySql por medio de PDO */
        function getConexion() {
            try {
                $this->conexion = new PDO(
                    "mysql:host=$this->host;dbname=$this->database",
                    $this->user,
                    $this->password
                );
                return $this->conexion;
            } catch (Exception $e) {
                echo $e->getMessage();
            } finally {
                $this->conexion = null;
            }
        }
    }