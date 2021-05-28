<?php

if(!isset($conn)) { die(); }

switch (true) {

    case is_numeric($paramPath[0]) && !isset($paramPath[1]):
        $id = $paramPath[0];
        // Query para devolver una ubicacion
        $sql = "SELECT * FROM ubicaciones WHERE id = '${id}'";
        break;

    case is_numeric($paramPath[0]) && $paramPath[1] === "sonda":
        $id = $paramPath[0];
        // Query para devolver la sonda activa de una ubicacion
        $sql = "SELECT * FROM sondas WHERE id IN (SELECT id_sonda FROM ubicacion_sonda WHERE activa = 1 AND id_ubicacion = '${id}')";
        break;

    case is_numeric($paramPath[0]) && $paramPath[1] === "mediciones":

        $id = $paramPath[0];
        $queryUri = parse_url($uri, PHP_URL_QUERY);
        parse_str($queryUri, $query);

        if(isset($query["last"])) {
            // Query para devolver las ultimas mediciones de una ubicacion
            $sql = "SELECT * FROM `mediciones` WHERE id_ubicacion = '${id}' AND timestamp IN (SELECT MAX(timestamp) FROM mediciones WHERE id_ubicacion = '${id}')";

            break;
        }

        // Query para devolver las mediciones de una ubicacion
        $sql = "SELECT * FROM mediciones WHERE id_ubicacion = '${id}'";
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

        array_push($data, $fila);

    }

    $respuesta = $data;

} else {
    http_response_code(404);
    die("No hay datos.");
}