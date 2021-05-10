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


CREATE TABLE IF NOT EXISTS dB_equipo05.ubicaciones(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    coordenadas INT NOT NULL ,
)

INSERT INTO dB_equipo05.ubicaciones(id,coordenadas) VALUES
(1,""),
(2,""),
(3,""),
(4,""),
(5,""),
(6,""),
(7,""),
(8,"");


CREATE TABLE IF NOT EXISTS dB_equipo05.sondas(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mac VARCHAR (17) NOT NULL,
)

INSERT INTO dB_equipo05.sondas(id,mac) VALUES
(1,"00:1e:c2:9e:28:6b"),
(2,"40:5f:v6:8e:32:5s"),
(3,"22:9h:n6:9c:56:4e"),
(4,"68:2f:s3:7q:69:3x"),
(5,"52:6p:l4:3v:62:1k"),
(6,"86:2i:f8:2m:51:3r"),
(7,"71:6x:h9:7d:20:6p"),
(8,"20:3b:j8:5c:36:4c");