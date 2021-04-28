<?php

//include 'includes/bd_conexion.php';

// Metodo de la peticion (GET | POST | PUT | DELETE)
$metodo = $_SERVER['REQUEST_METHOD'];

// Obtener la URI de la peticion
$uri = $_SERVER['REQUEST_URI'];

// Procesar la URI para obtener el recurso solicitado
$path = explode('v1.0/', parse_url($uri, PHP_URL_PATH))[1];
$paramPath = explode('/', $path);
$recurso = array_shift($paramPath);

echo $recurso;

// Path donde se encuentra el recurso
$recursoPath = 'modelos/' . $recurso . '/' . strtolower($metodo) . '-' . $recurso . '.php';


if (file_exists($recursoPath)) {
    // Si existe le delegamos la tarea de procesar la peticion al archivo correspondiente del recurso
    include $recursoPath;
} else if ($recurso === "") {
    echo "Proyecto Web - Api v1.0";
} else {
    echo "Ups, parece que te has perdido.";
}