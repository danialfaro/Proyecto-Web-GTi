<?php

if(!isset($conn)) { die(); }

// Campos obligatorios
if(empty($_POST["lat"]) || empty($_POST["lng"])) {
    http_response_code(400);
    die();
}

$lat = $_POST["lat"];
$lng = $_POST["lng"];
$id_campo = "";
if(isset($_POST["id_campo"])) { $id_campo = $_POST["id_campo"]; }

// Crear la consulta con los datos
$sql = "INSERT INTO `ubicaciones`(`lat`, `lng`, `id_campo`) 
        VALUES ($lat, $lng, $id_campo)";

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