<?php

if(!isset($conn)) { die(); }

if(!isset($paramPath[0])) {
    http_response_code(400);
    die();
}

$id = $paramPath[0];

$paramsBody = json_decode(file_get_contents('php://input'), true);

$campos = [];
foreach ($paramsBody as $key => $value) {
    $str = $key ." = '".$value."'";
    array_push($campos, $str);
}
$strCampos = join(", ", $campos);

$sql = "UPDATE clientes SET $strCampos WHERE id = $id";

$result = mysqli_query($conn, $sql);

if($result) {
    $respuesta["body"] = $paramsBody;
} else {
    // No se ha podido realizar la accion
    http_response_code(401);
    die();
}