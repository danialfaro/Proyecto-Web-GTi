
CREATE TABLE IF NOT EXISTS usuarios (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellidos VARCHAR(255) DEFAULT '',
    contrasenya VARCHAR(255) NOT NULL,
    rol ENUM('admin','user')
);

INSERT INTO usuarios(nombre, contrasenya, rol) VALUES('admin', '1234', 1);
INSERT INTO usuarios(nombre, contrasenya, rol) VALUES('user', '1234', 2);

CREATE TABLE IF NOT EXISTS campos (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    geometria POLYGON NOT NULL
);

INSERT INTO campos(nombre, geometria) VALUES ('campo1', PolyFromText('POLYGON((39.493657 -0.546388, 39.494768 -0.547670, 39.495761 -0.546128,39.495719 -0.545953,39.495765 -0.545840,39.495145 -0.545133,39.493657 -0.546388))', 0));
INSERT INTO campos(nombre, geometria) VALUES ('campo2', PolyFromText('POLYGON((39.483713 -0.550990,39.482736 -0.550990,39.481510 -0.548522,39.483688 -0.548672,39.483713 -0.550990))', 0));
INSERT INTO campos(nombre, geometria) VALUES ('campo3', PolyFromText('POLYGON((36.909953 -2.446600,36.909851 -2.449178,36.911224 -2.449167,36.911404 -2.446892,36.909953 -2.446600))', 0));

CREATE TABLE IF NOT EXISTS ubicaciones(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lat FLOAT( 10, 6 ) NOT NULL,
    lng FLOAT( 10, 6 ) NOT NULL
)

INSERT INTO ubicaciones(lat, lng) VALUES(-12.1312321, 34.1231234);
INSERT INTO ubicaciones(lat, lng) VALUES();
INSERT INTO ubicaciones(lat, lng) VALUES();
INSERT INTO ubicaciones(lat, lng) VALUES();



CREATE TABLE IF NOT EXISTS sondas(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mac VARCHAR (17) NOT NULL,
)

INSERT INTO sondas(mac) VALUES
("00:1e:c2:9e:28:6b"),
("40:5f:v6:8e:32:5s"),
("22:9h:n6:9c:56:4e"),
("68:2f:s3:7q:69:3x"),
("52:6p:l4:3v:62:1k"),
("86:2i:f8:2m:51:3r"),
("71:6x:h9:7d:20:6p"),
("20:3b:j8:5c:36:4c");