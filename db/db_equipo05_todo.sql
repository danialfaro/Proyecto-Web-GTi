-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2021 a las 01:03:48
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_equipo05`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campos`
--

CREATE TABLE `campos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `geometria` polygon DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `campos`
--

INSERT INTO `campos` (`id`, `nombre`, `geometria`) VALUES
(6, 'Campo 1', 0x000000000103000000010000000700000082380f2730bf4340bda8ddaf027ce1bfbd8dcd8e54bf43409f02603c8386e1bfeed0b01875bf4340a4c16d6de179e1bfbf805eb873bf434019e6046d7278e1bf2fc03e3a75bf43400f289b728577e1bf93e34ee960bf4340410ddfc2ba71e1bf82380f2730bf4340bda8ddaf027ce1bf),
(7, 'Campo 2', 0x000000000103000000010000000500000035d3bd4eeabd43408b89cdc7b5a1e1bf0a4d124bcabd43408b89cdc7b5a1e1bf3659a31ea2bd43404e5e64027e8de1bfdcbb067de9bd4340a2630795b88ee1bf35d3bd4eeabd43408b89cdc7b5a1e1bf),
(8, 'Campo 3', 0x0000000001030000000100000005000000d4f203577974424018265305a39203c0d09d60ff7574424058a9a0a2ea9703c047aaeffca27442401a8a3bdee49703c0c7b8e2e2a874424094c0e61c3c9303c0d4f203577974424018265305a39203c0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sondas`
--

CREATE TABLE `sondas` (
  `id` int(11) NOT NULL,
  `mac` varchar(17) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sondas`
--

INSERT INTO `sondas` (`id`, `mac`) VALUES
(1, '00:1e:c2:9e:28:6b'),
(9, '15:8b:s4:7r:20:7f'),
(8, '20:3b:j8:5c:36:4c'),
(3, '22:9h:n6:9c:56:4e'),
(2, '40:5f:v6:8e:32:5s'),
(5, '52:6p:l4:3v:62:1k'),
(4, '68:2f:s3:7q:69:3x'),
(7, '71:6x:h9:7d:20:6p'),
(6, '86:2i:f8:2m:51:3r');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicaciones`
--

CREATE TABLE `ubicaciones` (
  `id` int(11) NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `id_campo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ubicaciones`
--

INSERT INTO `ubicaciones` (`id`, `lat`, `lng`, `id_campo`) VALUES
(4, 39.494423, -0.546801, 6),
(5, 39.495255, -0.546803, 6),
(6, 39.494267, -0.546072, 6),
(7, 39.483234, -0.550636, 7),
(8, 39.482174, -0.548748, 7),
(9, 39.483334, -0.549220, 7),
(10, 36.910538, -2.449017, 8),
(11, 36.910072, -2.446989, 8),
(12, 36.911114, -2.447708, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion_sonda`
--

CREATE TABLE `ubicacion_sonda` (
  `id_ubicacion` int(11) NOT NULL,
  `id_sonda` int(11) NOT NULL,
  `activa` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ubicacion_sonda`
--

INSERT INTO `ubicacion_sonda` (`id_ubicacion`, `id_sonda`, `activa`) VALUES
(4, 1, 1),
(5, 2, 1),
(6, 3, 1),
(7, 4, 1),
(8, 6, 1),
(9, 7, 1),
(10, 8, 1),
(11, 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `contrasenya` varchar(255) NOT NULL,
  `rol` enum('admin','user') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `contrasenya`, `rol`) VALUES
(1, 'admin', NULL, '1234', 'admin'),
(2, 'user', NULL, '1234', 'user'),
(7, 'dani', NULL, '1234', 'user');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_campos`
--

CREATE TABLE `usuarios_campos` (
  `usuario_id` int(11) NOT NULL,
  `campo_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios_campos`
--

INSERT INTO `usuarios_campos` (`usuario_id`, `campo_id`) VALUES
(2, 8),
(7, 6),
(7, 7);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `campos`
--
ALTER TABLE `campos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sondas`
--
ALTER TABLE `sondas`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD UNIQUE KEY `mac` (`mac`);

--
-- Indices de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lat` (`lat`,`lng`),
  ADD KEY `id_campo` (`id_campo`);

--
-- Indices de la tabla `ubicacion_sonda`
--
ALTER TABLE `ubicacion_sonda`
  ADD PRIMARY KEY (`id_ubicacion`,`id_sonda`),
  ADD KEY `fk_sonda` (`id_sonda`),
  ADD KEY `id_ubicacion` (`id_ubicacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios_campos`
--
ALTER TABLE `usuarios_campos`
  ADD PRIMARY KEY (`usuario_id`,`campo_id`),
  ADD KEY `campo_id` (`campo_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `campos`
--
ALTER TABLE `campos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `sondas`
--
ALTER TABLE `sondas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ubicaciones`
--
ALTER TABLE `ubicaciones`
  ADD CONSTRAINT `ubicaciones_ibfk_1` FOREIGN KEY (`id_campo`) REFERENCES `campos` (`id`);

--
-- Filtros para la tabla `ubicacion_sonda`
--
ALTER TABLE `ubicacion_sonda`
  ADD CONSTRAINT `fk_sonda` FOREIGN KEY (`id_sonda`) REFERENCES `sondas` (`id`),
  ADD CONSTRAINT `fk_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicaciones` (`id`);

--
-- Filtros para la tabla `usuarios_campos`
--
ALTER TABLE `usuarios_campos`
  ADD CONSTRAINT `usuarios_campos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuarios_campos_ibfk_2` FOREIGN KEY (`campo_id`) REFERENCES `campos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
