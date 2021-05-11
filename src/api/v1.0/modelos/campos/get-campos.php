<?php

if(!isset($conn)) { die(); }

switch (true) {

    case empty($paramPath):
        // Query para devolver todos los campos
        $sql = "SELECT nombre, ST_AsGeoJSON(geometria) as geometria FROM campos";
        break;

    case is_numeric($paramPath[0]):
        $id = $paramPath[0];
        // Query para devolver los campos de un usuario
        $sql = "SELECT nombre, ST_AsGeoJSON(geometria) as geometria FROM campos WHERE id = '${id}'";
        break;

    case $paramPath[0] === "usuario" && $paramPath[1]:
        $id = $paramPath[1];
        // Query para devolver los campos de un usuario
        $sql = "SELECT nombre, ST_AsGeoJSON(geometria) as geometria FROM campos WHERE id IN (SELECT campo_id FROM usuarios_campos WHERE usuario_id = '${id}')";
        break;

}

if(!isset($sql)) {
    http_response_code(404);
    die();
}

$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result)) {

    $data = array();

    while ($fila = mysqli_fetch_assoc($result)) {

        $reg = [];

        $reg['nombre'] = $fila['nombre'];
        $reg['geometria'] = json_decode($fila['geometria']);

        array_push($data, $reg);

    }

    $respuesta = $data;

} else {
    http_response_code(404);
    die("No hay datos.");
}