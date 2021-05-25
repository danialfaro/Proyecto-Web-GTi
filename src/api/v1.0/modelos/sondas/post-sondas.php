<?php
// Procesar los datos de la peticion
$sondaMAC = $_POST['mac'];

// Query para buscar la sonda
//$sql = "SELECT * FROM sondas";
$sql = "SELECT * FROM sondas WHERE mac = '$sondaMAC' ";

// Ejecutar la consulta a la BD
$result = mysqli_query($conn, $sql);

// Procesar el resultado de la consulta
if(mysqli_num_rows($result) > 0) {

    session_start();

    while ($fila = mysqli_fetch_assoc($result)) {

        // Iniciar variables de respuesta
        $respuesta = $fila;
    }

    http_response_code(200);
} else {
    // No hay resultados en la consulta
    http_response_code(401);
    die();
}