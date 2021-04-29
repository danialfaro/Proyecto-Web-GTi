<?php

// Iniciar la sesion actual
session_start();

// Eliminar las variables
unset($_SESSION['nombre']);
unset($_SESSION['contrasenya']);

$_SESSION = array();

// Destruir la sesion
session_destroy();