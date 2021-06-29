<?php

if(!isset($conn)) { die(); }

// Campos obligatorios
if(empty($_POST["nombre"])) {
    http_response_code(400);
    die();
}

$nombre = $_POST["nombre"];
$telefono = "";
if(isset($_POST["telefono"])) { $telefono = $_POST["telefono"]; }
$fecha_fin = "";
if(isset($_POST["fecha_fin"])) { $fecha_fin = $_POST["fecha_fin"]; }

// Crear la consulta con los datos
$sql = "INSERT INTO `clientes`(`nombre`, `telefono`, `fecha_fin`) 
        VALUES ('$nombre', '$telefono', '$fecha_fin')";

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