<?php

if(!isset($conn)) { die(); }

// Campos obligatorios
if(empty($_POST["nombre"])) {
    http_response_code(400);
    die();
}

$nombre = $_POST["nombre"];

// Crear la consulta con los datos
$sql = "INSERT INTO `clientes`(`nombre`) 
        VALUES ('$nombre')";

// Ejecutar la consulta a la BD
$result = mysqli_query($conn, $sql);

if($result) {
    $id = mysqli_insert_id($conn);
    $respuesta["id"] = $id;

} else {
    // No se ha podido realizar la accion
    http_response_code(401);
    die();
}