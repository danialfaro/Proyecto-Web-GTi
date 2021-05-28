<?php

if(!isset($conn)){die();}

$parametros=["nombre"=>"","apellidos"=>""];

$nombre=$parametros['nombre'];
$apellidos=$parametros['apellidos'];


$sql="INSERT INTO 'usuarios' (`nombre`,`apellidos`) VALUES ($nombre,$apellidos)";

$result=mysqli_query($conn,$sql);
if($result){
    $salida['href']='/usuarios/'.mysqli_insert_id($conn);
}

else{
    http_response_code(422);
    die();
}


