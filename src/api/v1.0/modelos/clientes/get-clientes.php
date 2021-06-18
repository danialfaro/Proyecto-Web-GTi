<?php

if (!isset($conn)) {
    die();
}

switch (true) {

    case !isset($paramPath) || empty($paramPath):
        // Query para devolver todos los clientes
        $sql = "SELECT * FROM clientes";
        break;

    case is_numeric($paramPath[0]) && !isset($paramPath[1]):
        $id = $paramPath[0];
        // Query para devolver un cliente
        $sql = "SELECT * FROM clientes WHERE id = '${id}'";
        break;

    case is_numeric($paramPath[0]) && $paramPath[1] === "usuarios":
        $id = $paramPath[0];
        // Query para devolver los usuarios de un cliente
        $sql = "SELECT * FROM usuarios WHERE id_cliente = '${id}'";
        break;

}

if (!isset($sql)) {
    http_response_code(404);
    die();
}

$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result)) {

    $data = array();

    while ($fila = mysqli_fetch_assoc($result)) {

        array_push($data, $fila);

    }

    $respuesta = $data;

} else {
    http_response_code(404);
    die("No hay datos.");
}