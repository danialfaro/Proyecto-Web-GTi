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

CREATE TABLE IF NOT EXISTS dB_equipo05.campos (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    geometria POLYGON NOT NULL
);

INSERT INTO dB_equipo05.campos(nombre, geometria) VALUES ('campo1',PolyFromText('POLYGON((-74.13591384887695 40.93750722242824,-74.13522720336914 40.929726129575016,-74.15102005004883 40.9329683629703,-74.14329528808594 40.94256444133327,INSERT INTO dB_equipo05.campos(nombre, geometria) VALUES ('campo1',PolyFromText('POLYGON((-74.13591384887695 40.93750722242824,-74.13522720336914 40.929726129575016,-74.15102005004883 40.9329683629703,-74.14329528808594 40.94256444133327,-74.13591384887695 40.93750722242824))', 0));
))', 0));
