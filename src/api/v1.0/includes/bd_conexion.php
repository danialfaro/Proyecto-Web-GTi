<?php

// Datos config
$serverName = "localhost";
$userName = "root";
$password = "";
$bdName = "db_equipo05";

// Iniciar la conexion con la BD
$conn = mysqli_connect($serverName, $userName, $password, $bdName);
mysqli_query($conn,"SET NAMES 'utf8'");

if(!$conn) {
    http_response_code(500);
    die("Error: " . mysqli_connect_error());
}