<?php
// Procesar los datos de la peticion
$usuarioNombre = $_POST['username'];
$usuarioContrasenya = $_POST['password'];

// Query para buscar el usuario
//$sql = "SELECT * FROM usuarios";
$sql = "SELECT id, nombre, rol FROM usuarios WHERE bloqueado = 0 AND nombre = '$usuarioNombre' AND contrasenya = '$usuarioContrasenya' 
AND (rol = 'admin' OR id_cliente IN (SELECT id FROM clientes WHERE activo = 1))";
// Ejecutar la consulta a la BD
$result = mysqli_query($conn, $sql);

// Procesar el resultado de la consulta
if(mysqli_num_rows($result) > 0) {

    session_start();

    while ($fila = mysqli_fetch_assoc($result)) {

        // Iniciar variables de respuesta
        $respuesta['id'] = $fila['id'];
        $respuesta['nombre'] = $fila['nombre'];
        $respuesta['rol'] = $fila['rol'];

        // Iniciar variables de sesion
        $_SESSION["id"] = $fila['id'];
        $_SESSION["nombre"] = $fila['nombre'];
        $_SESSION["rol"] = $fila['rol'];

    }

    http_response_code(200);

} else {
    // No hay resultados en la consulta
    http_response_code(401);
    die();
}