<?php

if(!isset($conn)) { die(); }

switch (true) {

    case !isset($paramPath) || empty($paramPath):
        // Query para devolver todos los campos
        $sql = "SELECT id, nombre, ST_AsGeoJSON(geometria) as geometria FROM campos";
        break;

    case is_numeric($paramPath[0]) && !isset($paramPath[1]):
        $id = $paramPath[0];
        // Query para devolver un campo
        $sql = "SELECT id, nombre, ST_AsGeoJSON(geometria) as geometria FROM campos WHERE id = '${id}'";
        break;

    case is_numeric($paramPath[0]) && $paramPath[1] === "ubicaciones":
        $id = $paramPath[0];
        // Query para devolver las ubicaciones de un campo
        //$sql = "SELECT * FROM ubicaciones WHERE id_campo IN (SELECT id_campo FROM usuarios_campos WHERE usuario_id = '${id}')";
        $sql = "SELECT * FROM ubicaciones WHERE id_campo = '${id}'";
        break;

    case $paramPath[0] === "usuario" && $paramPath[1]:
        $id = $paramPath[1];
        // Query para devolver los campos de un usuario
        $sql = "SELECT id, nombre, ST_AsGeoJSON(geometria) as geometria FROM campos WHERE id IN (SELECT campo_id FROM usuarios_campos WHERE usuario_id = '${id}')";
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

        if(isset($paramPath[1]) && $paramPath[1] === "ubicaciones") {

            $reg = $fila;

        } else {

            $reg['id'] = $fila['id'];
            $reg['nombre'] = $fila['nombre'];
            $reg['geometria'] = json_decode($fila['geometria']);
        }

        array_push($data, $reg);

    }

    $respuesta = $data;

} else {
    http_response_code(404);
    die("No hay datos.");
}