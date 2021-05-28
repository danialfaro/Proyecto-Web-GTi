<?php

if(!isset($conn)) die();

$id=$parametrosPath[0];
$mac=$parametrosPat[1];

$parametrosBody=json_decode(file_get_contents(), true);

$campos=[];

foreach($parametrosBody as $key=>$value ){
    $str="'$key'='$value'";
    array_push($mac,$str);
}

$strSondas=($id, "," , $mac);

$sql="UPDATE 'sondas' SET $strCampos WHERE `id`=$id";

$result=mysqli_query($conn,$sql);
if(!$result){
    http_response_code(404);
    die()
}
else{
    $salida['body']=$parametrosBody;

}

/*if($result){
    $salida['body']=$parametrosBody;

}
else{
    http_response_code(404);
    die()
}*/