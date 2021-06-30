<?php

if(!isset($conn)){die();}

// Campos obligatorios
if(empty($_POST["nombre"]) || empty($_POST["id_cliente"])) {
    http_response_code(400);
    die();
}

$nombre = $_POST["nombre"];
$apellidos = null;
if(isset($_POST["apellidos"])) { $apellidos = $_POST["apellidos"]; }
$contrasenya = "1234";
if(isset($_POST["contrasenya"])) { $email = $_POST["contrasenya"]; }
$email = null;
if(isset($_POST["email"])) { $email = $_POST["email"]; }
$idCliente = null;
if(isset($_POST["id_cliente"])) { $idCliente = $_POST["id_cliente"]; }
$rol = "user";
if(isset($_POST["rol"])) { $rol = $_POST["rol"]; }
$bloqueado = 0;
if(isset($_POST["bloqueado "])) { $bloqueado = $_POST["bloqueado "]; }


$sql = "INSERT INTO `usuarios`(`nombre`, `apellidos`, `contrasenya`, `email`, `id_cliente`, `rol`, `bloqueado`) 
VALUES ('$nombre','$apellidos','$contrasenya','$email','$idCliente','$rol', $bloqueado)";

$result = mysqli_query($conn,$sql);
if($result){
    $id = mysqli_insert_id($conn);
    $respuesta["id"] = $id;
}

else{
    http_response_code(422);
    die();
}


