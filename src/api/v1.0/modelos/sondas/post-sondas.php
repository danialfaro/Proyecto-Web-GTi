<?php
if(!isset($conn)) { die(); }

if(empty($_POST["mac"])) {
    http_response_code(400);
    die();
}
// Procesar los datos de la peticion
$mac= $_POST['mac'];

// Query para buscar la sonda

//$sql = "SELECT * FROM sondas";
$sql = "INSERT INTO `sondas`(`mac`) 
        VALUES ('$mac')";

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