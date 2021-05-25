<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

//Instantiation and passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Server settings
    $mail->SMTPDebug = 0;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'gti.equipo5@gmail.com';                     //correo desde donde se envia el mensaje
    $mail->Password   = 'DaniGuillemMaria';                               //contraseña del correo
    $mail->SMTPSecure = 'tls';//aqui podemos cambiar lo que hay desde el igual por    "=PHPMailer::ENCRYPTION_STARTTLS; "        //Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
    $mail->Port       = 587;                                    //TCP port to connect to, use 465 for `PHPMailer::ENCRYPTION_SMTPS` above

    //Recipients
    $mail->setFrom('gti.equipo5@gmail.com', 'webGTI'); //desde que correo se envia y con que nombre aparece de quien es el envio
    $mail->addAddress('gti.equipo5@gmail.com', 'Jose Luís'); // a que correo se envia el mensaje y el nombre del destinatario, el campo nombre es opcional
    // $mail->addAddress('otro.correo@gmail.com');    si quisieramos enviar el mensaje a mas correos se haria repitiendo la misma linea

    /* ESTO ES PARA ENVIAR IMAGENES U OTROS ARCHIVOS ADJUNTOS
    //Attachments
    $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
    */

    //Content
    $mail->isHTML(true);  //  ESTO PERMITE QUE EL CORREO QUE ENVIES ACEPTE HTML     (Set email format to HTML)
    $mail->Subject = 'Formulario de la web'; //ASUNTO DEL CORREO
    $mail->Body    = 'Hola, este es un correo de prueba, <b>Maria mira la nota de redes de ayer</b>';

    $mail->send();
    echo 'El mensaje se envió correctamente';
} catch (Exception $e) {
    echo "Hubo un error al enviar el mensaje: {$mail->ErrorInfo}";
}