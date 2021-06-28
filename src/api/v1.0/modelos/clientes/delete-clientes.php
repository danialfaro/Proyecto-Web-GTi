<?php

if(!isset($conn)) { die(); }

if(!isset($paramPath[0])) {
    http_response_code(400);
    die();
}

$id = $paramPath[0];
$sql = "DELETE FROM clientes WHERE id = '${id}' AND activo = 0";

if(!is_numeric($paramPath[0]) && $paramPath[0] === "inactivos") {
    $sql = "DELETE FROM clientes WHERE activo = 0";
}


$result = mysqli_query($conn, $sql);

if (mysqli_affected_rows($conn) <= 0) {
    // No se ha eliminado nada
    http_response_code(404);
    die();
}