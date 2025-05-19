-- Datos de ejemplo para la tarea 2
USE tarea2;

INSERT INTO actividad (comuna_id, sector, nombre, email, celular, dia_hora_inicio, dia_hora_termino, descripcion) VALUES
(130208, 'Plaza Concha y Toro', 'Club de la pelea', 'club@pelea.cl', '+56912345678', '2025-03-28 02:00:00', NULL, 'Club de la pelea en Plaza Concha y Toro'),
(130208, 'Beauchef 850, Sala F10', 'Club de Cine', 'club@cine.cl', '+56912345679', '2025-03-27 17:00:00', '2025-03-27 20:00:00', 'Club de cine en Beauchef'),
(130207, 'Parque Bustamante', 'Bicicletada', 'bici@evento.cl', '+56912345680', '2025-04-05 09:00:00', '2025-04-05 12:00:00', 'Bicicletada en Parque Bustamante'),
(130210, 'Afueras del Estadio Nacional', 'Batalla de rap', 'rap@batalla.cl', '+56912345681', '2025-04-12 16:00:00', '2025-04-12 20:00:00', 'Batalla de rap en Estadio Nacional'),
(130208, 'Beauchef 850, Sala S21', 'Orquesta Universitaria', 'orquesta@universidad.cl', '+56912345682', '2025-04-19 16:00:00', '2025-04-19 20:00:00', 'Orquesta Universitaria en Beauchef');


INSERT INTO foto (actividad_id, ruta_archivo, nombre_archivo) VALUES
(1, 'images/pelea.jfif', 'pelea.jfif'),
(2, 'images/cine.jfif', 'cine.jfif'),
(3, 'images/bicicleta.jfif', 'bicicleta.jfif'),
(4, 'images/batallarap.jfif', 'batallarap.jfif'),
(5, 'images/orquesta.jfif', 'orquesta.jfiQAf');


INSERT INTO actividad_tema (actividad_id, tema, glosa_otro) VALUES
(1, 'deporte', NULL),
(2, 'otro', 'Cine'),
(3, 'deporte', NULL),
(4, 'música', NULL),
(5, 'música', NULL);

INSERT INTO contactar_por (actividad_id, nombre, identificador) VALUES

(1, 'whatsapp', '+56912345678'),
(1, 'instagram', '@clubpelea'),


(2, 'instagram', '@clubcinebch'),
(2, 'telegram', '@cineclubfcfm'),
(2, 'whatsapp', '+56912345679'),


(3, 'instagram', '@bicicletadastgo'),
(3, 'whatsapp', '+56912345680'),
(3, 'X', '@bicicletada_stgo'),


(4, 'instagram', '@batallasrapchile'),
(4, 'tiktok', '@batallarapchile'),
(4, 'whatsapp', '+56912345681'),


(5, 'instagram', '@orquestau'),
(5, 'whatsapp', '+56912345682'),
(5, 'X', '@orquestauniversitaria');