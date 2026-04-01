-- ============================================================================
-- Datos de Prueba ADICIONALES - Modulo Stock y Venta
-- Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- Generado: 2026-03-01
-- Prerequisito: ejecutar 05_test_data_stock_venta.sql antes que este script.
--   Productos ids existentes: 1-50  | Nuevos: 51-100
--   Servicios ids existentes: 1-15  | Nuevos: 16-30
--   Ventas ids existentes:    1-100 | Nuevas: 101-250
--     Completadas: 101-150 (+50) | Pendientes: 151-200 (+50) | Canceladas: 201-250 (+50)
-- ============================================================================

-- ============================================================================
-- Modulo: Stock - Producto adicional (50 registros | ids 51-100)
-- ============================================================================

INSERT INTO producto (id, nombre, descripcion, codigo, codigo_interno, precio_venta, precio_costo, stock_actual, stock_minimo, id_categoria, activo) VALUES
-- Medicamentos adicionales (ids 51-65)
(51,  'Vitamina B Complex Inyectable 30ml',        'Complejo vitamínico B1-B6-B12 para uso parenteral veterinario',           'VIT-BC-30',  'MED-016', 1800.00,  900.00,  45, 12, 1, true),
(52,  'Suplemento Calcio-Fósforo 100ml',           'Suplemento mineral líquido para huesos y dientes',                        'CAL-FO-100', 'MED-017', 2200.00, 1100.00,  35, 10, 1, true),
(53,  'Lactulosa Solución Oral 200ml',             'Laxante osmótico para estreñimiento crónico en perros y gatos',           'LAC-SO-200', 'MED-018', 1600.00,  800.00,  40, 10, 1, true),
(54,  'Enrofloxacina 50mg x20 comp.',              'Antibiótico fluoroquinolónico de alta penetración tisular',               'ENX-50-20',  'MED-019', 1900.00,  950.00,  50, 12, 1, true),
(55,  'Clindamicina 150mg x16 comp.',              'Antibiótico lincosamida eficaz en infecciones óseas y dentales',          'CLD-150-16', 'MED-020', 2100.00, 1050.00,  35, 10, 1, true),
(56,  'Espiramicina + Metronidazol x20 comp.',     'Combinación antibiótica para infecciones orales y periodontales',         'ESP-MTZ-20', 'MED-021', 1700.00,  850.00,  40, 10, 1, true),
(57,  'Suero Fisiológico 0.9% 500ml',              'Solución isotónica para irrigación y lavados clínicos',                   'SFI-09-500', 'MED-022', 1200.00,  600.00,  60, 20, 1, true),
(58,  'Vitamina C Inyectable 100mg/ml 10ml',       'Vitamina C parenteral para déficits y soporte inmunológico',              'VIT-C-10',   'MED-023', 1500.00,  750.00,  45, 12, 1, true),
(59,  'Meloxicam Solución Oral 1.5mg/ml 100ml',    'AINE de alta selectividad COX-2 para dolor e inflamación',               'MEL-SO-100', 'MED-024', 1800.00,  900.00,  40, 10, 1, true),
(60,  'Ketoprofeno 100mg Inyectable 10ml',         'AINE parenteral para dolor agudo postoperatorio',                         'KTO-IN-10',  'MED-025', 2000.00, 1000.00,  30,  8, 1, true),
(61,  'Butorfanol 10mg Inyectable 10ml',           'Analgésico opioide agonista-antagonista para dolor moderado-severo',     'BUT-IN-10',  'MED-026', 2500.00, 1250.00,  20,  6, 1, true),
(62,  'Acepromazina 10mg Inyectable 10ml',         'Tranquilizante fenotiacínico para premedicación y sedación',              'ACE-IN-10',  'MED-027', 1400.00,  700.00,  25,  8, 1, true),
(63,  'Atropina 0.25mg Inyectable 10ml',           'Anticolinérgico para bradicardia y premedicación anestésica',             'ATR-IN-10',  'MED-028', 1500.00,  750.00,  30,  8, 1, true),
(64,  'Doxiciclina 100mg x14 comp.',               'Antibiótico tetraciclínico de amplio espectro incluyendo Ehrlichia',     'DOX-100-14', 'MED-029', 1650.00,  825.00,  40, 10, 1, true),
(65,  'Fenobarbital 100mg x30 comp.',              'Antiepiléptico de primera línea para manejo de convulsiones caninas',     'FNB-100-30', 'MED-030', 1950.00,  975.00,  30,  8, 1, true),
-- Alimentos adicionales (ids 66-78)
(66,  'Hills Prescription Diet k/d Canino 3.6kg',  'Dieta renal para perros con insuficiencia renal crónica',                'HP-KD-36',   'ALI-014', 8500.00, 5500.00,  18,  5, 2, true),
(67,  'Royal Canin Urinary SO Canino 3.5kg',       'Alimento urinario para prevención de cálculos en perros',                'RC-US-35',   'ALI-015', 6500.00, 4200.00,  20,  6, 2, true),
(68,  'Pro Plan Sensitive Skin Canino 7.5kg',       'Alimento para perros con piel sensible y problemas digestivos',           'PP-SS-75',   'ALI-016', 9500.00, 6200.00,  15,  5, 2, true),
(69,  'Pedigree Adulto Razas Pequeñas 8kg',        'Alimento completo para perros adultos de razas pequeñas y toy',           'PD-RP-8K',   'ALI-017', 7500.00, 5000.00,  12,  4, 2, true),
(70,  'Whiskas Adulto Vacuno Seco 1.5kg',          'Alimento seco con vacuno y cereales para gatos adultos',                  'WH-AV-15',   'ALI-018', 2800.00, 1800.00,  35, 10, 2, true),
(71,  'Fancy Feast Gravy Colección x12 latas',     'Surtido de sabores en salsa para gatos, presentación económica',          'FF-GR-12',   'ALI-019', 8500.00, 5500.00,  20,  6, 2, true),
(72,  'Hills Science Diet Kitten 1.6kg',           'Nutrición clínica completa para gatitos de 0 a 12 meses',                'HS-KI-16',   'ALI-020', 5800.00, 3800.00,  22,  7, 2, true),
(73,  'Royal Canin Mother & Babycat 2kg',          'Alimento para gatas gestantes, en lactancia y gatitos hasta 4 meses',    'RC-MB-2K',   'ALI-021', 4500.00, 2900.00,  18,  6, 2, true),
(74,  'Pro Plan Puppy Small Breed 7.5kg',          'Alimento para cachorros de razas pequeñas con DHA y probióticos',        'PP-PS-75',   'ALI-022',10500.00, 7000.00,  10,  3, 2, true),
(75,  'Natural Balance LID Salmon 5lb',            'Dieta de ingrediente limitado con salmón para perros alérgicos',          'NB-LS-5L',   'ALI-023', 7200.00, 4800.00,  12,  4, 2, true),
(76,  'Acana Regionals Pacifica 2kg',              'Alimento premium grain-free con pescados frescos del Pacífico',           'AC-PA-2K',   'ALI-024', 3800.00, 2500.00,  20,  6, 2, true),
(77,  'Orijen Cat & Kitten 1.8kg',                'Alimento biológicamente apropiado con 85% de ingredientes animales',      'OR-CK-18',   'ALI-025', 4800.00, 3200.00,  15,  5, 2, true),
(78,  'Taste of the Wild High Prairie Canino 2kg', 'Alimento con búfalo y bisonte asado, grain-free para perros',             'TW-HP-2K',   'ALI-026', 2500.00, 1600.00,  25,  8, 2, true),
-- Accesorios adicionales (ids 79-90)
(79,  'Bebedero Portátil de Viaje 350ml',          'Bebedero plegable con depósito integrado para paseos y viajes',           'BE-PO-350',  'ACC-013', 1200.00,  600.00,  30, 10, 3, true),
(80,  'Mochila Transportín para Gatos Talla M',    'Mochila con ventana acrílica y ventilación lateral para gatos',           'MO-TR-M',    'ACC-014', 7800.00, 4200.00,  10,  3, 3, true),
(81,  'Juguete Interactivo Láser Automático',      'Puntero láser con rotación aleatoria y temporizador automático',          'JU-LA-AU',   'ACC-015', 1800.00,  900.00,  20,  6, 3, true),
(82,  'Cama Ortopédica Memory Foam Talla L',       'Colchón viscoelástico para perros con artritis o displasia',              'CA-OR-L',    'ACC-016', 6500.00, 3500.00,  10,  3, 3, true),
(83,  'Bravecto Masticable Perros 10-20kg',        'Antiparasitario sistémico de acción prolongada 3 meses, uso oral',        'BR-MA-M',    'ACC-017', 5500.00, 3000.00,  25,  8, 3, true),
(84,  'Pechera Reflectante Talla M',               'Pechera con banda reflectiva 360° para visibilidad nocturna',             'PE-RF-M',    'ACC-018', 2200.00, 1100.00,  22,  7, 3, true),
(85,  'Snood Calentador de Orejas Talla S',        'Accesorio tejido para proteger orejas largas del frío y suciedad',       'SN-CA-S',    'ACC-019',  800.00,  400.00,  18,  6, 3, true),
(86,  'Comedero Elevado Doble Inoxidable',         'Soporte de madera con doble cuenco inox ajustable en altura',             'CM-EL-DI',   'ACC-020', 3500.00, 1800.00,  15,  5, 3, true),
(87,  'Pelota de Goma con Chillador Talla M',      'Pelota resistente de goma natural con sonido para estímulo canino',       'PE-GO-M',    'ACC-021',  900.00,  450.00,  40, 12, 3, true),
(88,  'Rastreador GPS Collar para Mascotas',       'Localizador GPS con app y zona de seguridad configurable',                'RA-GP-CO',   'ACC-022', 7500.00, 4000.00,  10,  3, 3, true),
(89,  'Porta Bolsas + Bolsas Biodeg x50u',         'Dispensador de correa con 50 bolsas biodegradables con aroma',            'PO-BO-50',   'ACC-023',  950.00,  480.00,  50, 15, 3, true),
(90,  'Malla Protectora Balcón 6m² Negra',         'Red de seguridad anti-caída para gatos en balcones y ventanas',           'MA-PR-6M',   'ACC-024', 4200.00, 2200.00,  12,  4, 3, true),
-- Higiene adicional (ids 91-100)
(91,  'Colonia Perfumada para Mascotas 150ml',     'Fragancia suave con aloe vera de larga duración para pelaje',             'CO-PE-150',  'HIG-011', 1500.00,  750.00,  35, 10, 4, true),
(92,  'Esponja de Baño Exfoliante Canina',         'Esponja de silicona con textura exfoliante para masaje en baño',          'ES-BA-EX',   'HIG-012',  600.00,  300.00,  50, 15, 4, true),
(93,  'Limpiador de Oídos Veterinario 100ml',      'Solución ceruminolítica y antimicrobiana para higiene auricular',         'LI-OI-100',  'HIG-013', 1800.00,  900.00,  40, 12, 4, true),
(94,  'Spray Desenredante Sin Enjuague 200ml',     'Acondicionador en spray para desenredar sin agua, apto para cachorros',  'SP-DE-200',  'HIG-014', 1400.00,  700.00,  38, 12, 4, true),
(95,  'Guante de Goma para Baño Talla M',          'Guante masajeador con pinchos de silicona para distribución del champú', 'GU-BA-M',    'HIG-015',  700.00,  350.00,  45, 15, 4, true),
(96,  'Piedra Sanitaria Lavanda x2u',              'Doble piedra sanitaria con lavanda para arena felina y corrales',         'PI-SA-LA',   'HIG-016', 1200.00,  600.00,  55, 18, 4, true),
(97,  'Peine de Acero Antiestático 18cm',          'Peine profesional de doble fila para eliminar nudos y pelo suelto',       'PI-AC-18',   'HIG-017', 1200.00,  600.00,  30, 10, 4, true),
(98,  'Secador Silencioso para Mascotas 1400W',    'Secador de bajo ruido con protector térmico y 3 velocidades',             'SE-SI-14',   'HIG-018', 4500.00, 2300.00,  12,  4, 4, true),
(99,  'Set Manicura Canina 5 piezas',              'Juego de tijeras, cortauñas, lima, cepillo y peine de acero inox',       'SE-MA-5P',   'HIG-019', 2800.00, 1400.00,  18,  5, 4, true),
(100, 'Aceite de Coco Pelaje y Piel 100ml',        'Aceite virgen extra de coco para hidratación de pelo y piel canina',      'AC-CO-100',  'HIG-020', 1600.00,  800.00,  28,  8, 4, true);

SELECT setval('producto_id_seq', 100);

-- ============================================================================
-- Modulo: Stock - Servicio adicional (15 registros | ids 16-30)
-- ============================================================================

INSERT INTO servicio (id, nombre, descripcion, codigo_interno, precio, duracion_minutos, activo) VALUES
(16, 'Control Post-Operatorio',          'Revisión clínica de herida quirúrgica, retiro de puntos y alta',       'SRV-016', 2500.00,  20, true),
(17, 'Internación Diaria',               'Hospitalización con monitoreo, medicación y cuidados básicos incluidos','SRV-017', 3500.00, 480, true),
(18, 'Sutura y Curación de Heridas',     'Limpieza, desbridamiento y sutura de heridas bajo sedación local',     'SRV-018', 4500.00,  40, true),
(19, 'Extracción Dental Simple',         'Extracción de pieza dental con alveoloplastia bajo anestesia local',   'SRV-019', 5500.00,  30, true),
(20, 'Aplicación de Medicación Inyect.','Administración IM o SC de medicamento provisto por el propietario',    'SRV-020', 1500.00,  10, true),
(21, 'Nebulización Terapéutica',         'Sesión de aerosolterapia para afecciones respiratorias',               'SRV-021', 2000.00,  20, true),
(22, 'Fisioterapia y Rehabilitación',    'Sesión de kinesiología veterinaria con hidroterapia o electroterapia', 'SRV-022', 3000.00,  45, true),
(23, 'Implante de Microchip',            'Colocación subcutánea de transponder ISO 11784/11785 con registro',   'SRV-023', 3500.00,  15, true),
(24, 'Extracción de Cuerpo Extraño',     'Remoción endoscópica o manual de cuerpo extraño no quirúrgica',       'SRV-024', 7500.00,  60, true),
(25, 'Sondaje Vesical',                  'Cateterismo uretral diagnóstico o terapéutico bajo sedación',          'SRV-025', 4000.00,  30, true),
(26, 'Punción y Análisis de Líquido',    'Toracocentesis o abdominocentesis con análisis citológico del líquido','SRV-026', 6000.00,  30, true),
(27, 'Electrocardiograma (ECG)',          'Registro electrocardiográfico de 12 derivaciones con informe',         'SRV-027', 4500.00,  20, true),
(28, 'Interconsulta con Especialista',   'Consulta derivada a especialista externo con resumen clínico incluido','SRV-028', 5000.00,  30, true),
(29, 'Plan Nutricional Personalizado',   'Evaluación corporal y diseño de dieta específica con seguimiento',     'SRV-029', 3000.00,  30, true),
(30, 'Taller de Adiestramiento Básico', 'Sesión grupal de obediencia básica: sentado, quieto, llamada',         'SRV-030', 2500.00,  60, true);

SELECT setval('servicio_id_seq', 30);

-- ============================================================================
-- Modulo: Stock - Movimiento Stock adicional (+20 registros)
-- ============================================================================

INSERT INTO movimiento_stock (fecha, cantidad, observaciones, id_producto, id_movimiento_tipo, id_empleado) VALUES
-- OC-012: Compra medicamentos nuevos (tipo 1)
('2026-01-02 09:00:00-03',  60, 'OC-012. Proveedor: FarmVet SA. Lote: LT-260102-K.',         51, 1, 5),
('2026-01-02 09:00:00-03',  50, 'OC-012. Proveedor: FarmVet SA. Lote: LT-260102-K.',         52, 1, 5),
('2026-01-02 09:00:00-03',  55, 'OC-012. Proveedor: FarmVet SA. Lote: LT-260102-K.',         53, 1, 5),
('2026-01-02 09:00:00-03',  65, 'OC-012. Proveedor: FarmVet SA. Lote: LT-260102-K.',         54, 1, 5),
('2026-01-02 09:00:00-03',  50, 'OC-012. Proveedor: FarmVet SA. Lote: LT-260102-K.',         55, 1, 5),
-- OC-013: Compra alimentos premium nuevos (tipo 1)
('2026-01-04 09:30:00-03',  25, 'OC-013. Proveedor: AlimMascota SRL. Lote: LT-260104-L.',    66, 1, 5),
('2026-01-04 09:30:00-03',  28, 'OC-013. Proveedor: AlimMascota SRL. Lote: LT-260104-L.',    67, 1, 5),
('2026-01-04 09:30:00-03',  22, 'OC-013. Proveedor: AlimMascota SRL. Lote: LT-260104-L.',    68, 1, 5),
('2026-01-04 09:30:00-03',  18, 'OC-013. Proveedor: AlimMascota SRL. Lote: LT-260104-L.',    74, 1, 5),
('2026-01-04 09:30:00-03',  20, 'OC-013. Proveedor: AlimMascota SRL. Lote: LT-260104-L.',    77, 1, 5),
-- OC-014: Compra accesorios e higiene nuevos (tipo 1)
('2026-01-06 10:00:00-03',  15, 'OC-014. Proveedor: AccMascotas SA. Lote: LT-260106-M.',     80, 1, 5),
('2026-01-06 10:00:00-03',  28, 'OC-014. Proveedor: AccMascotas SA. Lote: LT-260106-M.',     83, 1, 5),
('2026-01-06 10:00:00-03',  16, 'OC-014. Proveedor: AccMascotas SA. Lote: LT-260106-M.',     88, 1, 5),
('2026-01-06 10:00:00-03',  18, 'OC-014. Proveedor: HigieneMascotas SRL. Lote: LT-260106-M.',98, 1, 5),
('2026-01-06 10:00:00-03',  25, 'OC-014. Proveedor: HigieneMascotas SRL. Lote: LT-260106-M.',99, 1, 5),
-- Ajustes Positivos (tipo 3)
('2026-01-14 11:00:00-03',   3, 'Ajuste +. Unidades halladas en depósito sin remito.',        57, 3, 5),
('2026-02-03 10:30:00-03',   2, 'Ajuste +. Recuento quincenal. Diferencia positiva.',         91, 3, 5),
-- Ajuste Negativo (tipo 4)
('2026-01-20 16:00:00-03',   2, 'Ajuste -. Producto dañado en transporte. Acta de baja.',     80, 4, 5),
-- Devoluciones de Cliente (tipo 5)
('2026-01-25 10:00:00-03',   1, 'Dev. cliente. Talla incorrecta. Cambio por talla L.',        84, 5, 4),
('2026-02-10 11:30:00-03',   1, 'Dev. cliente. Producto sin abrir. Dentro de plazo.',         93, 5, 4);

-- ============================================================================
-- Modulo: Venta - 150 Ventas adicionales (ids 101-250)
--   101-150: Completadas | 151-200: Pendientes | 201-250: Canceladas
-- ============================================================================

INSERT INTO venta (id, fecha, subtotal, monto_ajuste_redondeo, total_final, id_cliente, id_empleado, id_estado) VALUES
-- *** VENTAS COMPLETADAS (101-150) ***
(101, '2026-01-03 09:30:00-03',  5300.00, 0.00,  5300.00,  7,  4, 2),
(102, '2026-01-03 10:15:00-03',  8500.00, 0.00,  8500.00,  8,  4, 2),
(103, '2026-01-04 09:00:00-03',  5500.00, 0.00,  5500.00,  9,  4, 2),
(104, '2026-01-04 10:30:00-03',  6500.00, 0.00,  6500.00, 10,  4, 2),
(105, '2026-01-05 09:15:00-03', 10900.00, 0.00, 10900.00, 11,  4, 2),
(106, '2026-01-05 11:00:00-03',  5500.00, 0.00,  5500.00, 12,  4, 2),
(107, '2026-01-06 09:45:00-03',  4000.00, 0.00,  4000.00, 13,  4, 2),
(108, '2026-01-06 10:30:00-03',  6000.00, 0.00,  6000.00, 14,  4, 2),
(109, '2026-01-07 09:00:00-03',  3800.00, 0.00,  3800.00, 15,  4, 2),
(110, '2026-01-07 11:15:00-03',  4500.00, 0.00,  4500.00, 16,  4, 2),
(111, '2026-01-08 09:30:00-03',  5500.00, 0.00,  5500.00, 17,  4, 2),
(112, '2026-01-08 10:45:00-03',  4000.00, 0.00,  4000.00, 18,  4, 2),
(113, '2026-01-09 09:00:00-03',  2100.00, 0.00,  2100.00, 19,  4, 2),
(114, '2026-01-09 11:00:00-03',  4500.00, 0.00,  4500.00, 20,  4, 2),
(115, '2026-01-10 09:30:00-03', 10500.00, 0.00, 10500.00, 21,  4, 2),
(116, '2026-01-10 10:45:00-03',  3300.00, 0.00,  3300.00, 22,  4, 2),
(117, '2026-01-11 09:00:00-03',  7000.00, 0.00,  7000.00, 23,  4, 2),
(118, '2026-01-11 11:15:00-03',  3000.00, 0.00,  3000.00, 24,  4, 2),
(119, '2026-01-12 09:45:00-03',  2500.00, 0.00,  2500.00, 25,  4, 2),
(120, '2026-01-12 10:30:00-03',  6600.00, 0.00,  6600.00, 26,  4, 2),
(121, '2026-01-13 09:15:00-03',  9500.00, 0.00,  9500.00, 27,  4, 2),
(122, '2026-01-13 11:00:00-03',  4000.00, 0.00,  4000.00, 28,  4, 2),
(123, '2026-01-14 09:30:00-03',  7500.00, 0.00,  7500.00, 29,  4, 2),
(124, '2026-01-14 10:00:00-03',  6000.00, 0.00,  6000.00, 30,  4, 2),
(125, '2026-01-15 09:45:00-03',  2700.00, 0.00,  2700.00, 31,  4, 2),
(126, '2026-01-15 11:15:00-03',  7800.00, 0.00,  7800.00, 32,  4, 2),
(127, '2026-01-16 09:00:00-03',  6500.00, 0.00,  6500.00, 33,  4, 2),
(128, '2026-01-16 10:30:00-03', 22000.00, 0.00, 22000.00, 34,  4, 2),
(129, '2026-01-17 09:15:00-03',  1800.00, 0.00,  1800.00, 35,  4, 2),
(130, '2026-01-17 11:00:00-03',  7500.00, 0.00,  7500.00, 36,  4, 2),
(131, '2026-01-18 09:30:00-03',  4500.00, 0.00,  4500.00, 37,  4, 2),
(132, '2026-01-18 10:45:00-03', 10500.00, 0.00, 10500.00, 38,  2, 2),
(133, '2026-01-19 09:00:00-03',  7500.00, 0.00,  7500.00, 39,  4, 2),
(134, '2026-01-19 11:15:00-03',  4000.00, 0.00,  4000.00, 40,  4, 2),
(135, '2026-01-20 09:45:00-03',  7800.00, 0.00,  7800.00, 41,  4, 2),
(136, '2026-01-20 10:30:00-03',  5100.00, 0.00,  5100.00, 42,  4, 2),
(137, '2026-01-21 09:00:00-03', 10500.00, 0.00, 10500.00, 43,  4, 2),
(138, '2026-01-21 11:00:00-03',  2500.00, 0.00,  2500.00, 44,  4, 2),
(139, '2026-01-22 09:30:00-03',  8500.00, 0.00,  8500.00, 45,  4, 2),
(140, '2026-01-22 10:45:00-03', 11500.00, 0.00, 11500.00, 46,  2, 2),
(141, '2026-01-23 09:15:00-03',  4000.00, 0.00,  4000.00, 47,  4, 2),
(142, '2026-01-23 11:00:00-03', 12000.00, 0.00, 12000.00, 48,  4, 2),
(143, '2026-01-24 09:45:00-03',  2800.00, 0.00,  2800.00, 49,  4, 2),
(144, '2026-01-24 10:30:00-03', 10500.00, 0.00, 10500.00, 50,  4, 2),
(145, '2026-01-25 09:00:00-03',  7200.00, 0.00,  7200.00, 51,  4, 2),
(146, '2026-01-25 11:15:00-03',  3300.00, 0.00,  3300.00,  7,  4, 2),
(147, '2026-01-26 09:30:00-03',  5800.00, 0.00,  5800.00,  8,  4, 2),
(148, '2026-01-26 10:45:00-03',  4900.00, 0.00,  4900.00,  9,  4, 2),
(149, '2026-01-27 09:00:00-03',  4200.00, 0.00,  4200.00, 10,  4, 2),
(150, '2026-01-27 11:00:00-03',  6300.00, 0.00,  6300.00, 11,  4, 2),
-- *** VENTAS PENDIENTES (151-200) | id_estado=1 ***
(151, '2026-02-01 09:30:00-03', 18000.00, 0.00, 18000.00, 12,  4, 1),
(152, '2026-02-01 10:15:00-03',  8500.00, 0.00,  8500.00, 13,  4, 1),
(153, '2026-02-01 11:30:00-03',  6500.00, 0.00,  6500.00, 14,  4, 1),
(154, '2026-02-02 09:00:00-03', 10800.00, 0.00, 10800.00, 15,  4, 1),
(155, '2026-02-02 10:30:00-03',  3500.00, 0.00,  3500.00, 16,  4, 1),
(156, '2026-02-02 11:45:00-03',  5500.00, 0.00,  5500.00, 17,  4, 1),
(157, '2026-02-03 09:15:00-03', 22000.00, 0.00, 22000.00, 18,  4, 1),
(158, '2026-02-03 10:00:00-03',  9500.00, 0.00,  9500.00, 19,  4, 1),
(159, '2026-02-03 11:30:00-03',  7000.00, 0.00,  7000.00, 20,  4, 1),
(160, '2026-02-04 09:45:00-03',  6500.00, 0.00,  6500.00, 21,  4, 1),
(161, '2026-02-04 10:30:00-03',  8500.00, 0.00,  8500.00, 22,  4, 1),
(162, '2026-02-04 11:15:00-03',  7500.00, 0.00,  7500.00, 23,  4, 1),
(163, '2026-02-05 09:00:00-03', 15000.00, 0.00, 15000.00, 24,  4, 1),
(164, '2026-02-05 10:30:00-03', 10500.00, 0.00, 10500.00, 25,  4, 1),
(165, '2026-02-05 11:45:00-03',  7300.00, 0.00,  7300.00, 26,  4, 1),
(166, '2026-02-06 09:15:00-03',  7500.00, 0.00,  7500.00, 27,  4, 1),
(167, '2026-02-06 10:00:00-03',  4500.00, 0.00,  4500.00, 28,  4, 1),
(168, '2026-02-06 11:30:00-03',  7800.00, 0.00,  7800.00, 29,  4, 1),
(169, '2026-02-07 09:30:00-03',  5000.00, 0.00,  5000.00, 30,  4, 1),
(170, '2026-02-07 10:15:00-03',  8500.00, 0.00,  8500.00, 31,  4, 1),
(171, '2026-02-07 11:00:00-03',  9000.00, 0.00,  9000.00, 32,  4, 1),
(172, '2026-02-08 09:45:00-03',  7600.00, 0.00,  7600.00, 33,  4, 1),
(173, '2026-02-08 10:30:00-03',  5500.00, 0.00,  5500.00, 34,  4, 1),
(174, '2026-02-08 11:15:00-03',  7000.00, 0.00,  7000.00, 35,  4, 1),
(175, '2026-02-09 09:00:00-03', 12000.00, 0.00, 12000.00, 36,  4, 1),
(176, '2026-02-09 10:30:00-03',  7200.00, 0.00,  7200.00, 37,  4, 1),
(177, '2026-02-09 11:45:00-03',  7000.00, 0.00,  7000.00, 38,  4, 1),
(178, '2026-02-10 09:15:00-03',  4500.00, 0.00,  4500.00, 39,  4, 1),
(179, '2026-02-10 10:00:00-03',  7500.00, 0.00,  7500.00, 40,  4, 1),
(180, '2026-02-10 11:30:00-03',  4300.00, 0.00,  4300.00, 41,  4, 1),
(181, '2026-02-11 09:30:00-03', 18000.00, 0.00, 18000.00, 42,  4, 1),
(182, '2026-02-11 10:45:00-03',  5800.00, 0.00,  5800.00, 43,  4, 1),
(183, '2026-02-11 11:15:00-03',  7800.00, 0.00,  7800.00, 44,  4, 1),
(184, '2026-02-12 09:00:00-03',  3600.00, 0.00,  3600.00, 45,  4, 1),
(185, '2026-02-12 10:30:00-03',  4000.00, 0.00,  4000.00, 46,  4, 1),
(186, '2026-02-12 11:45:00-03',  4200.00, 0.00,  4200.00, 47,  4, 1),
(187, '2026-02-13 09:15:00-03',  6700.00, 0.00,  6700.00, 48,  4, 1),
(188, '2026-02-13 10:00:00-03',  5600.00, 0.00,  5600.00, 49,  4, 1),
(189, '2026-02-13 11:30:00-03',  4000.00, 0.00,  4000.00, 50,  4, 1),
(190, '2026-02-14 09:45:00-03',  5500.00, 0.00,  5500.00, 51,  4, 1),
(191, '2026-02-14 10:30:00-03',  5300.00, 0.00,  5300.00,  7,  4, 1),
(192, '2026-02-15 09:00:00-03',  6500.00, 0.00,  6500.00,  8,  4, 1),
(193, '2026-02-15 11:00:00-03',  5000.00, 0.00,  5000.00,  9,  4, 1),
(194, '2026-02-16 09:30:00-03',  2150.00, 0.00,  2150.00, 10,  4, 1),
(195, '2026-02-16 10:15:00-03',  2500.00, 0.00,  2500.00, 11,  4, 1),
(196, '2026-02-17 09:45:00-03',  4100.00, 0.00,  4100.00, 12,  4, 1),
(197, '2026-02-17 11:00:00-03',  6000.00, 0.00,  6000.00, 13,  4, 1),
(198, '2026-02-18 09:00:00-03', 10500.00, 0.00, 10500.00, 14,  4, 1),
(199, '2026-02-18 10:30:00-03',  9000.00, 0.00,  9000.00, 15,  4, 1),
(200, '2026-02-19 09:15:00-03',  9500.00, 0.00,  9500.00, 16,  4, 1),
-- *** VENTAS CANCELADAS (201-250) | id_estado=3 ***
(201, '2026-01-05 09:30:00-03',  3500.00, 0.00,  3500.00, 17,  4, 3),
(202, '2026-01-06 10:15:00-03',  1800.00, 0.00,  1800.00, 18,  4, 3),
(203, '2026-01-07 09:00:00-03', 18000.00, 0.00, 18000.00, 19,  4, 3),
(204, '2026-01-08 11:00:00-03',  4500.00, 0.00,  4500.00, 20,  4, 3),
(205, '2026-01-09 09:30:00-03',  4500.00, 0.00,  4500.00, 21,  4, 3),
(206, '2026-01-10 10:45:00-03',  5500.00, 0.00,  5500.00, 22,  4, 3),
(207, '2026-01-11 09:00:00-03',  8500.00, 0.00,  8500.00, 23,  4, 3),
(208, '2026-01-12 11:15:00-03',  7500.00, 0.00,  7500.00, 24,  4, 3),
(209, '2026-01-13 09:45:00-03',  2000.00, 0.00,  2000.00, 25,  4, 3),
(210, '2026-01-14 10:30:00-03',  6500.00, 0.00,  6500.00, 26,  4, 3),
(211, '2026-01-15 09:00:00-03', 22000.00, 0.00, 22000.00, 27,  4, 3),
(212, '2026-01-16 11:00:00-03',  6500.00, 0.00,  6500.00, 28,  4, 3),
(213, '2026-01-17 09:30:00-03',  9000.00, 0.00,  9000.00, 29,  4, 3),
(214, '2026-01-18 10:15:00-03', 10500.00, 0.00, 10500.00, 30,  4, 3),
(215, '2026-01-19 09:00:00-03',  1500.00, 0.00,  1500.00, 31,  4, 3),
(216, '2026-01-20 11:30:00-03',  5600.00, 0.00,  5600.00, 32,  4, 3),
(217, '2026-01-21 09:45:00-03',  3500.00, 0.00,  3500.00, 33,  4, 3),
(218, '2026-01-22 10:00:00-03',  3900.00, 0.00,  3900.00, 34,  4, 3),
(219, '2026-01-23 09:15:00-03', 12000.00, 0.00, 12000.00, 35,  4, 3),
(220, '2026-01-24 11:00:00-03',  7800.00, 0.00,  7800.00, 36,  4, 3),
(221, '2026-01-25 09:30:00-03',  5000.00, 0.00,  5000.00, 37,  4, 3),
(222, '2026-01-26 10:45:00-03',  4500.00, 0.00,  4500.00, 38,  4, 3),
(223, '2026-01-27 09:00:00-03',  3000.00, 0.00,  3000.00, 39,  4, 3),
(224, '2026-01-28 11:15:00-03',  4500.00, 0.00,  4500.00, 40,  4, 3),
(225, '2026-01-29 09:45:00-03',  5500.00, 0.00,  5500.00, 41,  4, 3),
(226, '2026-01-30 10:30:00-03',  9500.00, 0.00,  9500.00, 42,  4, 3),
(227, '2026-01-31 09:00:00-03',  5500.00, 0.00,  5500.00, 43,  4, 3),
(228, '2026-02-01 11:00:00-03',  8500.00, 0.00,  8500.00, 44,  4, 3),
(229, '2026-02-02 09:30:00-03',  3500.00, 0.00,  3500.00, 45,  4, 3),
(230, '2026-02-03 10:45:00-03',  5500.00, 0.00,  5500.00, 46,  4, 3),
(231, '2026-02-04 09:00:00-03',  7500.00, 0.00,  7500.00, 47,  4, 3),
(232, '2026-02-05 11:15:00-03',  6500.00, 0.00,  6500.00, 48,  4, 3),
(233, '2026-02-06 09:45:00-03',  3500.00, 0.00,  3500.00, 49,  4, 3),
(234, '2026-02-07 10:30:00-03',  8500.00, 0.00,  8500.00, 50,  4, 3),
(235, '2026-02-08 09:00:00-03',  4500.00, 0.00,  4500.00, 51,  4, 3),
(236, '2026-02-09 11:00:00-03',  4200.00, 0.00,  4200.00,  7,  4, 3),
(237, '2026-02-10 09:30:00-03',  4500.00, 0.00,  4500.00,  8,  4, 3),
(238, '2026-02-11 10:15:00-03',  2100.00, 0.00,  2100.00,  9,  4, 3),
(239, '2026-02-12 09:00:00-03',  3500.00, 0.00,  3500.00, 10,  4, 3),
(240, '2026-02-13 11:30:00-03', 18000.00, 0.00, 18000.00, 11,  4, 3),
(241, '2026-02-14 09:45:00-03', 15000.00, 0.00, 15000.00, 12,  4, 3),
(242, '2026-02-15 10:30:00-03',  5800.00, 0.00,  5800.00, 13,  4, 3),
(243, '2026-02-16 09:00:00-03',  3000.00, 0.00,  3000.00, 14,  4, 3),
(244, '2026-02-17 11:00:00-03',  2800.00, 0.00,  2800.00, 15,  4, 3),
(245, '2026-02-18 09:30:00-03', 18000.00, 0.00, 18000.00, 16,  4, 3),
(246, '2026-02-19 10:15:00-03',  3800.00, 0.00,  3800.00, 17,  4, 3),
(247, '2026-02-20 09:00:00-03',  2000.00, 0.00,  2000.00, 18,  4, 3),
(248, '2026-02-21 11:15:00-03',  1800.00, 0.00,  1800.00, 19,  4, 3),
(249, '2026-02-22 09:45:00-03',  4000.00, 0.00,  4000.00, 20,  4, 3),
(250, '2026-02-23 10:30:00-03',  4800.00, 0.00,  4800.00, 21,  4, 3);

SELECT setval('venta_id_seq', 250);

-- ============================================================================
-- Modulo: Venta - Detalle Venta adicional (ventas 101-250)
-- ============================================================================

INSERT INTO detalle_venta (id_venta, id_producto, id_servicio, ps_nombre, ps_codigo, ps_precio_unitario, cantidad) VALUES
-- Venta 101: Consulta General + Meloxicam = 5300
(101, NULL,  1, 'Consulta General',                         'SRV-001', 3500.00, 1),
(101,  59, NULL, 'Meloxicam Solución Oral 1.5mg/ml 100ml',  'MED-024', 1800.00, 1),
-- Venta 102: Hills k/d Canino = 8500
(102,  66, NULL, 'Hills Prescription Diet k/d Canino 3.6kg','ALI-014', 8500.00, 1),
-- Venta 103: Implante Microchip + Vacunación Simple = 5500
(103, NULL, 23, 'Implante de Microchip',                    'SRV-023', 3500.00, 1),
(103, NULL,  3, 'Vacunación Simple',                        'SRV-003', 2000.00, 1),
-- Venta 104: Royal Canin Urinary SO = 6500
(104,  67, NULL, 'Royal Canin Urinary SO Canino 3.5kg',     'ALI-015', 6500.00, 1),
-- Venta 105: Ecografía + Enrofloxacina = 10900
(105, NULL, 12, 'Ecografía Abdominal',                      'SRV-012', 9000.00, 1),
(105,  54, NULL, 'Enrofloxacina 50mg x20 comp.',            'MED-019', 1900.00, 1),
-- Venta 106: Extracción Dental Simple = 5500
(106, NULL, 19, 'Extracción Dental Simple',                 'SRV-019', 5500.00, 1),
-- Venta 107: Vitamina B + Calcio-Fósforo = 4000
(107,  51, NULL, 'Vitamina B Complex Inyectable 30ml',      'MED-016', 1800.00, 1),
(107,  52, NULL, 'Suplemento Calcio-Fósforo 100ml',         'MED-017', 2200.00, 1),
-- Venta 108: Fisioterapia x2 = 6000
(108, NULL, 22, 'Fisioterapia y Rehabilitación',            'SRV-022', 3000.00, 2),
-- Venta 109: Acana Regionals Pacifica 2kg = 3800
(109,  76, NULL, 'Acana Regionals Pacifica 2kg',            'ALI-024', 3800.00, 1),
-- Venta 110: Electrocardiograma = 4500
(110, NULL, 27, 'Electrocardiograma (ECG)',                  'SRV-027', 4500.00, 1),
-- Venta 111: Bravecto Masticable M = 5500
(111,  83, NULL, 'Bravecto Masticable Perros 10-20kg',      'ACC-017', 5500.00, 1),
-- Venta 112: Control Post-Op + Aplicación Med = 4000
(112, NULL, 16, 'Control Post-Operatorio',                   'SRV-016', 2500.00, 1),
(112, NULL, 20, 'Aplicación de Medicación Inyect.',          'SRV-020', 1500.00, 1),
-- Venta 113: Bebedero Portátil + Pelota Chillador = 2100
(113,  79, NULL, 'Bebedero Portátil de Viaje 350ml',        'ACC-013', 1200.00, 1),
(113,  87, NULL, 'Pelota de Goma con Chillador Talla M',    'ACC-021',  900.00, 1),
-- Venta 114: Royal Canin Mother & Babycat = 4500
(114,  73, NULL, 'Royal Canin Mother & Babycat 2kg',        'ALI-021', 4500.00, 1),
-- Venta 115: Internación Diaria x3 = 10500
(115, NULL, 17, 'Internación Diaria',                        'SRV-017', 3500.00, 3),
-- Venta 116: Colonia + Limpiador Oídos = 3300
(116,  91, NULL, 'Colonia Perfumada para Mascotas 150ml',   'HIG-011', 1500.00, 1),
(116,  93, NULL, 'Limpiador de Oídos Veterinario 100ml',    'HIG-013', 1800.00, 1),
-- Venta 117: Análisis Lab + Aplicación Med = 7000
(117, NULL, 13, 'Análisis de Laboratorio',                   'SRV-013', 5500.00, 1),
(117, NULL, 20, 'Aplicación de Medicación Inyect.',          'SRV-020', 1500.00, 1),
-- Venta 118: Pechera Reflectante + Snood = 3000
(118,  84, NULL, 'Pechera Reflectante Talla M',             'ACC-018', 2200.00, 1),
(118,  85, NULL, 'Snood Calentador de Orejas Talla S',      'ACC-019',  800.00, 1),
-- Venta 119: Taste of the Wild = 2500
(119,  78, NULL, 'Taste of the Wild High Prairie Canino 2kg','ALI-026', 2500.00, 1),
-- Venta 120: Sutura y Curación + Clindamicina = 6600
(120, NULL, 18, 'Sutura y Curación de Heridas',              'SRV-018', 4500.00, 1),
(120,  55, NULL, 'Clindamicina 150mg x16 comp.',             'MED-020', 2100.00, 1),
-- Venta 121: Pro Plan Sensitive Skin 7.5kg = 9500
(121,  68, NULL, 'Pro Plan Sensitive Skin Canino 7.5kg',    'ALI-016', 9500.00, 1),
-- Venta 122: Control Post-Op + Desparasitación Interna = 4000
(122, NULL, 16, 'Control Post-Operatorio',                   'SRV-016', 2500.00, 1),
(122, NULL,  5, 'Desparasitación Interna',                   'SRV-005', 1500.00, 1),
-- Venta 123: Rastreador GPS = 7500
(123,  88, NULL, 'Rastreador GPS Collar para Mascotas',     'ACC-022', 7500.00, 1),
-- Venta 124: Nebulización x3 = 6000
(124, NULL, 21, 'Nebulización Terapéutica',                  'SRV-021', 2000.00, 3),
-- Venta 125: Juguete Láser + Pelota Chillador = 2700
(125,  81, NULL, 'Juguete Interactivo Láser Automático',    'ACC-015', 1800.00, 1),
(125,  87, NULL, 'Pelota de Goma con Chillador Talla M',    'ACC-021',  900.00, 1),
-- Venta 126: Plan Nutricional + Orijen Cat = 7800
(126, NULL, 29, 'Plan Nutricional Personalizado',            'SRV-029', 3000.00, 1),
(126,  77, NULL, 'Orijen Cat & Kitten 1.8kg',               'ALI-025', 4800.00, 1),
-- Venta 127: Cama Ortopédica L = 6500
(127,  82, NULL, 'Cama Ortopédica Memory Foam Talla L',     'ACC-016', 6500.00, 1),
-- Venta 128: Castración Canino Hembra = 22000
(128, NULL,  8, 'Castración Canino Hembra',                  'SRV-008',22000.00, 1),
-- Venta 129: Esponja Baño + Peine Antiestático = 1800
(129,  92, NULL, 'Esponja de Baño Exfoliante Canina',       'HIG-012',  600.00, 1),
(129,  97, NULL, 'Peine de Acero Antiestático 18cm',        'HIG-017', 1200.00, 1),
-- Venta 130: Extracción Cuerpo Extraño = 7500
(130, NULL, 24, 'Extracción de Cuerpo Extraño',              'SRV-024', 7500.00, 1),
-- Venta 131: Secador Silencioso = 4500
(131,  98, NULL, 'Secador Silencioso para Mascotas 1400W',  'HIG-018', 4500.00, 1),
-- Venta 132: Limpieza Dental + Cepillo Dientes x2 + Pasta Dental = 10500
(132, NULL, 11, 'Limpieza Dental Ultrasónica',               'SRV-011', 8500.00, 1),
(132,  46, NULL, 'Cepillo de Dientes Canino Doble',          'HIG-006',  800.00, 1),
(132,  47, NULL, 'Pasta Dental Canina Sabor Pollo',          'HIG-007', 1200.00, 1),
-- Venta 133: Pedigree Razas Pequeñas 8kg = 7500
(133,  69, NULL, 'Pedigree Adulto Razas Pequeñas 8kg',      'ALI-017', 7500.00, 1),
-- Venta 134: Sondaje Vesical = 4000
(134, NULL, 25, 'Sondaje Vesical',                           'SRV-025', 4000.00, 1),
-- Venta 135: Mochila Transportín Gatos = 7800
(135,  80, NULL, 'Mochila Transportín para Gatos Talla M',  'ACC-014', 7800.00, 1),
-- Venta 136: Consulta General + Lactulosa = 5100
(136, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
(136,  53, NULL, 'Lactulosa Solución Oral 200ml',            'MED-018', 1600.00, 1),
-- Venta 137: Pro Plan Puppy Small Breed 7.5kg = 10500
(137,  74, NULL, 'Pro Plan Puppy Small Breed 7.5kg',        'ALI-022',10500.00, 1),
-- Venta 138: Taller Adiestramiento Básico = 2500
(138, NULL, 30, 'Taller de Adiestramiento Básico',           'SRV-030', 2500.00, 1),
-- Venta 139: Fancy Feast Gravy x12 = 8500
(139,  71, NULL, 'Fancy Feast Gravy Colección x12 latas',   'ALI-019', 8500.00, 1),
-- Venta 140: Punción Análisis + Análisis Lab = 11500
(140, NULL, 26, 'Punción y Análisis de Líquido',             'SRV-026', 6000.00, 1),
(140, NULL, 13, 'Análisis de Laboratorio',                   'SRV-013', 5500.00, 1),
-- Venta 141: Whiskas Adulto Vacuno + Piedra Sanitaria = 4000
(141,  70, NULL, 'Whiskas Adulto Vacuno Seco 1.5kg',        'ALI-018', 2800.00, 1),
(141,  96, NULL, 'Piedra Sanitaria Lavanda x2u',             'HIG-016', 1200.00, 1),
-- Venta 142: Castración Felino Macho = 12000
(142, NULL,  9, 'Castración Felino Macho',                   'SRV-009',12000.00, 1),
-- Venta 143: Set Manicura Canina = 2800
(143,  99, NULL, 'Set Manicura Canina 5 piezas',            'HIG-019', 2800.00, 1),
-- Venta 144: Interconsulta Especialista + Análisis Lab = 10500
(144, NULL, 28, 'Interconsulta con Especialista',            'SRV-028', 5000.00, 1),
(144, NULL, 13, 'Análisis de Laboratorio',                   'SRV-013', 5500.00, 1),
-- Venta 145: Natural Balance LID Salmon = 7200
(145,  75, NULL, 'Natural Balance LID Salmon 5lb',           'ALI-023', 7200.00, 1),
-- Venta 146: Desparasitación Externa + Meloxicam = 3300
(146, NULL,  6, 'Desparasitación Externa',                   'SRV-006', 1500.00, 1),
(146,  59, NULL, 'Meloxicam Solución Oral 1.5mg/ml 100ml',  'MED-024', 1800.00, 1),
-- Venta 147: Hills Science Diet Kitten = 5800
(147,  72, NULL, 'Hills Science Diet Kitten 1.6kg',         'ALI-020', 5800.00, 1),
-- Venta 148: Consulta General + Spray Desenredante = 4900
(148, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
(148,  94, NULL, 'Spray Desenredante Sin Enjuague 200ml',   'HIG-014', 1400.00, 1),
-- Venta 149: Malla Protectora Balcón = 4200
(149,  90, NULL, 'Malla Protectora Balcón 6m² Negra',       'ACC-024', 4200.00, 1),
-- Venta 150: Peluquería Canina + Shampoo Neutro = 6300
(150, NULL, 15, 'Peluquería Canina Estándar',                'SRV-015', 4500.00, 1),
(150,  41, NULL, 'Shampoo Neutro Avena 500ml',               'HIG-001', 1800.00, 1),

-- *** PENDIENTES (151-200) ***
-- Venta 151: Castración Canino Macho = 18000
(151, NULL,  7, 'Castración Canino Macho',                   'SRV-007',18000.00, 1),
-- Venta 152: Hills k/d Canino = 8500
(152,  66, NULL, 'Hills Prescription Diet k/d Canino 3.6kg','ALI-014', 8500.00, 1),
-- Venta 153: Royal Canin Urinary SO = 6500
(153,  67, NULL, 'Royal Canin Urinary SO Canino 3.5kg',     'ALI-015', 6500.00, 1),
-- Venta 154: Ecografía + Meloxicam = 10800
(154, NULL, 12, 'Ecografía Abdominal',                       'SRV-012', 9000.00, 1),
(154,  59, NULL, 'Meloxicam Solución Oral 1.5mg/ml 100ml',  'MED-024', 1800.00, 1),
-- Venta 155: Implante Microchip = 3500
(155, NULL, 23, 'Implante de Microchip',                     'SRV-023', 3500.00, 1),
-- Venta 156: Bravecto Masticable M = 5500
(156,  83, NULL, 'Bravecto Masticable Perros 10-20kg',      'ACC-017', 5500.00, 1),
-- Venta 157: Castración Canino Hembra = 22000
(157, NULL,  8, 'Castración Canino Hembra',                  'SRV-008',22000.00, 1),
-- Venta 158: Pro Plan Sensitive Skin = 9500
(158,  68, NULL, 'Pro Plan Sensitive Skin Canino 7.5kg',    'ALI-016', 9500.00, 1),
-- Venta 159: Internación Diaria x2 = 7000
(159, NULL, 17, 'Internación Diaria',                        'SRV-017', 3500.00, 2),
-- Venta 160: Cama Ortopédica L = 6500
(160,  82, NULL, 'Cama Ortopédica Memory Foam Talla L',     'ACC-016', 6500.00, 1),
-- Venta 161: Limpieza Dental = 8500
(161, NULL, 11, 'Limpieza Dental Ultrasónica',               'SRV-011', 8500.00, 1),
-- Venta 162: Rastreador GPS = 7500
(162,  88, NULL, 'Rastreador GPS Collar para Mascotas',     'ACC-022', 7500.00, 1),
-- Venta 163: Castración Felino Hembra = 15000
(163, NULL, 10, 'Castración Felino Hembra',                  'SRV-010',15000.00, 1),
-- Venta 164: Pro Plan Puppy Small Breed = 10500
(164,  74, NULL, 'Pro Plan Puppy Small Breed 7.5kg',        'ALI-022',10500.00, 1),
-- Venta 165: Análisis Lab + Vitamina B = 7300
(165, NULL, 13, 'Análisis de Laboratorio',                   'SRV-013', 5500.00, 1),
(165,  51, NULL, 'Vitamina B Complex Inyectable 30ml',       'MED-016', 1800.00, 1),
-- Venta 166: Pedigree Razas Pequeñas 8kg = 7500
(166,  69, NULL, 'Pedigree Adulto Razas Pequeñas 8kg',      'ALI-017', 7500.00, 1),
-- Venta 167: Electrocardiograma = 4500
(167, NULL, 27, 'Electrocardiograma (ECG)',                  'SRV-027', 4500.00, 1),
-- Venta 168: Mochila Transportín Gatos = 7800
(168,  80, NULL, 'Mochila Transportín para Gatos Talla M',  'ACC-014', 7800.00, 1),
-- Venta 169: Consulta General + Desparasitación Interna = 5000
(169, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
(169, NULL,  5, 'Desparasitación Interna',                   'SRV-005', 1500.00, 1),
-- Venta 170: Fancy Feast Gravy x12 = 8500
(170,  71, NULL, 'Fancy Feast Gravy Colección x12 latas',   'ALI-019', 8500.00, 1),
-- Venta 171: Fisioterapia x3 = 9000
(171, NULL, 22, 'Fisioterapia y Rehabilitación',             'SRV-022', 3000.00, 3),
-- Venta 172: Acana Regionals x2 = 7600
(172,  76, NULL, 'Acana Regionals Pacifica 2kg',             'ALI-024', 3800.00, 2),
-- Venta 173: Extracción Dental Simple = 5500
(173, NULL, 19, 'Extracción Dental Simple',                  'SRV-019', 5500.00, 1),
-- Venta 174: Royal Canin Mother + Taste of the Wild = 7000
(174,  73, NULL, 'Royal Canin Mother & Babycat 2kg',        'ALI-021', 4500.00, 1),
(174,  78, NULL, 'Taste of the Wild High Prairie Canino 2kg','ALI-026', 2500.00, 1),
-- Venta 175: Castración Felino Macho = 12000
(175, NULL,  9, 'Castración Felino Macho',                   'SRV-009',12000.00, 1),
-- Venta 176: Natural Balance LID Salmon = 7200
(176,  75, NULL, 'Natural Balance LID Salmon 5lb',           'ALI-023', 7200.00, 1),
-- Venta 177: Vacunación Completa + Implante Microchip = 7000
(177, NULL,  4, 'Vacunación Completa',                       'SRV-004', 3500.00, 1),
(177, NULL, 23, 'Implante de Microchip',                     'SRV-023', 3500.00, 1),
-- Venta 178: Secador Silencioso = 4500
(178,  98, NULL, 'Secador Silencioso para Mascotas 1400W',  'HIG-018', 4500.00, 1),
-- Venta 179: Extracción Cuerpo Extraño = 7500
(179, NULL, 24, 'Extracción de Cuerpo Extraño',              'SRV-024', 7500.00, 1),
-- Venta 180: Set Manicura + Colonia = 4300
(180,  99, NULL, 'Set Manicura Canina 5 piezas',            'HIG-019', 2800.00, 1),
(180,  91, NULL, 'Colonia Perfumada para Mascotas 150ml',   'HIG-011', 1500.00, 1),
-- Venta 181: Castración Canino Macho = 18000
(181, NULL,  7, 'Castración Canino Macho',                   'SRV-007',18000.00, 1),
-- Venta 182: Hills Science Diet Kitten = 5800
(182,  72, NULL, 'Hills Science Diet Kitten 1.6kg',         'ALI-020', 5800.00, 1),
-- Venta 183: Plan Nutricional + Orijen Cat = 7800
(183, NULL, 29, 'Plan Nutricional Personalizado',            'SRV-029', 3000.00, 1),
(183,  77, NULL, 'Orijen Cat & Kitten 1.8kg',               'ALI-025', 4800.00, 1),
-- Venta 184: Juguete Láser + Pelota Chillador x2 = 3600
(184,  81, NULL, 'Juguete Interactivo Láser Automático',    'ACC-015', 1800.00, 1),
(184,  87, NULL, 'Pelota de Goma con Chillador Talla M',    'ACC-021',  900.00, 2),
-- Venta 185: Sondaje Vesical = 4000
(185, NULL, 25, 'Sondaje Vesical',                           'SRV-025', 4000.00, 1),
-- Venta 186: Malla Protectora Balcón = 4200
(186,  90, NULL, 'Malla Protectora Balcón 6m² Negra',       'ACC-024', 4200.00, 1),
-- Venta 187: Peluquería Canina + Pechera Reflectante = 6700
(187, NULL, 15, 'Peluquería Canina Estándar',                'SRV-015', 4500.00, 1),
(187,  84, NULL, 'Pechera Reflectante Talla M',             'ACC-018', 2200.00, 1),
-- Venta 188: Whiskas Adulto Vacuno x2 = 5600
(188,  70, NULL, 'Whiskas Adulto Vacuno Seco 1.5kg',        'ALI-018', 2800.00, 2),
-- Venta 189: Nebulización x2 = 4000
(189, NULL, 21, 'Nebulización Terapéutica',                  'SRV-021', 2000.00, 2),
-- Venta 190: Bravecto Masticable M = 5500
(190,  83, NULL, 'Bravecto Masticable Perros 10-20kg',      'ACC-017', 5500.00, 1),
-- Venta 191: Consulta General + Limpiador Oídos = 5300
(191, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
(191,  93, NULL, 'Limpiador de Oídos Veterinario 100ml',    'HIG-013', 1800.00, 1),
-- Venta 192: Cama Ortopédica L = 6500
(192,  82, NULL, 'Cama Ortopédica Memory Foam Talla L',     'ACC-016', 6500.00, 1),
-- Venta 193: Interconsulta Especialista = 5000
(193, NULL, 28, 'Interconsulta con Especialista',            'SRV-028', 5000.00, 1),
-- Venta 194: Bebedero Portátil + Porta Bolsas = 2150
(194,  79, NULL, 'Bebedero Portátil de Viaje 350ml',        'ACC-013', 1200.00, 1),
(194,  89, NULL, 'Porta Bolsas + Bolsas Biodeg x50u',       'ACC-023',  950.00, 1),
-- Venta 195: Taller Adiestramiento Básico = 2500
(195, NULL, 30, 'Taller de Adiestramiento Básico',           'SRV-030', 2500.00, 1),
-- Venta 196: Comedero Elevado Doble + Esponja Baño = 4100
(196,  86, NULL, 'Comedero Elevado Doble Inoxidable',       'ACC-020', 3500.00, 1),
(196,  92, NULL, 'Esponja de Baño Exfoliante Canina',       'HIG-012',  600.00, 1),
-- Venta 197: Punción y Análisis = 6000
(197, NULL, 26, 'Punción y Análisis de Líquido',             'SRV-026', 6000.00, 1),
-- Venta 198: Pro Plan Puppy Small Breed = 10500
(198,  74, NULL, 'Pro Plan Puppy Small Breed 7.5kg',        'ALI-022',10500.00, 1),
-- Venta 199: Ecografía Abdominal = 9000
(199, NULL, 12, 'Ecografía Abdominal',                       'SRV-012', 9000.00, 1),
-- Venta 200: Pro Plan Sensitive Skin = 9500
(200,  68, NULL, 'Pro Plan Sensitive Skin Canino 7.5kg',    'ALI-016', 9500.00, 1),

-- *** CANCELADAS (201-250) ***
-- Venta 201: Consulta General = 3500
(201, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
-- Venta 202: Vitamina B = 1800
(202,  51, NULL, 'Vitamina B Complex Inyectable 30ml',       'MED-016', 1800.00, 1),
-- Venta 203: Castración Canino Macho = 18000
(203, NULL,  7, 'Castración Canino Macho',                   'SRV-007',18000.00, 1),
-- Venta 204: Royal Canin Mini Adult 3kg = 4500
(204,  16, NULL, 'Royal Canin Mini Adult 3kg',               'ALI-001', 4500.00, 1),
-- Venta 205: Peluquería Canina = 4500
(205, NULL, 15, 'Peluquería Canina Estándar',                'SRV-015', 4500.00, 1),
-- Venta 206: Bravecto Masticable = 5500
(206,  83, NULL, 'Bravecto Masticable Perros 10-20kg',      'ACC-017', 5500.00, 1),
-- Venta 207: Limpieza Dental = 8500
(207, NULL, 11, 'Limpieza Dental Ultrasónica',               'SRV-011', 8500.00, 1),
-- Venta 208: Rastreador GPS = 7500
(208,  88, NULL, 'Rastreador GPS Collar para Mascotas',     'ACC-022', 7500.00, 1),
-- Venta 209: Vacunación Simple = 2000
(209, NULL,  3, 'Vacunación Simple',                         'SRV-003', 2000.00, 1),
-- Venta 210: Royal Canin Urinary SO = 6500
(210,  67, NULL, 'Royal Canin Urinary SO Canino 3.5kg',     'ALI-015', 6500.00, 1),
-- Venta 211: Castración Canino Hembra = 22000
(211, NULL,  8, 'Castración Canino Hembra',                  'SRV-008',22000.00, 1),
-- Venta 212: Cama Ortopédica L = 6500
(212,  82, NULL, 'Cama Ortopédica Memory Foam Talla L',     'ACC-016', 6500.00, 1),
-- Venta 213: Ecografía Abdominal = 9000
(213, NULL, 12, 'Ecografía Abdominal',                       'SRV-012', 9000.00, 1),
-- Venta 214: Pro Plan Puppy Small Breed = 10500
(214,  74, NULL, 'Pro Plan Puppy Small Breed 7.5kg',        'ALI-022',10500.00, 1),
-- Venta 215: Desparasitación Interna = 1500
(215, NULL,  5, 'Desparasitación Interna',                   'SRV-005', 1500.00, 1),
-- Venta 216: Whiskas Adulto Vacuno x2 = 5600
(216,  70, NULL, 'Whiskas Adulto Vacuno Seco 1.5kg',        'ALI-018', 2800.00, 2),
-- Venta 217: Implante Microchip = 3500
(217, NULL, 23, 'Implante de Microchip',                     'SRV-023', 3500.00, 1),
-- Venta 218: Meloxicam + Clindamicina = 3900
(218,  59, NULL, 'Meloxicam Solución Oral 1.5mg/ml 100ml',  'MED-024', 1800.00, 1),
(218,  55, NULL, 'Clindamicina 150mg x16 comp.',             'MED-020', 2100.00, 1),
-- Venta 219: Castración Felino Macho = 12000
(219, NULL,  9, 'Castración Felino Macho',                   'SRV-009',12000.00, 1),
-- Venta 220: Mochila Transportín Gatos = 7800
(220,  80, NULL, 'Mochila Transportín para Gatos Talla M',  'ACC-014', 7800.00, 1),
-- Venta 221: Consulta General + Desparasitación Externa = 5000
(221, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
(221, NULL,  6, 'Desparasitación Externa',                   'SRV-006', 1500.00, 1),
-- Venta 222: Secador Silencioso = 4500
(222,  98, NULL, 'Secador Silencioso para Mascotas 1400W',  'HIG-018', 4500.00, 1),
-- Venta 223: Fisioterapia = 3000
(223, NULL, 22, 'Fisioterapia y Rehabilitación',             'SRV-022', 3000.00, 1),
-- Venta 224: Royal Canin Mother & Babycat = 4500
(224,  73, NULL, 'Royal Canin Mother & Babycat 2kg',        'ALI-021', 4500.00, 1),
-- Venta 225: Análisis Lab = 5500
(225, NULL, 13, 'Análisis de Laboratorio',                   'SRV-013', 5500.00, 1),
-- Venta 226: Pro Plan Sensitive Skin = 9500
(226,  68, NULL, 'Pro Plan Sensitive Skin Canino 7.5kg',    'ALI-016', 9500.00, 1),
-- Venta 227: Extracción Dental Simple = 5500
(227, NULL, 19, 'Extracción Dental Simple',                  'SRV-019', 5500.00, 1),
-- Venta 228: Fancy Feast Gravy x12 = 8500
(228,  71, NULL, 'Fancy Feast Gravy Colección x12 latas',   'ALI-019', 8500.00, 1),
-- Venta 229: Internación Diaria = 3500
(229, NULL, 17, 'Internación Diaria',                        'SRV-017', 3500.00, 1),
-- Venta 230: Bravecto Masticable = 5500
(230,  83, NULL, 'Bravecto Masticable Perros 10-20kg',      'ACC-017', 5500.00, 1),
-- Venta 231: Extracción Cuerpo Extraño = 7500
(231, NULL, 24, 'Extracción de Cuerpo Extraño',              'SRV-024', 7500.00, 1),
-- Venta 232: Cama Ortopédica L = 6500
(232,  82, NULL, 'Cama Ortopédica Memory Foam Talla L',     'ACC-016', 6500.00, 1),
-- Venta 233: Vacunación Completa = 3500
(233, NULL,  4, 'Vacunación Completa',                       'SRV-004', 3500.00, 1),
-- Venta 234: Hills k/d Canino = 8500
(234,  66, NULL, 'Hills Prescription Diet k/d Canino 3.6kg','ALI-014', 8500.00, 1),
-- Venta 235: Electrocardiograma = 4500
(235, NULL, 27, 'Electrocardiograma (ECG)',                  'SRV-027', 4500.00, 1),
-- Venta 236: Malla Protectora Balcón = 4200
(236,  90, NULL, 'Malla Protectora Balcón 6m² Negra',       'ACC-024', 4200.00, 1),
-- Venta 237: Peluquería Canina = 4500
(237, NULL, 15, 'Peluquería Canina Estándar',                'SRV-015', 4500.00, 1),
-- Venta 238: Bebedero Portátil + Pelota Chillador = 2100
(238,  79, NULL, 'Bebedero Portátil de Viaje 350ml',        'ACC-013', 1200.00, 1),
(238,  87, NULL, 'Pelota de Goma con Chillador Talla M',    'ACC-021',  900.00, 1),
-- Venta 239: Consulta General = 3500
(239, NULL,  1, 'Consulta General',                          'SRV-001', 3500.00, 1),
-- Venta 240: Royal Canin Large Adult 15kg = 18000
(240,  17, NULL, 'Royal Canin Large Adult 15kg',             'ALI-002',18000.00, 1),
-- Venta 241: Castración Felino Hembra = 15000
(241, NULL, 10, 'Castración Felino Hembra',                  'SRV-010',15000.00, 1),
-- Venta 242: Hills Science Diet Kitten = 5800
(242,  72, NULL, 'Hills Science Diet Kitten 1.6kg',         'ALI-020', 5800.00, 1),
-- Venta 243: Plan Nutricional = 3000
(243, NULL, 29, 'Plan Nutricional Personalizado',            'SRV-029', 3000.00, 1),
-- Venta 244: Set Manicura Canina = 2800
(244,  99, NULL, 'Set Manicura Canina 5 piezas',            'HIG-019', 2800.00, 1),
-- Venta 245: Castración Canino Macho = 18000
(245, NULL,  7, 'Castración Canino Macho',                   'SRV-007',18000.00, 1),
-- Venta 246: Acana Regionals Pacifica = 3800
(246,  76, NULL, 'Acana Regionals Pacifica 2kg',             'ALI-024', 3800.00, 1),
-- Venta 247: Vacunación Simple = 2000
(247, NULL,  3, 'Vacunación Simple',                         'SRV-003', 2000.00, 1),
-- Venta 248: Juguete Láser Automático = 1800
(248,  81, NULL, 'Juguete Interactivo Láser Automático',    'ACC-015', 1800.00, 1),
-- Venta 249: Sondaje Vesical = 4000
(249, NULL, 25, 'Sondaje Vesical',                           'SRV-025', 4000.00, 1),
-- Venta 250: Orijen Cat & Kitten = 4800
(250,  77, NULL, 'Orijen Cat & Kitten 1.8kg',               'ALI-025', 4800.00, 1);

-- ============================================================================
-- Modulo: Venta - Pago adicional (ventas completadas 101-150)
-- Métodos: 1=Efectivo | 2=Tarjeta Crédito | 3=Tarjeta Débito | 4=Transferencia | 5=Mercado Pago
-- ============================================================================

INSERT INTO pago (fecha, monto, monto_bonificado, referencia, id_metodo_pago, id_venta, id_estado) VALUES
('2026-01-03 09:35:00-03',  5300.00, 0.00, NULL, 1,  101, 1),  -- Efectivo
('2026-01-03 10:20:00-03',  8500.00, 0.00, NULL, 4,  102, 1),  -- Transferencia
('2026-01-04 09:05:00-03',  5500.00, 0.00, NULL, 5,  103, 1),  -- Mercado Pago
('2026-01-04 10:35:00-03',  6500.00, 0.00, NULL, 3,  104, 1),  -- Débito
('2026-01-05 09:20:00-03', 10900.00, 0.00, NULL, 4,  105, 1),  -- Transferencia
('2026-01-05 11:05:00-03',  5500.00, 0.00, NULL, 2,  106, 1),  -- Crédito
('2026-01-06 09:50:00-03',  4000.00, 0.00, NULL, 1,  107, 1),  -- Efectivo
-- Venta 108: pago mixto efectivo + mercado pago
('2026-01-06 10:35:00-03',  3000.00, 0.00, NULL, 1,  108, 1),  -- Efectivo
('2026-01-06 10:37:00-03',  3000.00, 0.00, NULL, 5,  108, 1),  -- Mercado Pago
('2026-01-07 09:05:00-03',  3800.00, 0.00, NULL, 3,  109, 1),  -- Débito
('2026-01-07 11:20:00-03',  4500.00, 0.00, NULL, 2,  110, 1),  -- Crédito
('2026-01-08 09:35:00-03',  5500.00, 0.00, NULL, 1,  111, 1),  -- Efectivo
('2026-01-08 10:50:00-03',  4000.00, 0.00, NULL, 5,  112, 1),  -- Mercado Pago
('2026-01-09 09:05:00-03',  2100.00, 0.00, NULL, 1,  113, 1),  -- Efectivo
('2026-01-09 11:05:00-03',  4500.00, 0.00, NULL, 3,  114, 1),  -- Débito
-- Venta 115: pago mixto transferencia + débito
('2026-01-10 09:35:00-03',  7000.00, 0.00, NULL, 4,  115, 1),  -- Transferencia
('2026-01-10 09:37:00-03',  3500.00, 0.00, NULL, 3,  115, 1),  -- Débito
('2026-01-10 10:50:00-03',  3300.00, 0.00, NULL, 1,  116, 1),  -- Efectivo
('2026-01-11 09:05:00-03',  7000.00, 0.00, NULL, 4,  117, 1),  -- Transferencia
('2026-01-11 11:20:00-03',  3000.00, 0.00, NULL, 5,  118, 1),  -- Mercado Pago
('2026-01-12 09:50:00-03',  2500.00, 0.00, NULL, 1,  119, 1),  -- Efectivo
('2026-01-12 10:35:00-03',  6600.00, 0.00, NULL, 2,  120, 1),  -- Crédito
('2026-01-13 09:20:00-03',  9500.00, 0.00, NULL, 4,  121, 1),  -- Transferencia
('2026-01-13 11:05:00-03',  4000.00, 0.00, NULL, 1,  122, 1),  -- Efectivo
('2026-01-14 09:35:00-03',  7500.00, 0.00, NULL, 3,  123, 1),  -- Débito
('2026-01-14 10:05:00-03',  6000.00, 0.00, NULL, 5,  124, 1),  -- Mercado Pago
('2026-01-15 09:50:00-03',  2700.00, 0.00, NULL, 1,  125, 1),  -- Efectivo
-- Venta 126: pago mixto transferencia + efectivo
('2026-01-15 11:20:00-03',  5000.00, 0.00, NULL, 4,  126, 1),  -- Transferencia
('2026-01-15 11:22:00-03',  2800.00, 0.00, NULL, 1,  126, 1),  -- Efectivo
('2026-01-16 09:05:00-03',  6500.00, 0.00, NULL, 3,  127, 1),  -- Débito
-- Venta 128: pago mixto transferencia + crédito
('2026-01-16 10:35:00-03', 15000.00, 0.00, NULL, 4,  128, 1),  -- Transferencia
('2026-01-16 10:37:00-03',  7000.00, 0.00, NULL, 2,  128, 1),  -- Crédito
('2026-01-17 09:20:00-03',  1800.00, 0.00, NULL, 1,  129, 1),  -- Efectivo
('2026-01-17 11:05:00-03',  7500.00, 0.00, NULL, 4,  130, 1),  -- Transferencia
('2026-01-18 09:35:00-03',  4500.00, 0.00, NULL, 5,  131, 1),  -- Mercado Pago
('2026-01-18 10:50:00-03', 10500.00, 0.00, NULL, 4,  132, 1),  -- Transferencia
('2026-01-19 09:05:00-03',  7500.00, 0.00, NULL, 3,  133, 1),  -- Débito
('2026-01-19 11:20:00-03',  4000.00, 0.00, NULL, 2,  134, 1),  -- Crédito
('2026-01-20 09:50:00-03',  7800.00, 0.00, NULL, 1,  135, 1),  -- Efectivo
('2026-01-20 10:35:00-03',  5100.00, 0.00, NULL, 5,  136, 1),  -- Mercado Pago
('2026-01-21 09:05:00-03', 10500.00, 0.00, NULL, 4,  137, 1),  -- Transferencia
('2026-01-21 11:05:00-03',  2500.00, 0.00, NULL, 1,  138, 1),  -- Efectivo
('2026-01-22 09:35:00-03',  8500.00, 0.00, NULL, 3,  139, 1),  -- Débito
-- Venta 140: pago mixto transferencia + crédito
('2026-01-22 10:50:00-03',  7000.00, 0.00, NULL, 4,  140, 1),  -- Transferencia
('2026-01-22 10:52:00-03',  4500.00, 0.00, NULL, 2,  140, 1),  -- Crédito
('2026-01-23 09:20:00-03',  4000.00, 0.00, NULL, 1,  141, 1),  -- Efectivo
('2026-01-23 11:05:00-03', 12000.00, 0.00, NULL, 4,  142, 1),  -- Transferencia
('2026-01-24 09:50:00-03',  2800.00, 0.00, NULL, 5,  143, 1),  -- Mercado Pago
-- Venta 144: pago mixto crédito + transferencia
('2026-01-24 10:35:00-03',  5500.00, 0.00, NULL, 2,  144, 1),  -- Crédito
('2026-01-24 10:37:00-03',  5000.00, 0.00, NULL, 4,  144, 1),  -- Transferencia
('2026-01-25 09:05:00-03',  7200.00, 0.00, NULL, 3,  145, 1),  -- Débito
('2026-01-25 11:20:00-03',  3300.00, 0.00, NULL, 1,  146, 1),  -- Efectivo
('2026-01-26 09:35:00-03',  5800.00, 0.00, NULL, 2,  147, 1),  -- Crédito
('2026-01-26 10:50:00-03',  4900.00, 0.00, NULL, 5,  148, 1),  -- Mercado Pago
('2026-01-27 09:05:00-03',  4200.00, 0.00, NULL, 1,  149, 1),  -- Efectivo
('2026-01-27 11:05:00-03',  6300.00, 0.00, NULL, 3,  150, 1);  -- Débito

-- ============================================================================
-- Modulo: Venta - Anulacion Venta adicional (ventas canceladas 201-250)
-- Motivos: 1=Error de Carga | 2=Cliente Desiste | 3=Falta de Fondos
-- ============================================================================

INSERT INTO anulacion_venta (fecha, observaciones, id_anulacion_venta_motivo, id_empleado, id_venta) VALUES
('2026-01-05 10:15:00-03', 'Cliente llegó sin turno; se reencaminó a turno programado.',           2, 4, 201),
('2026-01-06 11:00:00-03', 'Error de sistema al cargar el producto. Venta reiniciada.',             1, 4, 202),
('2026-01-07 09:45:00-03', 'Cliente reprogramó la cirugía por problemas personales.',              2, 4, 203),
('2026-01-08 11:45:00-03', 'Se cargó marca incorrecta; corregida en nueva transacción.',           1, 4, 204),
('2026-01-09 10:15:00-03', 'Cliente solicitó cancelar el servicio antes de ingresar al quirófano.',2, 4, 205),
('2026-01-10 11:30:00-03', 'Pago rechazado. Cliente retiró el producto sin abonar.',               3, 4, 206),
('2026-01-11 09:30:00-03', 'Turno cancelado por enfermedad del veterinario asignado.',             2, 4, 207),
('2026-01-12 12:00:00-03', 'Cliente desistió por el precio. Optó por menor cobertura.',            2, 4, 208),
('2026-01-13 10:30:00-03', 'Se registró la vacuna equivocada. Nueva venta emitida.',               1, 4, 209),
('2026-01-14 11:15:00-03', 'Cliente avisó que ya tenía el mismo producto en casa.',                2, 4, 210),
('2026-01-15 09:45:00-03', 'Cirugía suspendida por parámetros preanestésicos alterados.',         2, 4, 211),
('2026-01-16 11:45:00-03', 'Error de talla registrada; reemitida con el artículo correcto.',       1, 4, 212),
('2026-01-17 10:15:00-03', 'Turno de ecografía cancelado por urgencia prioritaria.',               2, 4, 213),
('2026-01-18 11:00:00-03', 'El cliente tenía un voucher de descuento; venta reemitida.',           1, 4, 214),
('2026-01-19 09:30:00-03', 'El cliente decidió usar desparasitante propio.',                       2, 4, 215),
('2026-01-20 12:15:00-03', 'Débito rechazado y sin efectivo disponible.',                          3, 4, 216),
('2026-01-21 10:30:00-03', 'Cliente llegó sin documentación del animal para microchip.',           2, 4, 217),
('2026-01-22 10:45:00-03', 'Se cargaron productos en cantidad incorrecta.',                        1, 4, 218),
('2026-01-23 10:00:00-03', 'Propietario retiró al animal antes de la castración.',                 2, 4, 219),
('2026-01-24 11:45:00-03', 'Cliente realizará la compra online. Venta cancelada.',                 2, 4, 220),
('2026-01-25 10:15:00-03', 'Se duplicó la venta; esta es la copia errónea.',                       1, 4, 221),
('2026-01-26 11:30:00-03', 'Tarjeta de crédito rechazada; sin otro medio de pago.',                3, 4, 222),
('2026-01-27 09:45:00-03', 'Fisioterapeuta ausente por enfermedad. Turno reprogramado.',           2, 4, 223),
('2026-01-28 12:00:00-03', 'Cliente decidió cambiar de marca antes de pagar.',                     2, 4, 224),
('2026-01-29 10:30:00-03', 'Análisis solicitado no disponible; derivado a laboratorio externo.',   2, 4, 225),
('2026-01-30 11:15:00-03', 'Cliente no disponía de fondos. Programó para el día siguiente.',       3, 4, 226),
('2026-01-31 09:30:00-03', 'Extracción cancelada; veterinario decidió tratamiento conservador.',   2, 4, 227),
('2026-02-01 11:45:00-03', 'Se cargó producto vencido; detectado al facturar. Baja inmediata.',    1, 4, 228),
('2026-02-02 10:15:00-03', 'Alta médica dada antes de completar la internación programada.',       2, 4, 229),
('2026-02-03 11:30:00-03', 'Cliente sin fondos suficientes. Acordó abonar a la semana.',           3, 4, 230),
('2026-02-04 09:45:00-03', 'El animal no toleró la sedación previa; procedimiento suspendido.',    2, 4, 231),
('2026-02-05 12:00:00-03', 'Error en precio: se cargó talla incorrecta.',                          1, 4, 232),
('2026-02-06 10:30:00-03', 'Cliente cambió a vacunación en clínica de barrio por costo.',          2, 4, 233),
('2026-02-07 11:15:00-03', 'Cliente ya tenía la misma dieta comprada en tienda online.',           2, 4, 234),
('2026-02-08 09:30:00-03', 'ECG cancelado; veterinario cardiólogo en licencia ese día.',           2, 4, 235),
('2026-02-09 11:45:00-03', 'Se cargó el producto de tamaño incorrecto.',                           1, 4, 236),
('2026-02-10 10:00:00-03', 'El animal se escapó del transporte; servicio reprogramado.',           2, 4, 237),
('2026-02-11 11:00:00-03', 'Se registró el producto equivocado; nueva venta emitida.',             1, 4, 238),
('2026-02-12 09:30:00-03', 'Cliente olvidó traer historial clínico. Cita reagendada.',             2, 4, 239),
('2026-02-13 12:15:00-03', 'Cliente no tenía fondos. Acordó cuota para el mes siguiente.',         3, 4, 240),
('2026-02-14 10:30:00-03', 'Animal en celo; veterinario postergó la cirugía 3 semanas.',           2, 4, 241),
('2026-02-15 11:15:00-03', 'Error en el código de producto seleccionado en sistema.',              1, 4, 242),
('2026-02-16 09:45:00-03', 'Cliente reconsideró y eligió otro plan nutricional.',                  2, 4, 243),
('2026-02-17 11:45:00-03', 'El cliente ya tenía el set de manicura comprado.',                     2, 4, 244),
('2026-02-18 10:00:00-03', 'Pago diferido no aprobado. Cirugía reprogramada.',                     3, 4, 245),
('2026-02-19 11:00:00-03', 'El stock de ese sabor estaba agotado; cliente no aceptó cambio.',      2, 4, 246),
('2026-02-20 09:30:00-03', 'Se registró doble turno; esta es la entrada duplicada.',               1, 4, 247),
('2026-02-21 12:00:00-03', 'Cliente vio el mismo juguete más barato en otra tienda.',              2, 4, 248),
('2026-02-22 10:30:00-03', 'Sondaje cancelado; veterinario revisó y no fue necesario.',            2, 4, 249),
('2026-02-23 11:15:00-03', 'Alimento no disponible en stock al momento de facturar.',              2, 4, 250);

-- ============================================================================
-- Fin del script de datos de prueba adicionales - Modulo Stock y Venta
-- ============================================================================
