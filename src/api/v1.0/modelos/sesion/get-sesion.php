<?php

session_start();

if(!isset($_SESSION["nombre"])) {
    http_response_code(401);
    //echo "<h1>🛑✋ You're unauthorized to see this! </h1>";
    die();
}

http_response_code(200);
echo json_encode($_SESSION);