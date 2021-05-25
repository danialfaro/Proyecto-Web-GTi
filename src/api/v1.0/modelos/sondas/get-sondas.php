<?php

if(!isset($conn)) { die(); }

if(is_numeric($paramPath[0]) && $paramPath[1] === "sonda") {
    $id = $paramPath[0];
    // Query para devolver la sonda activa de una ubicacion
    $sql = "SELECT * FROM sondas WHERE id IN (SELECT id_sonda FROM ubicacion_sonda WHERE activa = 1 AND id_ubicacion = '${id}')";
} //Dani, ayuda! necesito saber como acceder a las sondas de un usuario teniendo en cuenta que pueden estar en distintos campos y ubicaciones

if(!isset($sql)) {
    http_response_code(404);
    die();
}

$result = mysqli_query($conn, $sql);

if(mysqli_num_rows($result)) {

    $data = array();

    //desde aquí ya no mola NADA
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