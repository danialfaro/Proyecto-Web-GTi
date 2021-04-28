CREATE DATABASE IF NOT EXISTS dB_equipo05;

CREATE TABLE IF NOT EXISTS dB_equipo05.usuarios (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) DEFAULT '',
    contrasenya VARCHAR(255) NOT NULL,
    rol ENUM('admin','user')
);

INSERT INTO dB_equipo05.usuarios(nombre, contrasenya, rol) VALUES('admin', '1234', 1);
INSERT INTO dB_equipo05.usuarios(nombre, contrasenya, rol) VALUES('user', '1234', 2);