<?php
// Procesar los datos de la peticion
$usuarioNombre = $_POST['username'];
$usuarioContrasenya = $_POST['password'];

// Query para buscar el usuario
//$sql = "SELECT * FROM usuarios";
$sql = "SELECT id, nombre, rol FROM usuarios WHERE nombre = '$usuarioNombre' AND contrasenya = '$usuarioContrasenya'";

// Ejecutar la consulta a la BD
$result = mysqli_query($conn, $sql);

// Procesar el resultado de la consulta
if(mysqli_num_rows($result) > 0) {

    session_start();

    while ($fila = mysqli_fetch_assoc($result)) {

        //echo "<b>" . $fila['nombre'] . "</b> " .$fila['rol'] . "<br>";

        // Iniciar variables de respuesta
        $salida = [];
        $salida['id'] = $fila['id'];
        $salida['nombre'] = $fila['nombre'];
        $salida['rol'] = $fila['rol'];

        // Iniciar variables de sesion
        $_SESSION["id"] = $fila['id'];
        $_SESSION["nombre"] = $fila['nombre'];
        $_SESSION["rol"] = $fila['rol'];

        // Enviar respuesta en formato JSON
        header("Content-Type: application/json;");
        echo json_encode($salida);
    }

    http_response_code(200);

} else {
    // No hay resultados en la consulta
    http_response_code(401);
    die();
}