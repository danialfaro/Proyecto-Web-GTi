<?php

if(!isset($conn)){ die();}

switch(true) {

    case !isset($paramPath) || empty($paramPath):
        //Devuelve los datos de todos los usuarios
        $sql="SELECT * FROM usuarios";
        break;

    case is_numeric($paramPath[0]) && isset($paramPath[1]):
    $id=$paramPath[0];
       //Devuelve los datos de un usuario
       $sql="SELECT * FROM usuarios WHERE id=$id ";
       break;
}

if(!isset($sql)) {
    http_response_code(404);
    die();
}

$result= mysqli_query($conn,$sql);

if(mysqli_num_rows($result)){
    $data=array();

    while($fila=mysqli_fetch_assoc($result)){
        $reg=[];

        if(isset($paramPath[0])&& $paramPath[0]===$id){
            $reg=$fila;
        }
        else{
            $reg['id']=$data['id'];
            $reg['nombre']=$data['nombre'];
            $reg['apellido']=$data['apellido'];
            $reg['contrasenya']=$data['contrasenya'];
            $reg['email']=$data['email'];
            $reg['rol']=$data['rol'];
        

        }
        array_push($data,$reg);
    }
    $respuesta=$data;

}





