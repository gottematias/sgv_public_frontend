-- ============================================================================
-- Datos de Prueba para Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- Generado: 2026-03-01
-- NOTA: El sistema genera por defecto una persona/usuario/empleado con id=1.
--       Todos los datos de prueba comienzan desde id=2 en adelante.
-- ============================================================================

-- ============================================================================
-- Modulo: Persona (50 registros | ids 2-51)
-- ============================================================================

INSERT INTO persona (id, nombres, apellidos, documento, id_documento_tipo, activo) VALUES
-- Empleados (ids 2-6)
(2,  'Carlos',      'Rodríguez',   '20123456',  1, true),
(3,  'María',       'González',    '25456789',  1, true),
(4,  'Luis',        'Martínez',    '18654321',  1, true),
(5,  'Ana',         'Fernández',   '30987654',  1, true),
(6,  'Pedro',       'López',       '22345678',  1, true),
-- Clientes (ids 7-51)
(7,  'Sofía',       'Ramírez',     '31234567',  1, true),
(8,  'Diego',       'Torres',      '28765432',  1, true),
(9,  'Valentina',   'Herrera',     '33456789',  1, true),
(10, 'Martín',      'Díaz',        '26543210',  1, true),
(11, 'Lucía',       'Morales',     '35678901',  1, true),
(12, 'Facundo',     'Suárez',      '24321098',  1, true),
(13, 'Camila',      'Romero',      '37890123',  1, true),
(14, 'Sebastián',   'Flores',      '29012345',  1, true),
(15, 'Agustina',    'Castro',      '32109876',  1, true),
(16, 'Nicolás',     'Vargas',      '27654321',  1, true),
(17, 'Florencia',   'Jiménez',     '34321098',  1, true),
(18, 'Matías',      'Álvarez',     '23456789',  1, true),
(19, 'Julieta',     'Medina',      '38012345',  1, true),
(20, 'Tomás',       'Acosta',      '21098765',  1, true),
(21, 'Rocío',       'Vega',        '36789012',  1, true),
(22, 'Gabriel',     'Ríos',        '29876543',  1, true),
(23, 'Paula',       'Peralta',     '33210987',  1, true),
(24, 'Ezequiel',    'Sosa',        '26789012',  1, true),
(25, 'Natalia',     'Guerrero',    '31098765',  1, true),
(26, 'Leandro',     'Rojas',       '24567890',  1, true),
(27, 'Milagros',    'Ortiz',       '37654321',  1, true),
(28, 'Ignacio',     'Navarro',     '28901234',  1, true),
(29, 'Carla',       'Delgado',     '32456789',  1, true),
(30, 'Alejandro',   'Rubio',       '25678901',  1, true),
(31, 'Daniela',     'Molina',      '39123456',  1, true),
(32, 'Rodrigo',     'Cabrera',     '23234567',  1, true),
(33, 'Valeria',     'Ramos',       '36012345',  1, true),
(34, 'Federico',    'Mendoza',     '27890123',  1, true),
(35, 'Antonella',   'Guzmán',      '31567890',  1, true),
(36, 'Hernán',      'Ponce',       '25012345',  1, true),
(37, 'Brenda',      'Vera',        '38456789',  1, true),
(38, 'Santiago',    'Cortez',      '22678901',  1, true),
(39, 'Marisol',     'Aguilar',     '35234567',  1, true),
(40, 'Juan',        'Ibáñez',      '29345678',  1, true),
(41, 'Celeste',     'Benítez',     '32890123',  1, true),
(42, 'Ariel',       'Domínguez',   '26234567',  1, true),
(43, 'Micaela',     'Silva',       '39567890',  1, true),
(44, 'Maximiliano', 'Paredes',     '23789012',  1, true),
(45, 'Aldana',      'Esquivel',    '36345678',  1, true),
(46, 'Emiliano',    'Contreras',   '28123456',  1, true),
(47, 'Romina',      'Fuentes',     '31789012',  1, true),
(48, 'Esteban',     'Montes',      '25901234',  1, true),
(49, 'Lorena',      'Serrano',     '38678901',  1, true),
(50, 'Damián',      'Cáceres',     '22456789',  1, true),
(51, 'Yamila',      'Blanco',      '35901234',  1, true);

SELECT setval('persona_id_seq', 51);

-- ============================================================================
-- Tabla: Direccion (una por persona)
-- ============================================================================

INSERT INTO direccion (id_ciudad, id_persona, calle, numero, piso, departamento, observaciones) VALUES
(1,  2,  'Urquiza',           '1250', NULL, NULL,  NULL),
(1,  3,  'San Martín',        '840',  '2',  'B',   NULL),
(1,  4,  'Corrientes',        '2100', NULL, NULL,  NULL),
(1,  5,  'Rivadavia',         '550',  '1',  'A',   NULL),
(1,  6,  'Entre Ríos',        '1780', NULL, NULL,  NULL),
(1,  7,  'Laprida',           '320',  NULL, NULL,  'Timbre 2'),
(1,  8,  'Almafuerte',        '975',  NULL, NULL,  NULL),
(1,  9,  'Belgrano',          '1430', '3',  'C',   NULL),
(1,  10, 'Salta',             '210',  NULL, NULL,  NULL),
(1,  11, 'Mitre',             '660',  '1',  'B',   NULL),
(1,  12, 'Independencia',     '1890', NULL, NULL,  NULL),
(1,  13, 'Moreno',            '490',  NULL, NULL,  'Casa'),
(1,  14, '9 de Julio',        '1100', '2',  'A',   NULL),
(1,  15, 'Blas Parera',       '730',  NULL, NULL,  NULL),
(1,  16, 'Laurencena',        '2230', NULL, NULL,  NULL),
(4,  17, 'San Benito',        '150',  NULL, NULL,  NULL),
(4,  18, 'Av. Ramírez',       '890',  NULL, NULL,  NULL),
(4,  19, 'Centenario',        '340',  '1',  'A',   NULL),
(5,  20, 'Av. Mosconi',       '1560', NULL, NULL,  NULL),
(5,  21, 'Los Álamos',        '220',  NULL, NULL,  NULL),
(1,  22, 'Etchevehere',       '1020', NULL, NULL,  NULL),
(1,  23, 'Crespo',            '780',  '2',  'B',   NULL),
(1,  24, 'España',            '1340', NULL, NULL,  NULL),
(1,  25, 'Brasil',            '460',  NULL, NULL,  NULL),
(1,  26, 'Colombia',          '1670', '3',  'C',   NULL),
(1,  27, 'Chile',             '870',  NULL, NULL,  NULL),
(2,  28, 'Pellegrini',        '1230', NULL, NULL,  NULL),
(2,  29, 'Rocamora',          '560',  '1',  'D',   NULL),
(2,  30, 'Alberdi',           '940',  NULL, NULL,  NULL),
(2,  31, 'Bv. Yuquerí',       '1750', NULL, NULL,  NULL),
(3,  32, 'Andrade',           '310',  NULL, NULL,  NULL),
(3,  33, 'Colón',             '1080', '2',  'A',   NULL),
(3,  34, 'Brown',             '620',  NULL, NULL,  NULL),
(3,  35, 'Av. Costanera',     '2050', NULL, NULL,  NULL),
(3,  36, 'Italia',            '480',  NULL, NULL,  NULL),
(1,  37, 'Piedras',           '1390', NULL, NULL,  'Casa esquina'),
(1,  38, 'San Luis',          '740',  '1',  'C',   NULL),
(1,  39, 'Córdoba',           '1810', NULL, NULL,  NULL),
(1,  40, 'Tucumán',           '500',  NULL, NULL,  NULL),
(1,  41, 'Jujuy',             '1650', '2',  'B',   NULL),
(7,  42, 'Diamante',          '280',  NULL, NULL,  NULL),
(7,  43, 'Gualeguaychú',      '920',  NULL, NULL,  NULL),
(7,  44, 'Mitre',             '1470', '1',  'A',   NULL),
(8,  45, 'Belgrano',          '360',  NULL, NULL,  NULL),
(8,  46, 'San Martín',        '1120', NULL, NULL,  NULL),
(1,  47, 'Mendoza',           '830',  '3',  'D',   NULL),
(1,  48, 'Santa Fe',          '1290', NULL, NULL,  NULL),
(1,  49, 'Buenos Aires',      '550',  NULL, NULL,  NULL),
(1,  50, 'Urquiza',           '1880', '2',  'A',   NULL),
(1,  51, 'Rivadavia',         '410',  NULL, NULL,  NULL);

-- ============================================================================
-- Tabla: Contacto (dos por persona: Correo y Celular)
-- ============================================================================

INSERT INTO contacto (id_persona, id_contacto_tipo, dato) VALUES
(2,  1, 'carlos.rodriguez@email.com'),    (2,  2, '3434-601002'),
(3,  1, 'maria.gonzalez@email.com'),      (3,  2, '3434-602003'),
(4,  1, 'luis.martinez@email.com'),       (4,  2, '3434-603004'),
(5,  1, 'ana.fernandez@email.com'),       (5,  2, '3434-604005'),
(6,  1, 'pedro.lopez@email.com'),         (6,  2, '3434-605006'),
(7,  1, 'sofia.ramirez@email.com'),       (7,  2, '3434-606007'),
(8,  1, 'diego.torres@email.com'),        (8,  2, '3434-607008'),
(9,  1, 'valentina.herrera@email.com'),   (9,  2, '3434-608009'),
(10, 1, 'martin.diaz@email.com'),         (10, 2, '3434-609010'),
(11, 1, 'lucia.morales@email.com'),       (11, 2, '3434-610011'),
(12, 1, 'facundo.suarez@email.com'),      (12, 2, '3434-611012'),
(13, 1, 'camila.romero@email.com'),       (13, 2, '3434-612013'),
(14, 1, 'sebastian.flores@email.com'),    (14, 2, '3434-613014'),
(15, 1, 'agustina.castro@email.com'),     (15, 2, '3434-614015'),
(16, 1, 'nicolas.vargas@email.com'),      (16, 2, '3434-615016'),
(17, 1, 'florencia.jimenez@email.com'),   (17, 2, '3434-616017'),
(18, 1, 'matias.alvarez@email.com'),      (18, 2, '3434-617018'),
(19, 1, 'julieta.medina@email.com'),      (19, 2, '3434-618019'),
(20, 1, 'tomas.acosta@email.com'),        (20, 2, '3434-619020'),
(21, 1, 'rocio.vega@email.com'),          (21, 2, '3434-620021'),
(22, 1, 'gabriel.rios@email.com'),        (22, 2, '3434-621022'),
(23, 1, 'paula.peralta@email.com'),       (23, 2, '3434-622023'),
(24, 1, 'ezequiel.sosa@email.com'),       (24, 2, '3434-623024'),
(25, 1, 'natalia.guerrero@email.com'),    (25, 2, '3434-624025'),
(26, 1, 'leandro.rojas@email.com'),       (26, 2, '3434-625026'),
(27, 1, 'milagros.ortiz@email.com'),      (27, 2, '3434-626027'),
(28, 1, 'ignacio.navarro@email.com'),     (28, 2, '3434-627028'),
(29, 1, 'carla.delgado@email.com'),       (29, 2, '3434-628029'),
(30, 1, 'alejandro.rubio@email.com'),     (30, 2, '3434-629030'),
(31, 1, 'daniela.molina@email.com'),      (31, 2, '3434-630031'),
(32, 1, 'rodrigo.cabrera@email.com'),     (32, 2, '3434-631032'),
(33, 1, 'valeria.ramos@email.com'),       (33, 2, '3434-632033'),
(34, 1, 'federico.mendoza@email.com'),    (34, 2, '3434-633034'),
(35, 1, 'antonella.guzman@email.com'),    (35, 2, '3434-634035'),
(36, 1, 'hernan.ponce@email.com'),        (36, 2, '3434-635036'),
(37, 1, 'brenda.vera@email.com'),         (37, 2, '3434-636037'),
(38, 1, 'santiago.cortez@email.com'),     (38, 2, '3434-637038'),
(39, 1, 'marisol.aguilar@email.com'),     (39, 2, '3434-638039'),
(40, 1, 'juan.ibanez@email.com'),         (40, 2, '3434-639040'),
(41, 1, 'celeste.benitez@email.com'),     (41, 2, '3434-640041'),
(42, 1, 'ariel.dominguez@email.com'),     (42, 2, '3434-641042'),
(43, 1, 'micaela.silva@email.com'),       (43, 2, '3434-642043'),
(44, 1, 'maximiliano.paredes@email.com'), (44, 2, '3434-643044'),
(45, 1, 'aldana.esquivel@email.com'),     (45, 2, '3434-644045'),
(46, 1, 'emiliano.contreras@email.com'),  (46, 2, '3434-645046'),
(47, 1, 'romina.fuentes@email.com'),      (47, 2, '3434-646047'),
(48, 1, 'esteban.montes@email.com'),      (48, 2, '3434-647048'),
(49, 1, 'lorena.serrano@email.com'),      (49, 2, '3434-648049'),
(50, 1, 'damian.caceres@email.com'),      (50, 2, '3434-649050'),
(51, 1, 'yamila.blanco@email.com'),       (51, 2, '3434-650051');

-- ============================================================================
-- Modulo: Usuario (5 registros | ids 2-6)
-- Formato: inicial_nombre + apellido | Contraseña: igual al nombre de usuario
-- Roles asignados:
--   crodriguez (2): Veterinario + Administrador
--   mgonzalez  (3): Veterinario
--   lmartinez  (4): Recepcionista + Cajero
--   afernandez (5): Administrador + Gestor Inventario
--   plopez     (6): Veterinario
-- ============================================================================

INSERT INTO usuario (id, nombre, contrasena, fecha_alta, ultimo_acceso, activo, id_persona) VALUES
(2, 'crodriguez', 'crodriguez', '2024-01-15 08:00:00-03', '2026-02-28 09:15:00-03', true, 2),
(3, 'mgonzalez',  'mgonzalez',  '2024-01-15 08:00:00-03', '2026-02-28 08:30:00-03', true, 3),
(4, 'lmartinez',  'lmartinez',  '2024-03-01 08:00:00-03', '2026-02-28 10:00:00-03', true, 4),
(5, 'afernandez', 'afernandez', '2024-03-01 08:00:00-03', '2026-02-27 16:45:00-03', true, 5),
(6, 'plopez',     'plopez',     '2024-06-01 08:00:00-03', '2026-02-26 14:30:00-03', true, 6);

SELECT setval('usuario_id_seq', 6);

-- Tabla: UsuarioRol
INSERT INTO usuario_rol (id_usuario, id_rol) VALUES
(2, 1), (2, 5),  -- crodriguez: Veterinario + Administrador
(3, 1),          -- mgonzalez:  Veterinario
(4, 2), (4, 3),  -- lmartinez:  Recepcionista + Cajero
(5, 5), (5, 4),  -- afernandez: Administrador + Gestor Inventario
(6, 1);          -- plopez:     Veterinario

-- ============================================================================
-- Modulo: Empleado (5 registros | ids 2-6)
-- Veterinarios habilitados para atención: empleados 2, 3 y 6
-- ============================================================================

INSERT INTO empleado (id, fecha_ingreso, fecha_egreso, activo, id_usuario) VALUES
(2, '2024-01-15', NULL, true, 2),
(3, '2024-01-15', NULL, true, 3),
(4, '2024-03-01', NULL, true, 4),
(5, '2024-03-01', NULL, true, 5),
(6, '2024-06-01', NULL, true, 6);

SELECT setval('empleado_id_seq', 6);

-- Tabla: EmpleadoPuesto
INSERT INTO empleado_puesto (id_empleado, id_puesto, fecha_inicio, fecha_fin, activo) VALUES
(2, 1, '2024-01-15', NULL, true),  -- crodriguez: Veterinario
(3, 1, '2024-01-15', NULL, true),  -- mgonzalez:  Veterinario
(4, 2, '2024-03-01', NULL, true),  -- lmartinez:  Recepcionista
(5, 4, '2024-03-01', NULL, true),  -- afernandez: Administrador
(6, 1, '2024-06-01', NULL, true);  -- plopez:     Veterinario

-- Tabla: EmpleadoAtributo
INSERT INTO empleado_atributo (id_atributo_tipo, id_empleado, valor) VALUES
(1, 2, 'MAT-VET-12345'),  -- Matrícula crodriguez
(2, 2, 'LEG-002'),
(1, 3, 'MAT-VET-23456'),  -- Matrícula mgonzalez
(2, 3, 'LEG-003'),
(2, 4, 'LEG-004'),
(2, 5, 'LEG-005'),
(1, 6, 'MAT-VET-34567'),  -- Matrícula plopez
(2, 6, 'LEG-006');

-- Tabla: EmpleadoEspecialidad
INSERT INTO empleado_especialidad (id_empleado, id_especialidad) VALUES
(2, 1),  -- crodriguez: Clínica General
(2, 3),  -- crodriguez: Medicina de Urgencias
(3, 1),  -- mgonzalez:  Clínica General
(3, 2),  -- mgonzalez:  Cirugía General
(4, 4),  -- lmartinez:  Asistencia Quirúrgica
(4, 6),  -- lmartinez:  Toma de Muestras
(6, 1),  -- plopez:     Clínica General
(6, 2);  -- plopez:     Cirugía General

-- ============================================================================
-- Modulo: Mascota (20 registros | ids 1-20)
-- Propietarios: personas clientes (ids 7-26)
-- ============================================================================

INSERT INTO mascota (id, nombre, fecha_nacimiento, sexo, color, tamanio, pelaje, peso_gramos, esterilizado, observaciones, identificador, activo, id_raza, id_mascota_estado, id_persona) VALUES
(1,  'Rex',    '2020-03-15', 'M', 'Marrón',          'Grande',   'Corto',     32000, false, NULL,                             'CHIP-001', true,  1, 1,  7),
(2,  'Luna',   '2021-07-22', 'F', 'Negro',            'Mediano',  'Corto',     22000, true,  'Esterilizada en 2022',           'CHIP-002', true,  2, 1,  8),
(3,  'Milo',   '2019-11-10', 'M', 'Dorado',           'Grande',   'Largo',     34000, false, NULL,                             'CHIP-003', true,  3, 1,  9),
(4,  'Cleo',   '2022-05-30', 'F', 'Blanco y negro',   'Pequeño',  'Corto',      9500, true,  NULL,                             'CHIP-004', true,  4, 1,  10),
(5,  'Max',    '2018-02-14', 'M', 'Tricolor',         'Mediano',  'Corto',     14000, false, 'Paciente con artritis leve',     'CHIP-005', true,  5, 4,  11),
(6,  'Nala',   '2023-01-05', 'F', 'Albaricoque',      'Mediano',  'Rizado',     8200, false, NULL,                             'CHIP-006', true,  6, 1,  12),
(7,  'Rocky',  '2020-09-18', 'M', 'Blanco',           'Pequeño',  'Liso',       2800, true,  NULL,                             'CHIP-007', true,  7, 1,  13),
(8,  'Lola',   '2017-06-25', 'F', 'Manchado',         'Grande',   'Corto',     27500, false, 'Adulta mayor, revisión anual',   'CHIP-008', true,  8, 1,  14),
(9,  'Bruno',  '2021-04-03', 'M', 'Atigrado',         'Grande',   'Corto',     31000, false, NULL,                             'CHIP-009', true,  9, 1,  15),
(10, 'Bella',  '2022-10-12', 'F', 'Negro y blanco',   'Mediano',  'Corto',     16500, true,  NULL,                             'CHIP-010', true, 10, 1,  16),
(11, 'Simba',  '2022-08-20', 'M', 'Gris',             'Mediano',  'Largo',      4200, false, NULL,                             'CHIP-011', true, 11, 1,  17),
(12, 'Mia',    '2020-12-01', 'F', 'Crema',            'Pequeño',  'Corto',      3100, true,  NULL,                             'CHIP-012', true, 12, 1,  18),
(13, 'Oliver', '2021-03-17', 'M', 'Gris y blanco',    'Grande',   'Semilargo',  5800, false, NULL,                             'CHIP-013', true, 13, 1,  19),
(14, 'Nube',   '2019-07-08', 'F', 'Marrón manchado',  'Mediano',  'Corto',      4500, true,  'Alérgica al pollo',              'CHIP-014', true, 14, 1,  20),
(15, 'Leo',    '2022-02-28', 'M', 'Blanco',           'Mediano',  'Largo',      3900, false, NULL,                             'CHIP-015', true, 15, 1,  21),
(16, 'Kitty',  '2020-05-10', 'F', 'Gris azulado',     'Pequeño',  'Corto',      3600, true,  NULL,                             'CHIP-016', true, 16, 1,  22),
(17, 'Thor',   '2023-11-14', 'M', 'Marrón',           'Grande',   'Semilargo',  6200, false, NULL,                             'CHIP-017', true, 17, 1,  23),
(18, 'Isis',   '2021-09-30', 'F', 'Sin pelo',         'Pequeño',  'Sin pelo',   3300, true,  'Sensible al frío',               'CHIP-018', true, 18, 1,  24),
(19, 'Buddy',  '2018-04-22', 'M', 'Blanco y gris',    'Grande',   'Semilargo',  8100, false, 'Cardiopatía controlada',         'CHIP-019', true, 19, 4,  25),
(20, 'Coco',   '2025-10-10', 'M', 'Naranja',          'Pequeño',  'Corto',      1800, false, 'Cachorro, primera consulta',     'CHIP-020', true, 20, 1,  26);

SELECT setval('mascota_id_seq', 20);

-- Tabla: MascotaAlergia
INSERT INTO mascota_alergia (id_mascota, id_alergia) VALUES
(5,  7),   -- Max:   Ácaros
(14, 1),   -- Nube:  Pollo
(14, 7),   -- Nube:  Ácaros
(3,  9),   -- Milo:  Pulgas
(8,  9),   -- Lola:  Pulgas
(19, 10),  -- Buddy: Penicilina
(18, 12);  -- Isis:  Químicos

-- Tabla: MascotaCondicionCronica
INSERT INTO mascota_condicion_cronica (id_mascota, id_condicion_cronica) VALUES
(5,  4),   -- Max:   Artritis
(19, 3),   -- Buddy: Enfermedad Cardíaca
(8,  14),  -- Lola:  Obesidad
(12, 11),  -- Mia:   Enfermedad Dental Crónica
(15, 15);  -- Leo:   Dermatitis Atópica

-- ============================================================================
-- Modulo: Vacuna (50 registros)
-- Empleados veterinarios: 2, 3, 6
-- 30% (15 vacunas) sin fecha próxima de aplicación
-- 70% (35 vacunas) con próxima aplicación en marzo o abril 2026
-- ============================================================================

INSERT INTO vacuna (fecha_aplicacion, fecha_proxima_aplicacion, lote, numero_serie, observaciones, id_empleado, id_mascota, id_vacuna_tipo, activo) VALUES
-- [01] Rex — Séxtuple: con próxima
('2026-01-05 09:00:00-03', '2026-03-05 09:00:00-03', 'LOT-2026-001', 'SER-001', NULL,                              2, 1,  1,  true),
-- [02] Rex — Antirrábica: con próxima
('2026-01-05 09:10:00-03', '2026-04-05 09:10:00-03', 'LOT-2026-002', 'SER-002', 'Antirrábica obligatoria',         2, 1,  2,  true),
-- [03] Luna — Quíntuple: SIN próxima (30%)
('2026-01-08 10:00:00-03', NULL,                      'LOT-2026-003', 'SER-003', 'Próxima dosis a definir',         3, 2,  3,  true),
-- [04] Luna — Antirrábica: con próxima
('2026-01-08 10:10:00-03', '2026-04-08 10:10:00-03', 'LOT-2026-004', 'SER-004', 'Antirrábica obligatoria',         3, 2,  2,  true),
-- [05] Milo — Séxtuple: con próxima
('2026-01-10 09:00:00-03', '2026-03-10 09:00:00-03', 'LOT-2026-005', 'SER-005', NULL,                              6, 3,  1,  true),
-- [06] Milo — Leptospirosis: SIN próxima (30%)
('2026-01-10 09:10:00-03', NULL,                      'LOT-2026-006', 'SER-006', 'Segunda dosis a evaluar',         6, 3,  10, true),
-- [07] Cleo — Triple felina: con próxima
('2026-01-12 11:00:00-03', '2026-03-12 11:00:00-03', 'LOT-2026-007', 'SER-007', NULL,                              2, 4,  4,  true),
-- [08] Cleo — Antirrábica: SIN próxima (30%)
('2026-01-12 11:10:00-03', NULL,                      'LOT-2026-008', 'SER-008', 'Refuerzo pendiente definición',   2, 4,  2,  true),
-- [09] Max — Séxtuple: con próxima
('2026-01-15 09:00:00-03', '2026-03-15 09:00:00-03', 'LOT-2026-009', 'SER-009', 'Artritis: toleró bien',           3, 5,  1,  true),
-- [10] Max — Leptospirosis: con próxima
('2026-01-15 09:10:00-03', '2026-04-15 09:10:00-03', 'LOT-2026-010', 'SER-010', NULL,                              3, 5,  10, true),
-- [11] Nala — Séxtuple: con próxima
('2026-01-18 14:00:00-03', '2026-03-18 14:00:00-03', 'LOT-2026-011', 'SER-011', NULL,                              6, 6,  1,  true),
-- [12] Nala — Tos de perreras: SIN próxima (30%)
('2026-01-18 14:10:00-03', NULL,                      'LOT-2026-012', 'SER-012', 'Evaluación 30 días post-dosis',   6, 6,  6,  true),
-- [13] Rocky — Quíntuple: con próxima
('2026-01-20 09:00:00-03', '2026-03-20 09:00:00-03', 'LOT-2026-013', 'SER-013', NULL,                              2, 7,  3,  true),
-- [14] Rocky — Antirrábica: con próxima
('2026-01-20 09:10:00-03', '2026-04-20 09:10:00-03', 'LOT-2026-014', 'SER-014', 'Antirrábica obligatoria',         2, 7,  2,  true),
-- [15] Lola — Séxtuple: con próxima
('2026-01-22 10:00:00-03', '2026-03-22 10:00:00-03', 'LOT-2026-015', 'SER-015', 'Adulta mayor, toleró bien',       3, 8,  1,  true),
-- [16] Lola — Antirrábica: SIN próxima (30%)
('2026-01-22 10:10:00-03', NULL,                      'LOT-2026-016', 'SER-016', 'Refuerzo antirrábico pendiente',  3, 8,  2,  true),
-- [17] Bruno — Séxtuple: con próxima
('2026-01-25 09:00:00-03', '2026-03-25 09:00:00-03', 'LOT-2026-017', 'SER-017', NULL,                              6, 9,  1,  true),
-- [18] Bruno — Tos de perreras: con próxima
('2026-01-25 09:10:00-03', '2026-04-25 09:10:00-03', 'LOT-2026-018', 'SER-018', 'Primera dosis Bordetella',        6, 9,  6,  true),
-- [19] Bella — Quíntuple: con próxima
('2026-01-27 10:00:00-03', '2026-03-27 10:00:00-03', 'LOT-2026-019', 'SER-019', NULL,                              2, 10, 3,  true),
-- [20] Bella — Antirrábica: con próxima
('2026-01-27 10:10:00-03', '2026-04-27 10:10:00-03', 'LOT-2026-020', 'SER-020', 'Antirrábica obligatoria',         2, 10, 2,  true),
-- [21] Simba — Triple felina: con próxima
('2026-01-29 11:00:00-03', '2026-03-29 11:00:00-03', 'LOT-2026-021', 'SER-021', NULL,                              3, 11, 4,  true),
-- [22] Simba — Leucemia felina: SIN próxima (30%)
('2026-01-29 11:10:00-03', NULL,                      'LOT-2026-022', 'SER-022', 'FeLV: evaluar próxima dosis',     3, 11, 5,  true),
-- [23] Mia — Cuádruple felina: con próxima
('2026-02-03 09:00:00-03', '2026-04-03 09:00:00-03', 'LOT-2026-023', 'SER-023', NULL,                              6, 12, 9,  true),
-- [24] Mia — Leucemia felina: con próxima
('2026-02-03 09:10:00-03', '2026-03-03 09:10:00-03', 'LOT-2026-024', 'SER-024', 'Refuerzo pronto',                 6, 12, 5,  true),
-- [25] Oliver — Cuádruple felina: con próxima
('2026-02-05 10:00:00-03', '2026-04-05 10:00:00-03', 'LOT-2026-025', 'SER-025', NULL,                              2, 13, 9,  true),
-- [26] Oliver — Antirrábica: con próxima
('2026-02-05 10:10:00-03', '2026-03-05 10:10:00-03', 'LOT-2026-026', 'SER-026', 'Antirrábica obligatoria',         2, 13, 2,  true),
-- [27] Nube — Cuádruple felina: con próxima
('2026-02-07 09:00:00-03', '2026-03-07 09:00:00-03', 'LOT-2026-027', 'SER-027', 'Alérgica al pollo, sin reacción', 3, 14, 9,  true),
-- [28] Nube — Antirrábica: SIN próxima (30%)
('2026-02-07 09:10:00-03', NULL,                      'LOT-2026-028', 'SER-028', 'Antirrábica pendiente',           3, 14, 2,  true),
-- [29] Leo — Triple felina: con próxima
('2026-02-10 11:00:00-03', '2026-04-10 11:00:00-03', 'LOT-2026-029', 'SER-029', NULL,                              6, 15, 4,  true),
-- [30] Leo — Leucemia felina: con próxima
('2026-02-10 11:10:00-03', '2026-03-10 11:10:00-03', 'LOT-2026-030', 'SER-030', NULL,                              6, 15, 5,  true),
-- [31] Kitty — Triple felina: con próxima
('2026-02-12 09:00:00-03', '2026-04-12 09:00:00-03', 'LOT-2026-031', 'SER-031', NULL,                              2, 16, 4,  true),
-- [32] Kitty — Antirrábica: con próxima
('2026-02-12 09:10:00-03', '2026-03-12 09:10:00-03', 'LOT-2026-032', 'SER-032', 'Antirrábica obligatoria',         2, 16, 2,  true),
-- [33] Thor — Cuádruple felina: con próxima
('2026-02-14 10:00:00-03', '2026-04-14 10:00:00-03', 'LOT-2026-033', 'SER-033', NULL,                              3, 17, 9,  true),
-- [34] Thor — Triple felina: SIN próxima (30%)
('2026-02-14 10:10:00-03', NULL,                      'LOT-2026-034', 'SER-034', 'Primera vacunación, seguimiento', 3, 17, 4,  true),
-- [35] Isis — Cuádruple felina: con próxima
('2026-02-17 09:00:00-03', '2026-04-17 09:00:00-03', 'LOT-2026-035', 'SER-035', 'Sensible al frío, toleró bien',   6, 18, 9,  true),
-- [36] Isis — Leucemia felina: SIN próxima (30%)
('2026-02-17 09:10:00-03', NULL,                      'LOT-2026-036', 'SER-036', 'FeLV pendiente próxima consulta', 6, 18, 5,  true),
-- [37] Buddy — Quíntuple: con próxima
('2026-02-19 11:00:00-03', '2026-04-19 11:00:00-03', 'LOT-2026-037', 'SER-037', 'Cardiopatía, toleró bien',        2, 19, 3,  true),
-- [38] Buddy — Antirrábica: con próxima
('2026-02-19 11:10:00-03', '2026-03-19 11:10:00-03', 'LOT-2026-038', 'SER-038', 'Antirrábica obligatoria',         2, 19, 2,  true),
-- [39] Coco — Parvovirus (1ra dosis cachorro): con próxima
('2026-02-21 09:00:00-03', '2026-03-14 09:00:00-03', 'LOT-2026-039', 'SER-039', 'Primera dosis esquema cachorro',  3, 20, 8,  true),
-- [40] Coco — Séxtuple: con próxima
('2026-02-21 09:10:00-03', '2026-03-21 09:10:00-03', 'LOT-2026-040', 'SER-040', 'Segunda dosis en 4 semanas',      3, 20, 1,  true),
-- Refuerzos y vacunas adicionales
-- [41] Rex — Leptospirosis refuerzo: con próxima
('2026-02-03 10:00:00-03', '2026-03-03 10:00:00-03', 'LOT-2026-041', 'SER-041', 'Refuerzo semestral leptospira',   6, 1,  10, true),
-- [42] Milo — Giardia: SIN próxima (30%)
('2026-02-05 14:00:00-03', NULL,                      'LOT-2026-042', 'SER-042', 'Giardia, evaluar respuesta',      2, 3,  7,  true),
-- [43] Max — Tos de perreras: con próxima
('2026-02-10 09:00:00-03', '2026-04-10 09:00:00-03', 'LOT-2026-043', 'SER-043', NULL,                              3, 5,  6,  true),
-- [44] Nala — Tos de perreras refuerzo: con próxima
('2026-02-12 11:00:00-03', '2026-03-12 11:00:00-03', 'LOT-2026-044', 'SER-044', 'Refuerzo Bordetella',             6, 6,  6,  true),
-- [45] Bruno — Leptospirosis: con próxima
('2026-02-14 09:00:00-03', '2026-04-14 09:00:00-03', 'LOT-2026-045', 'SER-045', NULL,                              2, 9,  10, true),
-- [46] Bella — Giardia: SIN próxima (30%)
('2026-02-17 10:00:00-03', NULL,                      'LOT-2026-046', 'SER-046', 'Control efectividad 30 días',     3, 10, 7,  true),
-- [47] Simba — Leucemia felina refuerzo: con próxima
('2026-02-19 09:00:00-03', '2026-03-19 09:00:00-03', 'LOT-2026-047', 'SER-047', 'Refuerzo leucemia felina',        6, 11, 5,  true),
-- [48] Oliver — Leucemia felina: con próxima
('2026-02-21 11:00:00-03', '2026-04-21 11:00:00-03', 'LOT-2026-048', 'SER-048', NULL,                              2, 13, 5,  true),
-- [49] Leo — Cuádruple felina refuerzo: con próxima
('2026-02-24 10:00:00-03', '2026-03-24 10:00:00-03', 'LOT-2026-049', 'SER-049', NULL,                              3, 15, 9,  true),
-- [50] Coco — Parvovirus (3ra dosis): SIN próxima (30%)
('2026-02-26 09:00:00-03', NULL,                      'LOT-2026-050', 'SER-050', '3ra dosis, próxima a definir',    6, 20, 8,  true);

-- ============================================================================
-- Modulo: Turno (50 registros)
-- Fechas: febrero y marzo 2026
-- Registrados por: usuario 4 (lmartinez - recepcionista)
-- Atendidos por veterinarios: empleados 2, 3, 6
-- Estados pasados (feb): completados, cancelados, no asistidos, reprogramados
-- Estados futuros (mar): programados
-- ============================================================================

INSERT INTO turno (fecha_hora, duracion_minutos, motivo, notas, id_turno_tipo, id_turno_estado, id_usuario_registro, id_empleado_asignado, id_mascota, activo) VALUES
-- ========== Febrero 2026 — Completados ==========
('2026-02-03 09:00:00-03', 30, 'Consulta de rutina anual',           NULL,                                   1,  4, 4, 2, 1,  true),
('2026-02-03 09:40:00-03', 20, 'Vacunación anual séxtuple',          NULL,                                   4,  4, 4, 2, 1,  true),
('2026-02-03 10:10:00-03', 30, 'Control post-esterilización',        NULL,                                   5,  4, 4, 3, 2,  true),
('2026-02-04 09:00:00-03', 45, 'Gastroenteritis aguda',              'Vómitos y diarrea 24 hs',              2,  4, 4, 6, 3,  true),
('2026-02-04 10:00:00-03', 20, 'Vacunación séxtuple',                NULL,                                   4,  4, 4, 6, 4,  true),
('2026-02-05 09:00:00-03', 30, 'Control artritis crónica',           NULL,                                   5,  4, 4, 2, 5,  true),
('2026-02-05 10:30:00-03', 45, 'Extracción de muestras',             NULL,                                   6,  4, 4, 3, 5,  true),
('2026-02-06 09:00:00-03', 30, 'Lesión cutánea por mordedura',       NULL,                                   1,  4, 4, 6, 6,  true),
('2026-02-06 10:00:00-03', 20, 'Desparasitación de rutina',          NULL,                                   7,  4, 4, 2, 7,  true),
('2026-02-07 09:00:00-03', 60, 'Limpieza dental preventiva',         NULL,                                   10, 4, 4, 3, 8,  true),
('2026-02-07 11:00:00-03', 30, 'Análisis de laboratorio',            NULL,                                   6,  4, 4, 6, 9,  true),
('2026-02-10 09:00:00-03', 30, 'Chequeo anual adulto mayor',         NULL,                                   1,  4, 4, 2, 10, true),
('2026-02-10 10:00:00-03', 30, 'Estornudos y secreción nasal',       'Posible rinitis alérgica',             1,  4, 4, 3, 11, true),
('2026-02-10 11:00:00-03', 20, 'Vacunación cuádruple felina',        NULL,                                   4,  4, 4, 6, 12, true),
('2026-02-11 09:00:00-03', 30, 'Tos crónica persistente',            NULL,                                   1,  4, 4, 2, 13, true),
('2026-02-11 10:00:00-03', 30, 'Control dermatitis mensual',         NULL,                                   5,  4, 4, 3, 14, true),
('2026-02-12 09:00:00-03', 30, 'Vacunación + consulta general',      NULL,                                   4,  4, 4, 6, 15, true),
('2026-02-12 10:30:00-03', 60, 'Ecografía abdominal de control',     NULL,                                   12, 4, 4, 2, 16, true),
('2026-02-13 09:00:00-03', 30, 'Control cardíaco semestral',         'Cardiopatía en seguimiento',           1,  4, 4, 3, 19, true),
('2026-02-13 10:00:00-03', 30, 'Inapetencia 4 días',                 NULL,                                   1,  4, 4, 6, 20, true),
('2026-02-14 09:00:00-03', 30, 'Vacunación anual',                   NULL,                                   4,  4, 4, 2, 17, true),
('2026-02-14 10:00:00-03', 45, 'Radiografía tórax control',          'Control bronconeumonía previa',        12, 4, 4, 3, 13, true),
('2026-02-17 09:00:00-03', 30, 'Sensibilidad cutánea generalizada',  NULL,                                   1,  4, 4, 6, 18, true),
('2026-02-17 10:30:00-03', 90, 'Cirugía dental extracción',          NULL,                                   10, 4, 4, 2, 8,  true),
('2026-02-18 09:00:00-03', 20, 'Vacunación quíntuple canina',        NULL,                                   4,  4, 4, 3, 19, true),
('2026-02-18 10:00:00-03', 30, 'Traumatismo ocular urgente',         'Úlcera corneal sospechada',            2,  4, 4, 6, 7,  true),
('2026-02-19 09:00:00-03', 30, 'Infestación de pulgas',              NULL,                                   1,  4, 4, 2, 9,  true),
('2026-02-19 11:00:00-03', 30, 'Control peso mensual - obesidad',    'Plan nutricional en curso',            14, 4, 4, 3, 8,  true),
('2026-02-25 09:00:00-03', 45, 'Convulsión episódica urgente',       'Primera convulsión registrada',        2,  4, 4, 2, 5,  true),
('2026-02-25 10:00:00-03', 30, 'Infección urinaria',                 NULL,                                   1,  4, 4, 3, 16, true),
('2026-02-26 09:30:00-03', 30, 'Control cardíaco trimestral',        NULL,                                   5,  4, 4, 6, 19, true),
('2026-02-26 11:00:00-03', 45, 'Análisis pre-quirúrgico',            NULL,                                   6,  4, 4, 2, 17, true),
('2026-02-27 09:00:00-03', 30, 'Primera consulta cachorro',          'Primer control Coco',                  1,  4, 4, 3, 20, true),
('2026-02-27 10:30:00-03', 20, 'Desparasitación',                    NULL,                                   7,  4, 4, 6, 4,  true),
('2026-02-28 09:00:00-03', 45, 'Chequeo pre-anestésico',             'Cirugía programada 06-03',             1,  4, 4, 2, 17, true),
('2026-02-28 10:00:00-03', 30, 'Control dermatitis crónica',         NULL,                                   5,  4, 4, 3, 14, true),
-- ========== Febrero 2026 — Otros estados ==========
('2026-02-20 09:00:00-03', 30, 'Consulta general',                   'Cliente canceló por viaje',            1,  5, 4, 6, 3,  true),
('2026-02-20 10:00:00-03', 90, 'Cirugía castración Thor',            'Reprogramado para 06-03',              9,  8, 4, 2, 17, true),
('2026-02-24 09:30:00-03', 30, 'Vacunación anual',                   NULL,                                   4,  7, 4, 3, 10, true),
('2026-02-24 11:00:00-03', 30, 'Control post-vacuna',                'Cancelado por feriado clínica',        5,  6, 4, 6, 12, true),
-- ========== Marzo 2026 — Programados ==========
('2026-03-03 09:00:00-03', 30, 'Consulta general rutina',            NULL,                                   1,  1, 4, 6, 1,  true),
('2026-03-03 10:00:00-03', 20, 'Vacunación refuerzo leptospira',     NULL,                                   4,  1, 4, 6, 3,  true),
('2026-03-05 09:00:00-03', 30, 'Control dermatitis + alergia',       NULL,                                   5,  1, 4, 2, 14, true),
('2026-03-05 10:30:00-03', 45, 'Extracción muestras laboratorio',    NULL,                                   6,  1, 4, 3, 5,  true),
('2026-03-06 09:00:00-03', 90, 'Cirugía castración Thor',            'Reprogramado desde 20-02',             9,  1, 4, 2, 17, true),
('2026-03-10 09:00:00-03', 30, 'Control cardíaco Buddy',             NULL,                                   1,  1, 4, 3, 19, true),
('2026-03-10 10:30:00-03', 20, 'Vacunación 2da dosis Coco',          NULL,                                   4,  1, 4, 6, 20, true),
('2026-03-12 09:00:00-03', 30, 'Odontología preventiva Mia',         NULL,                                   10, 1, 4, 2, 12, true),
('2026-03-15 10:00:00-03', 30, 'Control post-cirugía Thor',          NULL,                                   5,  1, 4, 3, 17, true),
('2026-03-20 09:00:00-03', 30, 'Consulta nutrición Lola',            NULL,                                   14, 1, 4, 6, 8,  true);

-- ============================================================================
-- Modulo: Historial Clínico (50 registros)
-- Fechas: enero 2026 y febrero 2026
-- Empleados veterinarios: 2, 3, 6
-- ============================================================================

INSERT INTO historial_clinico (id, fecha_consulta, motivo_consulta, tratamiento, observaciones, id_mascota, id_empleado_asignado, activo) VALUES
-- ========== Enero 2026 ==========
(1,  '2026-01-05 09:00:00-03', 'Consulta de rutina anual',              'Antiparasitario externo + vitaminas',                'Buen estado general. Pelaje brillante, mucosas rosadas.',          1,  2, true),
(2,  '2026-01-08 10:00:00-03', 'Control post-esterilización',           'Alta definitiva. Sin tratamiento activo',            'Cicatriz completamente cerrada. Sin signos de infección.',         2,  3, true),
(3,  '2026-01-10 09:00:00-03', 'Vómitos y diarrea aguda',               'Ayuno 24 hs + dieta blanda + antieméticos IV',      'Gastroenteritis viral. Internación 12 hs. Evolución favorable.',  3,  6, true),
(4,  '2026-01-12 11:00:00-03', 'Dermatitis en dorso lumbar',            'Shampoo medicado + antihistamínico oral 7 días',    'Eritema circunscripto 4 cm. Sin parásitos. Alergia ambiental.',   4,  2, true),
(5,  '2026-01-15 09:00:00-03', 'Control artritis crónica mensual',      'AINES + suplemento articular. Sin cambios de dosis', 'Movilidad reducida tren posterior. Estado estable.',               5,  3, true),
(6,  '2026-01-18 14:00:00-03', 'Herida en cuello por mordedura',        'Limpieza + antibiótico tópico + collar isabelino',  'Herida superficial sin compromiso muscular ni infección.',        6,  6, true),
(7,  '2026-01-20 09:00:00-03', 'Desparasitación + consulta general',    'Antiparasitario pipeta + comprimido interno',       'Sin ectoparásitos. Pelaje limpio. Buen estado general.',          7,  2, true),
(8,  '2026-01-22 10:00:00-03', 'Limpieza dental y revisión oral',       'Profilaxis dental + flúor tópico',                  'Gingivitis moderada en molares. Seguimiento en 6 meses.',         8,  3, true),
(9,  '2026-01-25 09:00:00-03', 'Análisis de sangre de control',         'Sin modificación de tratamiento',                   'Hemograma y bioquímica normales. Función hepática conservada.',   9,  6, true),
(10, '2026-01-27 10:00:00-03', 'Chequeo anual rutina adulto',           'Antiparasitario externo + vitaminas articulares',   'Adulto mayor. Articulaciones con leve rigidez. Sin otros hallaz.',10, 2, true),
(11, '2026-01-29 11:00:00-03', 'Estornudos frecuentes y secreción',     'Antihistamínico + colirio antiinflamatorio 10 días','Rinitis alérgica estacional probable. Control en 2 semanas.',    11, 3, true),
(12, '2026-01-29 09:00:00-03', 'Consulta general + vacunación',         'Cuádruple felina aplicada. Sin reacciones',         'Sarro leve. Sin otras alteraciones relevantes.',                  12, 6, true),
(13, '2026-01-30 09:00:00-03', 'Tos crónica persistente',               'Antibiótico 10 días + nebulización diaria',         'Crepitaciones campo pulmonar derecho. Bronconeumonía leve.',      13, 2, true),
(14, '2026-01-30 10:00:00-03', 'Control mensual dermatitis alérgica',   'Cambio corticoide + dieta hipoalergénica nueva',   'Mejoría respecto a última consulta. Eritema leve residual.',      14, 3, true),
(15, '2026-01-31 09:00:00-03', 'Vacunación + consulta general',         'Triple felina + leucemia felina aplicadas',         'Sin reacciones adversas. Observación 30 min post-vacuna.',        15, 6, true),
-- ========== Febrero 2026 ==========
(16, '2026-02-03 09:00:00-03', 'Consulta de rutina anual',              'Antiparasitario externo + vitaminas',                'Excelente estado. Mucosas rosadas. Sin hallazgos relevantes.',    1,  2, true),
(17, '2026-02-03 10:10:00-03', 'Control post-esterilización 2do control','Sin tratamiento necesario',                        'Buen estado. Cicatriz totalmente curada.',                         2,  3, true),
(18, '2026-02-04 09:00:00-03', 'Gastroenteritis + deshidratación leve', 'Suero IV + antieméticos + protector gástrico',     'Febril 39.1°C. Internación 24 hs. Evolución favorable.',          3,  6, true),
(19, '2026-02-04 10:00:00-03', 'Vacunación séxtuple canina',            'Séxtuple aplicada. Sin incidentes',                 'Sin reacciones adversas. Próximo refuerzo indicado.',             4,  6, true),
(20, '2026-02-05 09:00:00-03', 'Control artritis crónica',              'AINES + suplemento articular continuados',           'Leve mejoría en flexión. Radiografía columna sugerida.',          5,  2, true),
(21, '2026-02-05 10:30:00-03', 'Extracción de muestras - laboratorio',  'Sin tratamiento inmediato',                         'Perfil bioquímico + hemograma enviado. Resultados en 48 hs.',    5,  3, true),
(22, '2026-02-06 09:00:00-03', 'Alopecia focal zona lumbar',            'Suplemento omega-3 + shampoo dermatológico',        'Parche alopécico 3 cm. Sin parásitos. Origen no determinado.',    6,  6, true),
(23, '2026-02-06 10:00:00-03', 'Desparasitación de rutina',             'Antiparasitario pipeta + comprimido interno',       'Sin hallazgos. Buen estado general.',                             7,  2, true),
(24, '2026-02-07 09:00:00-03', 'Limpieza dental preventiva',            'Profilaxis dental + extracción pieza 409',          'Periodontitis inicial. Seguimiento en 4 meses.',                  8,  3, true),
(25, '2026-02-07 11:00:00-03', 'Análisis de sangre de control',         'Ajuste de dosis según resultados',                  'Creatinina levemente elevada. Control renal en 1 mes.',           9,  6, true),
(26, '2026-02-10 09:00:00-03', 'Chequeo anual adulto mayor',            'Antiparasitario + vitaminas articulares',           'Buen estado. Rigidez articular leve compensada con suplemento.', 10, 2, true),
(27, '2026-02-10 10:00:00-03', 'Otitis externa bilateral',              'Limpieza ótica + gotas antibióticas 7 días',       'Otitis bacteriana. Sin compromiso oído medio. Control 10 días.',  11, 3, true),
(28, '2026-02-10 11:00:00-03', 'Vacunación cuádruple felina',           'Vacuna aplicada sin incidentes',                   'Sin reacciones adversas. Observación 20 min.',                    12, 6, true),
(29, '2026-02-11 09:00:00-03', 'Control bronconeumonía 1 semana',       'Antibiótico 5 días más + nebulización continúa',   'Mejoría notable. Auscultación sin crepitaciones activas.',        13, 2, true),
(30, '2026-02-11 10:00:00-03', 'Control dermatitis + prueba alergia',   'Inmunoterapia + ajuste corticoide',                 'Positivo ácaros y pollo. Plan de inmunoterapia iniciado.',        14, 3, true),
(31, '2026-02-12 09:00:00-03', 'Vacunación + consulta general',         'Triple felina + leucemia felina aplicadas',         'Sin hallazgos clínicos. Buen estado general.',                    15, 6, true),
(32, '2026-02-12 10:30:00-03', 'Ecografía abdominal de control',        'Sin tratamiento adicional',                         'Órganos abdominales sin hallazgos patológicos.',                  16, 2, true),
(33, '2026-02-13 09:00:00-03', 'Control cardíaco semestral',            'Ajuste furosemida + continuación digoxina',         'Soplo III/VI. Arritmia leve controlada. ECG estable.',            19, 3, true),
(34, '2026-02-13 10:00:00-03', 'Inapetencia hace 4 días',               'Estimulante de apetito + dieta húmeda palatino',   'Sin causa orgánica evidente. Posible estrés ambiental.',          20, 6, true),
(35, '2026-02-14 09:00:00-03', 'Vacunación anual',                      'Cuádruple felina aplicada sin incidentes',         'Sin reacciones. Primera vez con esta combinación. Bien tolerado.', 17,  2, true),
(36, '2026-02-14 10:00:00-03', 'Radiografía tórax control',             'Sin cambios en tratamiento actual',                 'Campos pulmonares limpios. Alta definitiva de bronconeumonía.',   13, 3, true),
(37, '2026-02-17 09:00:00-03', 'Sensibilidad cutánea difusa',           'Corticoide sistémico + dieta hipoalergénica',      'Eritema difuso en abdomen. Posible reacción al frío.',            18, 6, true),
(38, '2026-02-17 10:30:00-03', 'Cirugía dental - extracción pieza 309', 'Extracción + antibiótico 7 días + antiinflamatorio','Cirugía sin complicaciones. Ayuno sólido 24 hs post-proc.',      8,  2, true),
(39, '2026-02-18 09:00:00-03', 'Vacunación quíntuple + antirrábica',    'Vacunas aplicadas sin incidentes',                 'Cardiopatía: toleró bien. Observación 30 min post-vacuna.',       19, 3, true),
(40, '2026-02-18 10:00:00-03', 'Traumatismo ocular - úlcera corneal',   'Colirio antibiótico + analgésico sistémico',       'Úlcera corneal grado I ojo derecho. Control en 72 hs.',           7,  6, true),
(41, '2026-02-19 09:00:00-03', 'Infestación de pulgas',                 'Antiparasitario pipeta + baño medicado',           'Infestación moderada. Indicado desinfectar el hogar.',            9,  2, true),
(42, '2026-02-19 11:00:00-03', 'Control peso mensual - obesidad',       'Ajuste plan nutricional + ejercicio diario 30 min','Perdió 1.4 kg. Objetivo alcanzado el mes. Continuar plan.',       8,  3, true),
(43, '2026-02-21 09:00:00-03', 'Primera consulta cachorro',             'Desparasitación + vitaminas + primera vacuna',     'Cachorro 16 semanas. Desarrollo normal. Muy activo.',             20, 6, true),
(44, '2026-02-24 09:00:00-03', 'Infección urinaria',                    'Antibiótico 10 días + diurético + aumento hidrat.','Urocultivo positivo E. coli. Control urocultivo en 2 semanas.',  16, 2, true),
(45, '2026-02-24 10:00:00-03', 'Control otitis - alta',                 'Alta definitiva. Sin tratamiento adicional',       'Conductos auditivos limpios. Sin signos de recidiva.',            11, 3, true),
(46, '2026-02-25 09:00:00-03', 'Convulsión tónico-clónica episódica',   'Fenobarbital oral + diazepam de rescate en casa',  'Primera convulsión. Duración 2 min. EEG programado urgente.',     5,  2, true),
(47, '2026-02-25 10:00:00-03', 'Infección urinaria - control',          'Cambio antibiótico según cultivo',                 'Reajuste a amoxicilina-clavulánico. Urocultivo control 1 semana.',16, 3, true),
(48, '2026-02-26 09:30:00-03', 'Control cardíaco trimestral',           'Sin cambios en medicación cardíaca',               'Arritmia estabilizada. Próxima revisión en 3 meses.',             19, 6, true),
(49, '2026-02-27 09:00:00-03', 'Primera consulta + desparasitación',    'Desparasitación + vitaminas. Cartilla iniciada',   'Cachorro activo. Mucosas rosadas. Peso 1.8 kg. Normal.',          20, 2, true),
(50, '2026-02-28 09:00:00-03', 'Chequeo pre-anestésico cirugía',        'Autorización cirugía concedida',                   'Perfil preanestésico: hemograma y bioquímica dentro de rango.',   17, 3, true);

SELECT setval('historial_clinico_id_seq', 50);

-- Tabla: ExamenFisico (uno por historial clínico)
INSERT INTO examen_fisico (peso_gramos, temperatura_corporal, frecuencia_cardiaca, frecuencia_respiratoria, estado_hidratacion, general, id_historial_clinico) VALUES
(32100, '38.5°C', '80 lpm',  '18 rpm', 'Buena',    'Sin hallazgos relevantes. Pelaje brillante, mucosas rosadas.',          1),
(22300, '38.2°C', '120 lpm', '24 rpm', 'Buena',    'Cicatriz quirúrgica completamente cerrada. Sin infección.',             2),
(34200, '39.0°C', '102 lpm', '28 rpm', 'Moderada', 'Febril. Mucosas levemente pálidas. Borborigmos aumentados.',            3),
(9600,  '38.4°C', '130 lpm', '28 rpm', 'Buena',    'Eritema circunscripto en dorso lumbar 4 cm. Sin parásitos.',            4),
(14100, '38.7°C', '85 lpm',  '22 rpm', 'Buena',    'Rigidez articular moderada en miembros posteriores.',                   5),
(8300,  '38.3°C', '115 lpm', '25 rpm', 'Buena',    'Herida superficial zona cervical. Sin signos de infección activa.',     6),
(2900,  '38.5°C', '140 lpm', '32 rpm', 'Buena',    'Pelaje limpio, sin ectoparásitos visibles. Buen estado.',               7),
(27500, '38.4°C', '86 lpm',  '18 rpm', 'Buena',    'Sarro moderado, gingivitis leve en molares.',                           8),
(31500, '38.4°C', '90 lpm',  '21 rpm', 'Buena',    'Hemograma y bioquímica dentro de parámetros normales.',                 9),
(16800, '38.3°C', '88 lpm',  '20 rpm', 'Buena',    'Paciente adulto mayor. Articulaciones con leve rigidez.',              10),
(4300,  '38.5°C', '110 lpm', '22 rpm', 'Buena',    'Estornudos frecuentes. Mucosa nasal levemente eritematosa.',           11),
(3200,  '38.2°C', '115 lpm', '26 rpm', 'Buena',    'Sin hallazgos clínicos relevantes.',                                  12),
(5900,  '38.6°C', '118 lpm', '30 rpm', 'Buena',    'Taquipnea leve. Crepitaciones en campo pulmonar derecho.',            13),
(4600,  '38.7°C', '110 lpm', '24 rpm', 'Buena',    'Eritema moderado en cuello, flancos y abdomen. Sin parásitos.',       14),
(4000,  '38.3°C', '108 lpm', '22 rpm', 'Buena',    'Sin hallazgos. Vacunación bien tolerada.',                            15),
(32200, '38.5°C', '81 lpm',  '18 rpm', 'Buena',    'Mucosas rosadas. Pelaje brillante. Excelente estado general.',        16),
(22400, '38.3°C', '119 lpm', '25 rpm', 'Buena',    'Buen estado post-esterilización. Sin alteraciones.',                  17),
(34500, '39.1°C', '104 lpm', '28 rpm', 'Moderada', 'Febril. Signos de deshidratación leve. Dolor abdominal a palpación.', 18),
(9700,  '38.4°C', '132 lpm', '28 rpm', 'Buena',    'Sin reacciones post-vacuna. Observación 30 min sin novedad.',         19),
(14000, '38.6°C', '84 lpm',  '20 rpm', 'Buena',    'Dolor palpación zona lumbar. Flexión reducida miembros posteriores.', 20),
(14100, '38.5°C', '85 lpm',  '22 rpm', 'Buena',    'Sin hallazgos. Toma de muestras sin incidentes.',                    21),
(8200,  '38.5°C', '113 lpm', '24 rpm', 'Buena',    'Alopecia circular zona lumbar 3 cm. Sin parásitos.',                 22),
(2900,  '38.5°C', '142 lpm', '32 rpm', 'Buena',    'Sin ectoparásitos visibles. Buen estado general.',                   23),
(27200, '38.4°C', '86 lpm',  '18 rpm', 'Buena',    'Periodontitis inicial. Pieza 409 con movilidad grado I.',            24),
(31400, '38.3°C', '91 lpm',  '22 rpm', 'Buena',    'Leve elevación creatinina. Sin otros hallazgos.',                    25),
(16900, '38.3°C', '87 lpm',  '20 rpm', 'Buena',    'Buen estado general. Rigidez articular leve compensada.',            26),
(4400,  '38.3°C', '112 lpm', '24 rpm', 'Buena',    'Eritema y secreción en ambos conductos auditivos.',                  27),
(3100,  '38.2°C', '113 lpm', '24 rpm', 'Buena',    'Sin reacciones post-vacuna.',                                        28),
(5900,  '38.4°C', '116 lpm', '24 rpm', 'Buena',    'Pulmones limpios a la auscultación. Mejoría notable.',               29),
(4700,  '38.3°C', '108 lpm', '22 rpm', 'Buena',    'Eritema residual leve. Respuesta positiva al plan de inmunoterapia.',30),
(3900,  '38.3°C', '107 lpm', '22 rpm', 'Buena',    'Sin hallazgos clínicos. Buen estado.',                               31),
(3700,  '38.2°C', '110 lpm', '22 rpm', 'Buena',    'Órganos abdominales sin hallazgos patológicos.',                     32),
(8000,  '38.0°C', '99 lpm',  '18 rpm', 'Buena',    'Soplo cardíaco grado III/VI. Arritmia controlada. Sin edemas.',      33),
(3900,  '38.5°C', '122 lpm', '28 rpm', 'Buena',    'Sin causa orgánica identificada. Aspecto general conservado.',       34),
(6200,  '38.3°C', '114 lpm', '26 rpm', 'Buena',    'Sin reacciones adversas. Primera cuádruple bien tolerada.',          35),
(6100,  '38.4°C', '117 lpm', '26 rpm', 'Buena',    'Pulmones completamente limpios. Alta de bronconeumonía.',            36),
(3400,  '38.2°C', '114 lpm', '26 rpm', 'Buena',    'Eritema difuso abdomen. Piel seca. Posible reacción al frío.',      37),
(27100, '38.2°C', '85 lpm',  '18 rpm', 'Buena',    'Cirugía dental sin complicaciones. Herida quirúrgica limpia.',       38),
(8050,  '38.1°C', '100 lpm', '20 rpm', 'Buena',    'Vacunas toleradas. Soplo grado III/VI sin cambios respecto ECG.',   39),
(2900,  '38.7°C', '145 lpm', '34 rpm', 'Buena',    'Ojo derecho: úlcera corneal grado I. Blefaroespasmo activo.',       40),
(31200, '38.4°C', '91 lpm',  '21 rpm', 'Buena',    'Infestación moderada pulgas. Dermatitis por picadura leve.',        41),
(27800, '38.3°C', '86 lpm',  '18 rpm', 'Buena',    'Sobrepeso IMC 30. Pérdida mensual 1.4 kg. Evolución positiva.',     42),
(1900,  '38.4°C', '128 lpm', '32 rpm', 'Buena',    'Cachorro activo. Mucosas rosadas. Desarrollo normal 16 semanas.',  43),
(3700,  '38.5°C', '116 lpm', '26 rpm', 'Buena',    'Sin hallazgos. Urocultivo enviado a laboratorio.',                 44),
(4400,  '38.3°C', '111 lpm', '24 rpm', 'Buena',    'Conductos auditivos completamente limpios. Alta definitiva.',      45),
(14100, '38.4°C', '88 lpm',  '20 rpm', 'Buena',    'Primera convulsión tónico-clónica. 2 min. Post-ictal 5 min.',      46),
(3700,  '38.5°C', '115 lpm', '24 rpm', 'Buena',    'Sin hallazgos. Cultivo urinario a seguimiento.',                   47),
(8050,  '38.0°C', '101 lpm', '19 rpm', 'Buena',    'Arritmia estabilizada. Sin ascitis ni edemas periféricos.',        48),
(1900,  '38.3°C', '128 lpm', '30 rpm', 'Buena',    'Cachorro activo. Desparasitación sin incidentes. Peso normal.',   49),
(6300,  '38.3°C', '113 lpm', '24 rpm', 'Buena',    'Perfil preanestésico completo. Todos los parámetros en rango.',   50);

-- Tabla: HistorialClinicoDiagnostico
INSERT INTO historial_clinico_diagnostico (id_historial_clinico, id_diagnostico) VALUES
(1,  7),   -- Rex:    Parasitosis
(2,  7),   -- Luna:   Parasitosis (control post-qx)
(3,  5),   -- Milo:   Gastroenteritis
(3,  13),  -- Milo:   Deshidratación (comórbido)
(4,  4),   -- Cleo:   Dermatitis Alérgica
(5,  4),   -- Max:    Dermatitis Alérgica (artritis)
(6,  8),   -- Nala:   Traumatismo (mordedura)
(7,  7),   -- Rocky:  Parasitosis
(8,  10),  -- Lola:   Gingivitis/Periodontitis
(9,  7),   -- Bruno:  Parasitosis
(10, 7),   -- Bella:  Parasitosis
(11, 6),   -- Simba:  Enfermedad Respiratoria
(12, 7),   -- Mia:    Parasitosis
(13, 6),   -- Oliver: Enfermedad Respiratoria
(14, 4),   -- Nube:   Dermatitis Alérgica
(15, 7),   -- Leo:    Parasitosis
(16, 7),   -- Rex:    Parasitosis
(17, 7),   -- Luna:   Parasitosis
(18, 5),   -- Milo:   Gastroenteritis
(18, 13),  -- Milo:   Deshidratación (comórbido)
(19, 7),   -- Cleo:   Parasitosis
(20, 8),   -- Max:    Traumatismo (columna)
(21, 7),   -- Max:    Parasitosis (extracción laboratorio)
(22, 4),   -- Nala:   Dermatitis Alérgica
(23, 7),   -- Rocky:  Parasitosis
(24, 10),  -- Lola:   Gingivitis/Periodontitis
(25, 7),   -- Bruno:  Parasitosis
(26, 7),   -- Bella:  Parasitosis
(27, 3),   -- Simba:  Otitis
(28, 7),   -- Mia:    Parasitosis
(29, 6),   -- Oliver: Enfermedad Respiratoria
(30, 4),   -- Nube:   Dermatitis Alérgica
(31, 7),   -- Leo:    Parasitosis
(32, 7),   -- Kitty:  Parasitosis
(33, 3),   -- Buddy:  Enfermedad Cardíaca
(34, 5),   -- Coco:   Gastroenteritis
(35, 7),   -- Thor:   Parasitosis
(36, 6),   -- Oliver: Enfermedad Respiratoria
(37, 4),   -- Isis:   Dermatitis Alérgica
(38, 10),  -- Lola:   Gingivitis/Periodontitis
(39, 3),   -- Buddy:  Enfermedad Cardíaca
(40, 8),   -- Rocky:  Traumatismo (ocular)
(41, 7),   -- Bruno:  Parasitosis
(42, 7),   -- Lola:   Parasitosis
(43, 7),   -- Coco:   Parasitosis
(44, 9),   -- Kitty:  Infección Urinaria
(45, 3),   -- Simba:  Otitis
(46, 8),   -- Max:    Traumatismo (neurológico - convulsión)
(47, 9),   -- Kitty:  Infección Urinaria
(48, 3),   -- Buddy:  Enfermedad Cardíaca
(49, 7),   -- Coco:   Parasitosis
(50, 7);   -- Thor:   Parasitosis

-- ============================================================================
-- Fin del script de datos de prueba
-- ============================================================================
