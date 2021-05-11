<?php

if(!isset($respuesta)) { die(); }

// Enviar respuesta en formato JSON
header("Content-Type: application/json;");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
echo json_encode($respuesta);

http_response_code(200);