-- ============================================================================
-- Datos de Prueba - Modulo Stock y Venta
-- Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- Generado: 2026-03-01
-- Prerequisito: 04_test_data_clinica.sql debe ejecutarse antes.
--   Empleados ids: 2-6 | Personas (clientes) ids: 7-51
-- ============================================================================

-- ============================================================================
-- Modulo: Stock - Producto Categoria (ya cargadas en 04_data_modulo_venta.sql)
--   1=Medicamentos | 2=Alimentos | 3=Accesorios | 4=Higiene
-- ============================================================================

-- ============================================================================
-- Modulo: Stock - Producto (50 registros | ids 1-50)
-- ============================================================================

INSERT INTO producto (id, nombre, descripcion, codigo, codigo_interno, precio_venta, precio_costo, stock_actual, stock_minimo, id_categoria, activo) VALUES
-- Medicamentos (categoria id=1 | ids 1-15)
(1,  'Amoxicilina 250mg x24 comp.',         'Antibiótico de amplio espectro para uso veterinario',                  'AMX-250-24',  'MED-001', 1200.00,  600.00,  80, 20, 1, true),
(2,  'Metronidazol 500mg x20 comp.',         'Antiprotozoario y antibacteriano de amplio espectro',                  'MTZ-500-20',  'MED-002',  950.00,  450.00,  60, 15, 1, true),
(3,  'Ivermectina 1% Solución 50ml',          'Antiparasitario interno y externo de amplio espectro',                 'IVR-1-50',    'MED-003', 2200.00, 1100.00,  40, 10, 1, true),
(4,  'Dexametasona 2mg x20 comp.',           'Corticosteroide antiinflamatorio para uso sistémico',                  'DXM-2-20',    'MED-004', 1500.00,  750.00,  50, 15, 1, true),
(5,  'Furosemida 40mg x20 comp.',            'Diurético de asa para tratamiento cardíaco y renal',                   'FRS-40-20',   'MED-005', 1100.00,  500.00,  45, 10, 1, true),
(6,  'Enalapril 5mg x30 comp.',              'IECA para manejo de insuficiencia cardíaca y renal',                   'ENL-5-30',    'MED-006', 1300.00,  650.00,  55, 15, 1, true),
(7,  'Tramadol 50mg x20 comp.',              'Analgésico opioide para dolor moderado a severo',                      'TRM-50-20',   'MED-007', 1800.00,  900.00,  35, 10, 1, true),
(8,  'Cefalexina 500mg x12 comp.',           'Antibiótico cefalosporínico de primera generación',                    'CFX-500-12',  'MED-008', 1400.00,  700.00,  60, 15, 1, true),
(9,  'Prednisolona 20mg x20 comp.',          'Corticosteroide antiinflamatorio e inmunosupresor',                    'PRD-20-20',   'MED-009', 1600.00,  800.00,  40, 10, 1, true),
(10, 'Omeprazol 20mg x14 comp.',             'Inhibidor de bomba de protones, gastroprotector',                      'OMP-20-14',   'MED-010', 1050.00,  500.00,  70, 20, 1, true),
(11, 'Ranitidina 150mg x20 comp.',           'Antiulceroso, antagonista H2 para gastroprotección',                   'RNT-150-20',  'MED-011',  900.00,  400.00,  65, 20, 1, true),
(12, 'Ciprofloxacina 500mg x20 comp.',       'Antibiótico fluoroquinolónico de amplio espectro',                     'CPX-500-20',  'MED-012', 1700.00,  850.00,  45, 10, 1, true),
(13, 'Fluconazol 150mg x4 comp.',            'Antifúngico sistémico para micosis superficiales y profundas',         'FCZ-150-4',   'MED-013', 2100.00, 1050.00,  30,  8, 1, true),
(14, 'Ketoconazol Shampoo Dermatológico 200ml', 'Shampoo antimicótico y antibacteriano dermatológico',              'KTZ-SH-200',  'MED-014', 2800.00, 1400.00,  25,  8, 1, true),
(15, 'Ciclosporina 25mg x30 comp.',          'Inmunosupresor indicado para dermatitis atópica crónica',              'CCS-25-30',   'MED-015', 3500.00, 1750.00,  20,  5, 1, true),
-- Alimentos (categoria id=2 | ids 16-28)
(16, 'Royal Canin Mini Adult 3kg',           'Alimento balanceado para razas pequeñas adultas',                      'RC-MA-3K',    'ALI-001', 4500.00, 3000.00,  30, 10, 2, true),
(17, 'Royal Canin Large Adult 15kg',         'Alimento balanceado para razas grandes adultas',                       'RC-LA-15K',   'ALI-002',18000.00,12000.00,  15,  5, 2, true),
(18, 'Pro Plan Puppy Large Breed 15kg',      'Alimento para cachorros de razas grandes con DHA',                     'PP-PU-15K',   'ALI-003',16500.00,11000.00,  12,  4, 2, true),
(19, 'Hills Science Diet Cat Adult 4kg',     'Nutrición clínica avanzada para gatos adultos',                        'HS-CA-4K',    'ALI-004', 8500.00, 5500.00,  20,  6, 2, true),
(20, 'Pedigree Adulto Razas Grandes 21kg',   'Alimento completo para perros adultos de razas grandes',               'PD-RG-21K',   'ALI-005',14000.00, 9000.00,  10,  3, 2, true),
(21, 'Fancy Feast Clásico Lata 85g',         'Alimento húmedo premium para gatos adultos',                           'FF-CL-85',    'ALI-006',  650.00,  350.00, 100, 30, 2, true),
(22, 'Whiskas Bolsita Adulto 85g',           'Alimentación húmeda en sobre para gatos adultos',                      'WH-BO-85',    'ALI-007',  580.00,  300.00, 120, 40, 2, true),
(23, 'Purina ONE Gato Adulto 7.5kg',         'Alimento seco completo con proteína real para gatos',                  'PO-GA-75',    'ALI-008',12000.00, 8000.00,  18,  5, 2, true),
(24, 'Dog Chow Adulto Razas Grandes 17kg',   'Alimento seco para perros adultos de razas grandes',                   'DC-RG-17K',   'ALI-009',15500.00,10000.00,  10,  3, 2, true),
(25, 'Eukanuba Puppy Small Breed 3kg',       'Alimento para cachorros de razas pequeñas y miniatura',                'EK-PS-3K',    'ALI-010', 5200.00, 3500.00,  25,  8, 2, true),
(26, 'Pedigree Dentastix Large x7u',         'Snack dental para perros grandes, limpieza diaria',                    'PD-DL-7U',    'ALI-011', 1200.00,  700.00,  60, 20, 2, true),
(27, 'Pedigree Rodeo Sabor Vacuno 70g',      'Snack enrollado sabor vacuno para perros adultos',                     'PD-RO-70',    'ALI-012',  850.00,  450.00,  80, 25, 2, true),
(28, 'Hills Prescription Diet c/d Felino 4kg','Dieta urológica para gatos con problemas urinarios',                 'HP-CD-4K',    'ALI-013',10500.00, 7000.00,  15,  5, 2, true),
-- Accesorios (categoria id=3 | ids 29-40)
(29, 'Correa Retráctil Flexi 5m',            'Correa retráctil para perros de hasta 25kg',                           'FL-RE-5M',    'ACC-001', 3500.00, 1800.00,  20,  5, 3, true),
(30, 'Collar Ajustable Nylon Talla M',       'Collar resistente con cierre de seguridad y regulación',               'CO-NY-M',     'ACC-002', 1200.00,  600.00,  35, 10, 3, true),
(31, 'Collar Antipulgas Seresto 70cm',       'Protección contra pulgas y garrapatas por 8 meses',                    'SE-AP-70',    'ACC-003', 6500.00, 3500.00,  15,  5, 3, true),
(32, 'Cama Circular Peluche Talla L',        'Cama suave y lavable para perros medianos y grandes',                  'CB-CI-L',     'ACC-004', 4800.00, 2500.00,  12,  4, 3, true),
(33, 'Kong Classic Juguete Relleable M',     'Juguete de goma resistente para estimulación mental',                  'KG-CL-M',     'ACC-005', 2200.00, 1100.00,  25,  8, 3, true),
(34, 'Comedero Automático Programable 6L',   'Dispensador programable de alimento seco con pantalla',                'CM-AU-6L',    'ACC-006', 8500.00, 4500.00,   8,  3, 3, true),
(35, 'Bebedero Fuente con Filtro 2L',        'Fuente de agua con filtro para gatos y perros pequeños',               'BE-FU-2L',    'ACC-007', 5500.00, 2800.00,  10,  3, 3, true),
(36, 'Transportín Plástico IATA Mediano',    'Transportín aprobado para vuelos, certificación IATA talla M',         'TR-PL-M',     'ACC-008', 9800.00, 5200.00,   8,  3, 3, true),
(37, 'Ropa Impermeable Talla S',             'Rompevientos impermeable para perros talla S',                         'RO-IM-S',     'ACC-009', 2800.00, 1400.00,  18,  5, 3, true),
(38, 'Arnés Regulable Nylon Talla M',        'Arnés antipull con refuerzo en pecho, regulable en 4 puntos',          'AR-RE-M',     'ACC-010', 2500.00, 1200.00,  22,  8, 3, true),
(39, 'Pelota de Tenis Natural x3u',          'Set de 3 pelotas de tenis de tamaño estándar para perros',             'PE-TE-3U',    'ACC-011',  950.00,  450.00,  40, 12, 3, true),
(40, 'Pipeta Antipulgas Advantage Plus M',   'Pipeta antiparasitaria tópica de uso mensual para perros medianos',    'AD-AP-M',     'ACC-012', 2100.00, 1100.00,  30, 10, 3, true),
-- Higiene (categoria id=4 | ids 41-50)
(41, 'Shampoo Neutro Avena 500ml',           'Shampoo suave con avena para piel sensible y cachorros',               'SH-NE-500',   'HIG-001', 1800.00,  900.00,  40, 12, 4, true),
(42, 'Shampoo Medicado Clorhexidina 250ml',  'Shampoo dermatológico antibacteriano y antifúngico',                   'SH-ME-250',   'HIG-002', 2500.00, 1200.00,  30,  8, 4, true),
(43, 'Acondicionador Canino Aloe 500ml',     'Acondicionador desenredante con aloe vera para pelo largo',             'AC-CA-500',   'HIG-003', 1600.00,  800.00,  35, 10, 4, true),
(44, 'Toallitas Húmedas Hipoalergénicas x20u','Toallitas sin enjuague para limpieza diaria y patas',                 'TO-HU-20',    'HIG-004',  900.00,  450.00,  60, 20, 4, true),
(45, 'Cepillo Deslanador FURminator Talla M','Cepillo reductor de pelo suelto para pelaje largo y doble capa',       'CP-FU-M',     'HIG-005', 5500.00, 2800.00,  12,  4, 4, true),
(46, 'Cepillo de Dientes Canino Doble',      'Cepillo dental de doble cabezal para diferentes zonas bucales',        'CP-DE-CA',    'HIG-006',  800.00,  400.00,  50, 15, 4, true),
(47, 'Pasta Dental Canina Sabor Pollo',      'Dentífrico enzimático de uso diario, sabor pollo, sin flúor',          'PA-DE-CA',    'HIG-007', 1200.00,  600.00,  45, 15, 4, true),
(48, 'Lima Cortauñas Eléctrica Veterinaria', 'Dremel de precisión para recorte de uñas sin estrés',                  'LI-EL-VE',    'HIG-008', 4200.00, 2100.00,  10,  3, 4, true),
(49, 'Desodorante Ambiental Mascotas 500ml', 'Neutralizador enzimático de olores para el hogar con mascotas',        'DE-AM-500',   'HIG-009', 1500.00,  750.00,  35, 10, 4, true),
(50, 'Arena Sanitaria Bentonita Felina 6kg', 'Arena aglomerante de alta absorción con control de olor para gatos',   'AR-SA-6K',    'HIG-010', 2800.00, 1500.00,  50, 15, 4, true);

SELECT setval('producto_id_seq', 50);

-- ============================================================================
-- Modulo: Stock - Servicio (15 registros | ids 1-15)
-- ============================================================================

INSERT INTO servicio (id, nombre, descripcion, codigo_interno, precio, duracion_minutos, activo) VALUES
(1,  'Consulta General',              'Consulta veterinaria de rutina con examen físico completo',            'SRV-001',  3500.00,  30, true),
(2,  'Consulta de Urgencia',          'Atención prioritaria fuera de horario o sin turno previo',             'SRV-002',  6000.00,  30, true),
(3,  'Vacunación Simple',             'Aplicación de una vacuna con registro en cartilla sanitaria',          'SRV-003',  2000.00,  15, true),
(4,  'Vacunación Completa',           'Plan completo de vacunación con múltiples dosis en un mismo acto',    'SRV-004',  3500.00,  20, true),
(5,  'Desparasitación Interna',       'Tratamiento antiparasitario intestinal con medicamento incluido',     'SRV-005',  1500.00,  15, true),
(6,  'Desparasitación Externa',       'Tratamiento antiparasitario externo con pipeta o baño medicado',     'SRV-006',  1500.00,  15, true),
(7,  'Castración Canino Macho',       'Orquiectomía bilateral en canino macho bajo anestesia general',      'SRV-007', 18000.00,  90, true),
(8,  'Castración Canino Hembra',      'Ovariohisterectomía en canino hembra bajo anestesia general',        'SRV-008', 22000.00, 120, true),
(9,  'Castración Felino Macho',       'Orquiectomía bilateral en felino macho bajo anestesia breve',        'SRV-009', 12000.00,  60, true),
(10, 'Castración Felino Hembra',      'Ovariohisterectomía en felino hembra bajo anestesia general',        'SRV-010', 15000.00,  75, true),
(11, 'Limpieza Dental Ultrasónica',   'Profilaxis dental con ultrasonido bajo anestesia y polishing',       'SRV-011',  8500.00,  45, true),
(12, 'Ecografía Abdominal',           'Estudio ecográfico del abdomen con informe detallado incluido',      'SRV-012',  9000.00,  30, true),
(13, 'Análisis de Laboratorio',       'Hemograma completo y perfil bioquímico sérico',                      'SRV-013',  5500.00,  20, true),
(14, 'Certificado Sanitario',         'Emisión de certificado oficial para viajes o trámites legales',      'SRV-014',  2500.00,  15, true),
(15, 'Peluquería Canina Estándar',    'Baño, secado, corte de pelo, limpieza de oídos y uñas',             'SRV-015',  4500.00,  60, true);

SELECT setval('servicio_id_seq', 15);

-- ============================================================================
-- Modulo: Stock - Movimiento Stock (70 registros)
-- Empleados:
--   id=5 afernandez: GESTOR_INVENTARIO (compras y ajustes)
--   id=4 lmartinez:  CAJERO (devoluciones y correcciones menores)
-- Tipos: 1=Compra | 2=Egreso Venta | 3=Ajuste + | 4=Ajuste - | 5=Dev. Cliente
-- ============================================================================

INSERT INTO movimiento_stock (fecha, cantidad, observaciones, id_producto, id_movimiento_tipo, id_empleado) VALUES
-- Compras a Proveedor - Enero 2024 | OC-001 FarmVet SA (tipo 1)
('2026-01-02 09:00:00-03', 100, 'OC-001. Proveedor: FarmVet SA. Lote: LT-240120-A.',          1,  1, 5),
('2026-01-02 09:00:00-03',  80, 'OC-001. Proveedor: FarmVet SA. Lote: LT-240120-A.',          2,  1, 5),
('2026-01-02 09:00:00-03',  60, 'OC-001. Proveedor: FarmVet SA. Lote: LT-240120-A.',          3,  1, 5),
('2026-01-02 09:00:00-03',  70, 'OC-001. Proveedor: FarmVet SA. Lote: LT-240120-A.',          4,  1, 5),
('2026-01-02 09:00:00-03',  60, 'OC-001. Proveedor: FarmVet SA. Lote: LT-240120-A.',          5,  1, 5),
-- Compras a Proveedor - Enero 2024 | OC-002 AlimMascota SRL (tipo 1)
('2026-01-02 09:30:00-03',  40, 'OC-002. Proveedor: AlimMascota SRL. Lote: LT-240122-B.',    16,  1, 5),
('2026-01-02 09:30:00-03',  20, 'OC-002. Proveedor: AlimMascota SRL. Lote: LT-240122-B.',    17,  1, 5),
('2026-01-02 09:30:00-03',  18, 'OC-002. Proveedor: AlimMascota SRL. Lote: LT-240122-B.',    18,  1, 5),
('2026-01-02 09:30:00-03',  30, 'OC-002. Proveedor: AlimMascota SRL. Lote: LT-240122-B.',    19,  1, 5),
('2026-01-02 09:30:00-03', 150, 'OC-002. Proveedor: AlimMascota SRL. Lote: LT-240122-B.',    21,  1, 5),
-- Compras a Proveedor - Febrero 2024 | OC-003 FarmVet SA (tipo 1)
('2026-01-03 10:00:00-03',  80, 'OC-003. Proveedor: FarmVet SA. Lote: LT-240205-C.',          6,  1, 5),
('2026-01-03 10:00:00-03',  50, 'OC-003. Proveedor: FarmVet SA. Lote: LT-240205-C.',          7,  1, 5),
('2026-01-03 10:00:00-03',  80, 'OC-003. Proveedor: FarmVet SA. Lote: LT-240205-C.',          8,  1, 5),
('2026-01-03 10:00:00-03',  60, 'OC-003. Proveedor: FarmVet SA. Lote: LT-240205-C.',          9,  1, 5),
('2026-01-03 10:00:00-03',  90, 'OC-003. Proveedor: FarmVet SA. Lote: LT-240205-C.',         10,  1, 5),
-- Compras a Proveedor - Febrero 2024 | OC-004 AccMascotas SA (tipo 1)
('2026-01-04 10:00:00-03',  30, 'OC-004. Proveedor: AccMascotas SA. Lote: LT-240210-D.',     29,  1, 5),
('2026-01-04 10:00:00-03',  50, 'OC-004. Proveedor: AccMascotas SA. Lote: LT-240210-D.',     30,  1, 5),
('2026-01-04 10:00:00-03',  20, 'OC-004. Proveedor: AccMascotas SA. Lote: LT-240210-D.',     31,  1, 5),
('2026-01-04 10:00:00-03',  20, 'OC-004. Proveedor: AccMascotas SA. Lote: LT-240210-D.',     32,  1, 5),
('2026-01-04 10:00:00-03',  40, 'OC-004. Proveedor: AccMascotas SA. Lote: LT-240210-D.',     33,  1, 5),
-- Compras a Proveedor - Abril 2024 | OC-005 FarmVet SA (tipo 1)
('2026-01-08 09:00:00-03',  90, 'OC-005. Proveedor: FarmVet SA. Lote: LT-240403-E.',         11,  1, 5),
('2026-01-08 09:00:00-03',  60, 'OC-005. Proveedor: FarmVet SA. Lote: LT-240403-E.',         12,  1, 5),
('2026-01-08 09:00:00-03',  45, 'OC-005. Proveedor: FarmVet SA. Lote: LT-240403-E.',         13,  1, 5),
('2026-01-08 09:00:00-03',  35, 'OC-005. Proveedor: FarmVet SA. Lote: LT-240403-E.',         14,  1, 5),
('2026-01-08 09:00:00-03',  30, 'OC-005. Proveedor: FarmVet SA. Lote: LT-240403-E.',         15,  1, 5),
-- Compras a Proveedor - Abril 2024 | OC-006 HigieneMascotas SRL (tipo 1)
('2026-01-08 09:30:00-03',  60, 'OC-006. Proveedor: HigieneMascotas SRL. Lote: LT-240405-F.',41,  1, 5),
('2026-01-08 09:30:00-03',  45, 'OC-006. Proveedor: HigieneMascotas SRL. Lote: LT-240405-F.',42,  1, 5),
('2026-01-08 09:30:00-03',  50, 'OC-006. Proveedor: HigieneMascotas SRL. Lote: LT-240405-F.',43,  1, 5),
('2026-01-08 09:30:00-03',  80, 'OC-006. Proveedor: HigieneMascotas SRL. Lote: LT-240405-F.',44,  1, 5),
('2026-01-08 09:30:00-03',  20, 'OC-006. Proveedor: HigieneMascotas SRL. Lote: LT-240405-F.',45,  1, 5),
-- Compras a Proveedor - Julio 2024 | OC-007 AlimMascota SRL (tipo 1)
('2026-01-15 09:00:00-03', 150, 'OC-007. Proveedor: AlimMascota SRL. Lote: LT-240708-G.',    22,  1, 5),
('2026-01-15 09:00:00-03', 100, 'OC-007. Proveedor: AlimMascota SRL. Lote: LT-240708-G.',    26,  1, 5),
('2026-01-15 09:00:00-03', 120, 'OC-007. Proveedor: AlimMascota SRL. Lote: LT-240708-G.',    27,  1, 5),
('2026-01-15 09:00:00-03',  25, 'OC-007. Proveedor: AlimMascota SRL. Lote: LT-240708-G.',    28,  1, 5),
('2026-01-15 09:00:00-03',  35, 'OC-007. Proveedor: AlimMascota SRL. Lote: LT-240708-G.',    25,  1, 5),
-- Compras a Proveedor - Octubre 2024 | OC-008 HigieneMascotas SRL (tipo 1)
('2026-01-23 09:00:00-03',  70, 'OC-008. Proveedor: HigieneMascotas SRL. Lote: LT-241010-H.',46,  1, 5),
('2026-01-23 09:00:00-03',  65, 'OC-008. Proveedor: HigieneMascotas SRL. Lote: LT-241010-H.',47,  1, 5),
('2026-01-23 09:00:00-03',  15, 'OC-008. Proveedor: HigieneMascotas SRL. Lote: LT-241010-H.',48,  1, 5),
('2026-01-23 09:00:00-03',  50, 'OC-008. Proveedor: HigieneMascotas SRL. Lote: LT-241010-H.',49,  1, 5),
('2026-01-23 09:00:00-03',  70, 'OC-008. Proveedor: HigieneMascotas SRL. Lote: LT-241010-H.',50,  1, 5),
-- Compras a Proveedor - Enero 2025 | OC-009 FarmVet SA - Reposición (tipo 1)
('2026-01-31 09:00:00-03',  50, 'OC-009. Proveedor: FarmVet SA. Reposición stock mínimo.',    1,  1, 5),
('2026-01-31 09:00:00-03',  40, 'OC-009. Proveedor: FarmVet SA. Reposición stock mínimo.',    2,  1, 5),
('2026-01-31 09:00:00-03',  20, 'OC-009. Proveedor: FarmVet SA. Reposición stock mínimo.',    3,  1, 5),
-- Compras a Proveedor - Mayo 2025 | OC-010 AccMascotas SA (tipo 1)
('2026-02-10 09:00:00-03',  15, 'OC-010. Proveedor: AccMascotas SA. Lote: LT-250508-I.',     34,  1, 5),
('2026-02-10 09:00:00-03',  15, 'OC-010. Proveedor: AccMascotas SA. Lote: LT-250508-I.',     35,  1, 5),
('2026-02-10 09:00:00-03',  10, 'OC-010. Proveedor: AccMascotas SA. Lote: LT-250508-I.',     36,  1, 5),
('2026-02-10 09:00:00-03',  25, 'OC-010. Proveedor: AccMascotas SA. Lote: LT-250508-I.',     38,  1, 5),
('2026-02-10 09:00:00-03',  55, 'OC-010. Proveedor: AccMascotas SA. Lote: LT-250508-I.',     40,  1, 5),
-- Compras a Proveedor - Noviembre 2025 | OC-011 AlimMascota SRL (tipo 1)
('2026-02-23 09:00:00-03',  20, 'OC-011. Proveedor: AlimMascota SRL. Lote: LT-251112-J.',    20,  1, 5),
('2026-02-23 09:00:00-03',  15, 'OC-011. Proveedor: AlimMascota SRL. Lote: LT-251112-J.',    24,  1, 5),
('2026-02-23 09:00:00-03',  20, 'OC-011. Proveedor: AlimMascota SRL. Lote: LT-251112-J.',    23,  1, 5),
-- Ajustes Positivos (tipo 3)
('2026-01-14 11:00:00-03',   5, 'Ajuste +. Recuento semestral. Unidades no registradas.',    11,  3, 5),
('2026-01-22 10:30:00-03',   3, 'Ajuste +. Unidades halladas en depósito sin remito.',       26,  3, 5),
('2026-02-04 11:00:00-03',   2, 'Ajuste +. Devolución proveedor sin nota de crédito.',        7,  3, 5),
('2026-02-13 10:00:00-03',   4, 'Ajuste +. Recuento semestral. Diferencia positiva.',        44,  3, 5),
('2026-02-20 11:30:00-03',   3, 'Ajuste +. Unidades halladas en depósito sin remito.',       50,  3, 5),
-- Ajustes Negativos (tipo 4)
('2026-02-26 16:00:00-03',   3, 'Ajuste -. Medicamentos vencidos retirados de estante.',      4,  4, 5),
('2026-01-18 15:00:00-03',   2, 'Ajuste -. Producto dañado en almacenamiento.',              32,  4, 5),
('2026-01-28 14:30:00-03',   4, 'Ajuste -. Rotura accidental durante inventario.',           39,  4, 5),
('2026-02-27 16:00:00-03',   1, 'Ajuste -. Medicamento vencido retirado.',                  13,  4, 5),
('2026-02-16 15:30:00-03',   5, 'Ajuste -. Alimento vencido retirado de góndola.',           22,  4, 5),
-- Devoluciones de Cliente (tipo 5)
('2026-01-20 10:00:00-03',   1, 'Dev. cliente. Producto defectuoso. Aprobado por supervisor.',33,  5, 4),
('2026-01-25 11:00:00-03',   1, 'Dev. cliente. Error de pedido. Cambio de talla.',           30,  5, 4),
('2026-01-30 10:30:00-03',   1, 'Dev. cliente. Producto sin abrir. Dentro de plazo.',        41,  5, 4),
('2026-02-08 09:30:00-03',   2, 'Dev. cliente. Cambio de dieta indicado por veterinario.',   21,  5, 4),
('2026-02-18 11:30:00-03',   1, 'Dev. cliente. Lata abollada. Reemplazada por unidad nueva.',21,  5, 4),
-- Egresos por Venta - Correcciones manuales (tipo 2)
('2026-01-16 12:00:00-03',  10, 'Corrección manual. Egreso stock post-venta Jul-2024.',      26,  2, 5),
('2026-01-24 12:00:00-03',   8, 'Corrección manual. Egreso stock post-venta Oct-2024.',      22,  2, 5),
('2026-01-30 17:00:00-03',   5, 'Corrección manual. Egreso stock post-venta Dic-2024.',      41,  2, 5),
('2026-02-06 17:00:00-03',   4, 'Corrección manual. Egreso stock post-venta Mar-2025.',      50,  2, 5),
('2026-02-14 17:00:00-03',   6, 'Corrección manual. Egreso stock post-venta Jun-2025.',      21,  2, 5);

-- ============================================================================
-- Modulo: Venta (100 registros | ids 1-100)
-- Empleado cajero: id=4 (lmartinez) | Apoyo: id=2 (crodriguez)
-- Clientes: personas ids 7-51 | NULL = venta sin cliente identificado
-- Estado: 1=Pendiente | 2=Completada | 3=Cancelada
-- Ventas  1- 85: Completadas
-- Ventas 86- 90: Pendientes
-- Ventas 91-100: Canceladas
-- ============================================================================

INSERT INTO venta (id, fecha, subtotal, monto_ajuste_redondeo, total_final, id_cliente, id_empleado, id_estado) VALUES
-- *** VENTAS COMPLETADAS (1-85) ***
-- Ventas de Productos - Enero a Agosto 2024 (ids 1-40)
(1,  '2026-01-01 10:30:00-03',  4200.00, 0.00,  4200.00,  7,  4, 2),
(2,  '2026-01-01 11:00:00-03',  4500.00, 0.00,  4500.00,  8,  4, 2),
(3,  '2026-01-02 09:45:00-03',  2250.00, 0.00,  2250.00,  9,  4, 2),
(4,  '2026-01-03 10:15:00-03',  1950.00, 0.00,  1950.00, 10,  4, 2),
(5,  '2026-01-04 11:30:00-03',  3050.00, 0.00,  3050.00, 11,  4, 2),
(6,  '2026-01-04 09:00:00-03',  3500.00, 0.00,  3500.00, 12,  4, 2),
(7,  '2026-01-05 10:45:00-03',  5600.00, 0.00,  5600.00, 13,  4, 2),
(8,  '2026-01-05 11:00:00-03',  2320.00, 0.00,  2320.00, 14,  4, 2),
(9,  '2026-01-06 10:30:00-03', 18000.00, 0.00, 18000.00, 15,  4, 2),
(10, '2026-01-06 09:15:00-03',  6500.00, 0.00,  6500.00, 16,  4, 2),
(11, '2026-01-07 11:45:00-03',  4400.00, 0.00,  4400.00, 17,  4, 2),
(12, '2026-01-07 10:00:00-03',  2350.00, 0.00,  2350.00, 18,  4, 2),
(13, '2026-01-09 09:30:00-03',  8500.00, 0.00,  8500.00, 19,  4, 2),
(14, '2026-01-09 11:15:00-03',  7600.00, 0.00,  7600.00, 20,  4, 2),
(15, '2026-01-10 10:00:00-03',  5200.00, 0.00,  5200.00, 21,  4, 2),
(16, '2026-01-10 09:45:00-03',  2200.00, 0.00,  2200.00, 22,  4, 2),
(17, '2026-01-11 11:00:00-03',  4100.00, 0.00,  4100.00, 23,  4, 2),
(18, '2026-01-11 10:30:00-03',  2800.00, 0.00,  2800.00, 24,  4, 2),
(19, '2026-02-26 09:00:00-03',  2400.00, 0.00,  2400.00, 25,  4, 2),
(20, '2026-02-26 11:15:00-03',  3100.00, 0.00,  3100.00, 26,  4, 2),
(21, '2026-01-13 10:00:00-03', 16500.00, 0.00, 16500.00, 27,  4, 2),
(22, '2026-01-13 09:30:00-03',  5500.00, 0.00,  5500.00, 28,  4, 2),
(23, '2026-01-14 11:00:00-03', 12000.00, 0.00, 12000.00, 29,  4, 2),
(24, '2026-01-15 10:15:00-03',  3700.00, 0.00,  3700.00, 30,  4, 2),
(25, '2026-01-15 09:45:00-03',  2550.00, 0.00,  2550.00, 31,  4, 2),
(26, '2026-01-15 11:30:00-03',  4400.00, 0.00,  4400.00, 32,  4, 2),
(27, '2026-01-16 10:00:00-03',  2000.00, 0.00,  2000.00, 33,  4, 2),
(28, '2026-01-17 09:15:00-03',  4200.00, 0.00,  4200.00, 34,  4, 2),
(29, '2026-01-17 11:00:00-03',  3900.00, 0.00,  3900.00, 35,  4, 2),
(30, '2026-01-18 10:30:00-03',  9800.00, 0.00,  9800.00, 36,  4, 2),
(31, '2026-01-18 09:45:00-03',  4900.00, 0.00,  4900.00, 37,  4, 2),
(32, '2026-02-26 11:15:00-03',  3000.00, 0.00,  3000.00, 38,  4, 2),
(33, '2026-02-26 10:00:00-03', 15500.00, 0.00, 15500.00, 39,  4, 2),
(34, '2026-01-20 09:30:00-03',  3700.00, 0.00,  3700.00, 40,  4, 2),
(35, '2026-01-20 11:00:00-03',  1800.00, 0.00,  1800.00, 41,  4, 2),
(36, '2026-01-21 10:15:00-03', 10500.00, 0.00, 10500.00, 42,  4, 2),
(37, '2026-01-21 09:45:00-03',  3500.00, 0.00,  3500.00, 43,  4, 2),
(38, '2026-01-22 11:30:00-03',  3600.00, 0.00,  3600.00, 44,  4, 2),
(39, '2026-01-23 10:00:00-03',  4800.00, 0.00,  4800.00, 45,  4, 2),
(40, '2026-01-23 09:15:00-03', 14000.00, 0.00, 14000.00, 46,  4, 2),
-- Ventas de Servicios - Septiembre 2024 a Diciembre 2024 (ids 41-60)
(41, '2026-01-24 10:30:00-03',  3500.00, 0.00,  3500.00, 47,  4, 2),
(42, '2026-01-25 11:00:00-03',  6000.00, 0.00,  6000.00, 48,  4, 2),
(43, '2026-02-27 09:00:00-03',  2000.00, 0.00,  2000.00, 49,  4, 2),
(44, '2026-02-27 10:15:00-03',  1500.00, 0.00,  1500.00, 50,  4, 2),
(45, '2026-01-27 11:30:00-03', 18000.00, 0.00, 18000.00, 51,  4, 2),
(46, '2026-01-27 09:45:00-03', 12000.00, 0.00, 12000.00,  7,  4, 2),
(47, '2026-01-28 10:00:00-03',  8500.00, 0.00,  8500.00,  8,  4, 2),
(48, '2026-01-29 11:15:00-03',  9000.00, 0.00,  9000.00,  9,  4, 2),
(49, '2026-01-29 09:30:00-03',  4500.00, 0.00,  4500.00, 10,  4, 2),
(50, '2026-01-30 10:45:00-03',  3500.00, 0.00,  3500.00, 11,  4, 2),
(51, '2026-01-30 09:00:00-03',  3500.00, 0.00,  3500.00, 12,  4, 2),
(52, '2026-01-31 10:30:00-03',  1500.00, 0.00,  1500.00, 13,  4, 2),
(53, '2026-01-31 11:00:00-03',  5500.00, 0.00,  5500.00, 14,  4, 2),
(54, '2026-02-01 09:15:00-03', 22000.00, 0.00, 22000.00, 15,  4, 2),
(55, '2026-02-01 10:45:00-03',  2500.00, 0.00,  2500.00, 16,  4, 2),
(56, '2026-02-27 11:00:00-03', 15000.00, 0.00, 15000.00, 17,  4, 2),
(57, '2026-02-03 09:30:00-03',  4500.00, 0.00,  4500.00, 18,  4, 2),
(58, '2026-02-03 10:15:00-03',  3500.00, 0.00,  3500.00, 19,  4, 2),
(59, '2026-02-04 11:30:00-03',  2000.00, 0.00,  2000.00, 20,  4, 2),
(60, '2026-02-05 09:45:00-03',  8500.00, 0.00,  8500.00, 21,  4, 2),
-- Ventas de Servicios - Enero 2025 a Junio 2025 (ids 61-70)
(61, '2026-02-05 10:00:00-03',  6000.00, 0.00,  6000.00, 22,  4, 2),
(62, '2026-02-06 11:15:00-03',  1500.00, 0.00,  1500.00, 23,  4, 2),
(63, '2026-02-07 09:30:00-03',  9000.00, 0.00,  9000.00, 24,  4, 2),
(64, '2026-02-07 10:45:00-03', 18000.00, 0.00, 18000.00, 25,  4, 2),
(65, '2026-02-08 11:00:00-03',  3500.00, 0.00,  3500.00, 26,  4, 2),
(66, '2026-02-28 09:15:00-03',  5500.00, 0.00,  5500.00, 27,  4, 2),
(67, '2026-02-28 10:30:00-03', 12000.00, 0.00, 12000.00, 28,  4, 2),
(68, '2026-02-10 11:45:00-03',  4500.00, 0.00,  4500.00, 29,  4, 2),
(69, '2026-02-11 09:00:00-03',  2500.00, 0.00,  2500.00, 30,  4, 2),
(70, '2026-02-11 10:15:00-03',  3500.00, 0.00,  3500.00, 31,  4, 2),
-- Ventas Mixtas (Producto + Servicio) - Junio 2025 a Noviembre 2025 (ids 71-85)
(71, '2026-02-12 09:30:00-03',  4200.00, 0.00,  4200.00, 32,  4, 2),
(72, '2026-02-12 10:45:00-03',  4550.00, 0.00,  4550.00, 33,  4, 2),
(73, '2026-02-13 11:00:00-03',  3600.00, 0.00,  3600.00, 34,  4, 2),
(74, '2026-02-14 09:15:00-03',  5700.00, 0.00,  5700.00, 35,  4, 2),
(75, '2026-02-14 10:30:00-03',  6400.00, 0.00,  6400.00, 36,  4, 2),
(76, '2026-02-15 11:15:00-03', 11300.00, 0.00, 11300.00, 37,  2, 2),
(77, '2026-02-15 09:45:00-03',  3600.00, 0.00,  3600.00, 38,  4, 2),
(78, '2026-02-16 10:00:00-03',  7200.00, 0.00,  7200.00, 39,  4, 2),
(79, '2026-02-16 11:30:00-03',  5650.00, 0.00,  5650.00, 40,  4, 2),
(80, '2026-02-17 09:00:00-03',  6300.00, 0.00,  6300.00, 41,  4, 2),
(81, '2026-02-17 10:15:00-03',  3100.00, 0.00,  3100.00, 42,  4, 2),
(82, '2026-02-18 11:00:00-03', 10300.00, 0.00, 10300.00, 43,  2, 2),
(83, '2026-02-18 09:30:00-03',  4660.00, 0.00,  4660.00, 44,  4, 2),
(84, '2026-02-19 10:45:00-03',  3300.00, 0.00,  3300.00, 45,  4, 2),
(85, '2026-02-19 11:00:00-03',  7000.00, 0.00,  7000.00, 46,  4, 2),
-- *** VENTAS PENDIENTES (86-90) | id_estado=1 ***
(86, '2026-02-26 10:00:00-03', 18000.00, 0.00, 18000.00, 47,  4, 1),
(87, '2026-02-26 11:15:00-03', 18000.00, 0.00, 18000.00, 48,  4, 1),
(88, '2026-02-27 09:30:00-03',  3500.00, 0.00,  3500.00, 49,  4, 1),
(89, '2026-02-27 10:45:00-03',  9800.00, 0.00,  9800.00, 50,  4, 1),
(90, '2026-02-28 11:00:00-03',  6000.00, 0.00,  6000.00, 51,  4, 1),
-- *** VENTAS CANCELADAS (91-100) | id_estado=3 ***
(91, '2026-02-20 10:00:00-03',  4500.00, 0.00,  4500.00,  7,  4, 3),
(92, '2026-02-21 11:30:00-03',  3500.00, 0.00,  3500.00,  8,  4, 3),
(93, '2026-02-21 09:15:00-03',  2200.00, 0.00,  2200.00,  9,  4, 3),
(94, '2026-02-22 10:30:00-03',  1500.00, 0.00,  1500.00, 10,  4, 3),
(95, '2026-02-22 11:00:00-03',  8500.00, 0.00,  8500.00, 11,  4, 3),
(96, '2026-02-23 09:45:00-03',  4500.00, 0.00,  4500.00, 12,  4, 3),
(97, '2026-02-24 10:15:00-03',  1500.00, 0.00,  1500.00, 13,  4, 3),
(98, '2026-02-24 11:30:00-03',  2000.00, 0.00,  2000.00, 14,  4, 3),
(99, '2026-02-25 09:00:00-03',  3500.00, 0.00,  3500.00, 15,  4, 3),
(100,'2026-02-25 10:30:00-03',  3480.00, 0.00,  3480.00, 16,  4, 3);

SELECT setval('venta_id_seq', 100);

-- ============================================================================
-- Modulo: Venta - Detalle Venta
-- Nota: el campo 'subtotal' es GENERADO automáticamente (ps_precio_unitario * cantidad)
-- Constraint: exactamente uno de id_producto o id_servicio debe ser NOT NULL
-- ============================================================================

INSERT INTO detalle_venta (id_venta, id_producto, id_servicio, ps_nombre, ps_codigo, ps_precio_unitario, cantidad) VALUES
-- Venta 1: Dentastix x2 + Shampoo Neutro x1 = 4200
(1,  26, NULL, 'Pedigree Dentastix Large x7u',         'ALI-011', 1200.00, 2),
(1,  41, NULL, 'Shampoo Neutro Avena 500ml',            'HIG-001', 1800.00, 1),
-- Venta 2: Royal Canin Mini Adult 3kg x1 = 4500
(2,  16, NULL, 'Royal Canin Mini Adult 3kg',            'ALI-001', 4500.00, 1),
-- Venta 3: Amoxicilina x1 + Omeprazol x1 = 2250
(3,   1, NULL, 'Amoxicilina 250mg x24 comp.',           'MED-001', 1200.00, 1),
(3,  10, NULL, 'Omeprazol 20mg x14 comp.',              'MED-010', 1050.00, 1),
-- Venta 4: Fancy Feast x3 = 1950
(4,  21, NULL, 'Fancy Feast Clásico Lata 85g',          'ALI-006',  650.00, 3),
-- Venta 5: Pipeta Antipulgas x1 + Pelotas x1 = 3050
(5,  40, NULL, 'Pipeta Antipulgas Advantage Plus M',    'ACC-012', 2100.00, 1),
(5,  39, NULL, 'Pelota de Tenis Natural x3u',           'ACC-011',  950.00, 1),
-- Venta 6: Correa Retráctil x1 = 3500
(6,  29, NULL, 'Correa Retráctil Flexi 5m',             'ACC-001', 3500.00, 1),
-- Venta 7: Arena Felina x2 = 5600
(7,  50, NULL, 'Arena Sanitaria Bentonita Felina 6kg',  'HIG-010', 2800.00, 2),
-- Venta 8: Whiskas Bolsita x4 = 2320
(8,  22, NULL, 'Whiskas Bolsita Adulto 85g',            'ALI-007',  580.00, 4),
-- Venta 9: Royal Canin Large 15kg x1 = 18000
(9,  17, NULL, 'Royal Canin Large Adult 15kg',          'ALI-002',18000.00, 1),
-- Venta 10: Collar Antipulgas Seresto x1 = 6500
(10, 31, NULL, 'Collar Antipulgas Seresto 70cm',        'ACC-003', 6500.00, 1),
-- Venta 11: Shampoo Neutro x2 + Cepillo Dientes x1 = 4400
(11, 41, NULL, 'Shampoo Neutro Avena 500ml',            'HIG-001', 1800.00, 2),
(11, 46, NULL, 'Cepillo de Dientes Canino Doble',       'HIG-006',  800.00, 1),
-- Venta 12: Metronidazol x1 + Cefalexina x1 = 2350
(12,  2, NULL, 'Metronidazol 500mg x20 comp.',          'MED-002',  950.00, 1),
(12,  8, NULL, 'Cefalexina 500mg x12 comp.',            'MED-008', 1400.00, 1),
-- Venta 13: Hills Science Diet Cat x1 = 8500
(13, 19, NULL, 'Hills Science Diet Cat Adult 4kg',      'ALI-004', 8500.00, 1),
-- Venta 14: Eukanuba Puppy x1 + Dentastix x2 = 7600
(14, 25, NULL, 'Eukanuba Puppy Small Breed 3kg',        'ALI-010', 5200.00, 1),
(14, 26, NULL, 'Pedigree Dentastix Large x7u',          'ALI-011', 1200.00, 2),
-- Venta 15: Shampoo Medicado x1 + Toallitas x3 = 5200
(15, 42, NULL, 'Shampoo Medicado Clorhexidina 250ml',   'HIG-002', 2500.00, 1),
(15, 44, NULL, 'Toallitas Húmedas Hipoalergénicas x20u','HIG-004',  900.00, 3),
-- Venta 16: Ivermectina x1 = 2200
(16,  3, NULL, 'Ivermectina 1% Solución 50ml',          'MED-003', 2200.00, 1),
-- Venta 17: Kong Classic x1 + Pelotas x2 = 4100
(17, 33, NULL, 'Kong Classic Juguete Relleable M',      'ACC-005', 2200.00, 1),
(17, 39, NULL, 'Pelota de Tenis Natural x3u',           'ACC-011',  950.00, 2),
-- Venta 18: Pasta Dental x1 + Cepillo Dientes x2 = 2800
(18, 47, NULL, 'Pasta Dental Canina Sabor Pollo',       'HIG-007', 1200.00, 1),
(18, 46, NULL, 'Cepillo de Dientes Canino Doble',       'HIG-006',  800.00, 2),
-- Venta 19: Collar Nylon x2 = 2400
(19, 30, NULL, 'Collar Ajustable Nylon Talla M',        'ACC-002', 1200.00, 2),
-- Venta 20: Dexametasona x1 + Prednisolona x1 = 3100
(20,  4, NULL, 'Dexametasona 2mg x20 comp.',            'MED-004', 1500.00, 1),
(20,  9, NULL, 'Prednisolona 20mg x20 comp.',           'MED-009', 1600.00, 1),
-- Venta 21: Pro Plan Puppy 15kg x1 = 16500
(21, 18, NULL, 'Pro Plan Puppy Large Breed 15kg',       'ALI-003',16500.00, 1),
-- Venta 22: FURminator x1 = 5500
(22, 45, NULL, 'Cepillo Deslanador FURminator Talla M', 'HIG-005', 5500.00, 1),
-- Venta 23: Purina ONE Gato 7.5kg x1 = 12000
(23, 23, NULL, 'Purina ONE Gato Adulto 7.5kg',          'ALI-008',12000.00, 1),
-- Venta 24: Enalapril x1 + Amoxicilina x2 = 3700
(24,  6, NULL, 'Enalapril 5mg x30 comp.',               'MED-006', 1300.00, 1),
(24,  1, NULL, 'Amoxicilina 250mg x24 comp.',           'MED-001', 1200.00, 2),
-- Venta 25: Pedigree Rodeo x3 = 2550
(25, 27, NULL, 'Pedigree Rodeo Sabor Vacuno 70g',       'ALI-012',  850.00, 3),
-- Venta 26: Ropa Impermeable x1 + Acondicionador x1 = 4400
(26, 37, NULL, 'Ropa Impermeable Talla S',              'ACC-009', 2800.00, 1),
(26, 43, NULL, 'Acondicionador Canino Aloe 500ml',      'HIG-003', 1600.00, 1),
-- Venta 27: Furosemida x1 + Ranitidina x1 = 2000
(27,  5, NULL, 'Furosemida 40mg x20 comp.',             'MED-005', 1100.00, 1),
(27, 11, NULL, 'Ranitidina 150mg x20 comp.',            'MED-011',  900.00, 1),
-- Venta 28: Lima Cortauñas Eléctrica x1 = 4200
(28, 48, NULL, 'Lima Cortauñas Eléctrica Veterinaria',  'HIG-008', 4200.00, 1),
-- Venta 29: Fancy Feast x6 = 3900
(29, 21, NULL, 'Fancy Feast Clásico Lata 85g',          'ALI-006',  650.00, 6),
-- Venta 30: Transportín Mediano x1 = 9800
(30, 36, NULL, 'Transportín Plástico IATA Mediano',     'ACC-008', 9800.00, 1),
-- Venta 31: Fluconazol x1 + Ketoconazol Shampoo x1 = 4900
(31, 13, NULL, 'Fluconazol 150mg x4 comp.',             'MED-013', 2100.00, 1),
(31, 14, NULL, 'Ketoconazol Shampoo Dermatológico 200ml','MED-014',2800.00, 1),
-- Venta 32: Desodorante Ambiental x2 = 3000
(32, 49, NULL, 'Desodorante Ambiental Mascotas 500ml',  'HIG-009', 1500.00, 2),
-- Venta 33: Dog Chow Razas Grandes 17kg x1 = 15500
(33, 24, NULL, 'Dog Chow Adulto Razas Grandes 17kg',    'ALI-009',15500.00, 1),
-- Venta 34: Arnés Regulable x1 + Collar Nylon x1 = 3700
(34, 38, NULL, 'Arnés Regulable Nylon Talla M',         'ACC-010', 2500.00, 1),
(34, 30, NULL, 'Collar Ajustable Nylon Talla M',        'ACC-002', 1200.00, 1),
-- Venta 35: Tramadol x1 = 1800
(35,  7, NULL, 'Tramadol 50mg x20 comp.',               'MED-007', 1800.00, 1),
-- Venta 36: Hills Prescription c/d Felino 4kg x1 = 10500
(36, 28, NULL, 'Hills Prescription Diet c/d Felino 4kg','ALI-013',10500.00, 1),
-- Venta 37: Ciclosporina x1 = 3500
(37, 15, NULL, 'Ciclosporina 25mg x30 comp.',           'MED-015', 3500.00, 1),
-- Venta 38: Ciprofloxacina x1 + Metronidazol x2 = 3600
(38, 12, NULL, 'Ciprofloxacina 500mg x20 comp.',        'MED-012', 1700.00, 1),
(38,  2, NULL, 'Metronidazol 500mg x20 comp.',          'MED-002',  950.00, 2),
-- Venta 39: Cama Circular L x1 = 4800
(39, 32, NULL, 'Cama Circular Peluche Talla L',         'ACC-004', 4800.00, 1),
-- Venta 40: Bebedero Fuente x1 + Comedero Automático x1 = 14000
(40, 35, NULL, 'Bebedero Fuente con Filtro 2L',         'ACC-007', 5500.00, 1),
(40, 34, NULL, 'Comedero Automático Programable 6L',    'ACC-006', 8500.00, 1),
-- Venta 41: Consulta General x1 = 3500
(41, NULL, 1,  'Consulta General',                      'SRV-001', 3500.00, 1),
-- Venta 42: Consulta Urgencia x1 = 6000
(42, NULL, 2,  'Consulta de Urgencia',                  'SRV-002', 6000.00, 1),
-- Venta 43: Vacunación Simple x1 = 2000
(43, NULL, 3,  'Vacunación Simple',                     'SRV-003', 2000.00, 1),
-- Venta 44: Desparasitación Interna x1 = 1500
(44, NULL, 5,  'Desparasitación Interna',               'SRV-005', 1500.00, 1),
-- Venta 45: Castración Canino Macho x1 = 18000
(45, NULL, 7,  'Castración Canino Macho',               'SRV-007',18000.00, 1),
-- Venta 46: Castración Felino Macho x1 = 12000
(46, NULL, 9,  'Castración Felino Macho',               'SRV-009',12000.00, 1),
-- Venta 47: Limpieza Dental x1 = 8500
(47, NULL, 11, 'Limpieza Dental Ultrasónica',           'SRV-011', 8500.00, 1),
-- Venta 48: Ecografía Abdominal x1 = 9000
(48, NULL, 12, 'Ecografía Abdominal',                   'SRV-012', 9000.00, 1),
-- Venta 49: Peluquería Canina x1 = 4500
(49, NULL, 15, 'Peluquería Canina Estándar',            'SRV-015', 4500.00, 1),
-- Venta 50: Consulta General x1 = 3500
(50, NULL, 1,  'Consulta General',                      'SRV-001', 3500.00, 1),
-- Venta 51: Vacunación Completa x1 = 3500
(51, NULL, 4,  'Vacunación Completa',                   'SRV-004', 3500.00, 1),
-- Venta 52: Desparasitación Externa x1 = 1500
(52, NULL, 6,  'Desparasitación Externa',               'SRV-006', 1500.00, 1),
-- Venta 53: Análisis Laboratorio x1 = 5500
(53, NULL, 13, 'Análisis de Laboratorio',               'SRV-013', 5500.00, 1),
-- Venta 54: Castración Canino Hembra x1 = 22000
(54, NULL, 8,  'Castración Canino Hembra',              'SRV-008',22000.00, 1),
-- Venta 55: Certificado Sanitario x1 = 2500
(55, NULL, 14, 'Certificado Sanitario',                 'SRV-014', 2500.00, 1),
-- Venta 56: Castración Felino Hembra x1 = 15000
(56, NULL, 10, 'Castración Felino Hembra',              'SRV-010',15000.00, 1),
-- Venta 57: Peluquería Canina x1 = 4500
(57, NULL, 15, 'Peluquería Canina Estándar',            'SRV-015', 4500.00, 1),
-- Venta 58: Consulta General x1 = 3500
(58, NULL, 1,  'Consulta General',                      'SRV-001', 3500.00, 1),
-- Venta 59: Vacunación Simple x1 = 2000
(59, NULL, 3,  'Vacunación Simple',                     'SRV-003', 2000.00, 1),
-- Venta 60: Limpieza Dental x1 = 8500
(60, NULL, 11, 'Limpieza Dental Ultrasónica',           'SRV-011', 8500.00, 1),
-- Venta 61: Consulta Urgencia x1 = 6000
(61, NULL, 2,  'Consulta de Urgencia',                  'SRV-002', 6000.00, 1),
-- Venta 62: Desparasitación Interna x1 = 1500
(62, NULL, 5,  'Desparasitación Interna',               'SRV-005', 1500.00, 1),
-- Venta 63: Ecografía Abdominal x1 = 9000
(63, NULL, 12, 'Ecografía Abdominal',                   'SRV-012', 9000.00, 1),
-- Venta 64: Castración Canino Macho x1 = 18000
(64, NULL, 7,  'Castración Canino Macho',               'SRV-007',18000.00, 1),
-- Venta 65: Vacunación Completa x1 = 3500
(65, NULL, 4,  'Vacunación Completa',                   'SRV-004', 3500.00, 1),
-- Venta 66: Análisis Laboratorio x1 = 5500
(66, NULL, 13, 'Análisis de Laboratorio',               'SRV-013', 5500.00, 1),
-- Venta 67: Castración Felino Macho x1 = 12000
(67, NULL, 9,  'Castración Felino Macho',               'SRV-009',12000.00, 1),
-- Venta 68: Peluquería Canina x1 = 4500
(68, NULL, 15, 'Peluquería Canina Estándar',            'SRV-015', 4500.00, 1),
-- Venta 69: Certificado Sanitario x1 = 2500
(69, NULL, 14, 'Certificado Sanitario',                 'SRV-014', 2500.00, 1),
-- Venta 70: Consulta General x1 = 3500
(70, NULL, 1,  'Consulta General',                      'SRV-001', 3500.00, 1),
-- Venta 71: Vacunación Simple + Ivermectina = 4200
(71, NULL,  3, 'Vacunación Simple',                     'SRV-003', 2000.00, 1),
(71,   3, NULL, 'Ivermectina 1% Solución 50ml',         'MED-003', 2200.00, 1),
-- Venta 72: Consulta General + Omeprazol = 4550
(72, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
(72,  10, NULL, 'Omeprazol 20mg x14 comp.',             'MED-010', 1050.00, 1),
-- Venta 73: Desparasitación Interna + Pipeta Antipulgas = 3600
(73, NULL,  5, 'Desparasitación Interna',               'SRV-005', 1500.00, 1),
(73,  40, NULL, 'Pipeta Antipulgas Advantage Plus M',   'ACC-012', 2100.00, 1),
-- Venta 74: Vacunación Completa + Furosemida x2 = 5700
(74, NULL,  4, 'Vacunación Completa',                   'SRV-004', 3500.00, 1),
(74,   5, NULL, 'Furosemida 40mg x20 comp.',            'MED-005', 1100.00, 2),
-- Venta 75: Consulta General + Dentastix x1 + Pedigree Rodeo x2 = 6400
(75, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
(75,  26, NULL, 'Pedigree Dentastix Large x7u',         'ALI-011', 1200.00, 1),
(75,  27, NULL, 'Pedigree Rodeo Sabor Vacuno 70g',      'ALI-012',  850.00, 2),
-- Venta 76: Limpieza Dental + Pasta Dental x1 + Cepillo Dientes x2 = 11300
(76, NULL, 11, 'Limpieza Dental Ultrasónica',           'SRV-011', 8500.00, 1),
(76,  47, NULL, 'Pasta Dental Canina Sabor Pollo',      'HIG-007', 1200.00, 1),
(76,  46, NULL, 'Cepillo de Dientes Canino Doble',      'HIG-006',  800.00, 2),
-- Venta 77: Desparasitación Externa + Pipeta Antipulgas = 3600
(77, NULL,  6, 'Desparasitación Externa',               'SRV-006', 1500.00, 1),
(77,  40, NULL, 'Pipeta Antipulgas Advantage Plus M',   'ACC-012', 2100.00, 1),
-- Venta 78: Análisis Laboratorio + Ciprofloxacina = 7200
(78, NULL, 13, 'Análisis de Laboratorio',               'SRV-013', 5500.00, 1),
(78,  12, NULL, 'Ciprofloxacina 500mg x20 comp.',       'MED-012', 1700.00, 1),
-- Venta 79: Consulta General + Amoxicilina x1 + Metronidazol x1 = 5650
(79, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
(79,   1, NULL, 'Amoxicilina 250mg x24 comp.',          'MED-001', 1200.00, 1),
(79,   2, NULL, 'Metronidazol 500mg x20 comp.',         'MED-002',  950.00, 1),
-- Venta 80: Peluquería Canina + Shampoo Neutro = 6300
(80, NULL, 15, 'Peluquería Canina Estándar',            'SRV-015', 4500.00, 1),
(80,  41, NULL, 'Shampoo Neutro Avena 500ml',           'HIG-001', 1800.00, 1),
-- Venta 81: Vacunación Simple + Furosemida x1 = 3100
(81, NULL,  3, 'Vacunación Simple',                     'SRV-003', 2000.00, 1),
(81,   5, NULL, 'Furosemida 40mg x20 comp.',            'MED-005', 1100.00, 1),
-- Venta 82: Ecografía Abdominal + Enalapril = 10300
(82, NULL, 12, 'Ecografía Abdominal',                   'SRV-012', 9000.00, 1),
(82,   6, NULL, 'Enalapril 5mg x30 comp.',              'MED-006', 1300.00, 1),
-- Venta 83: Consulta General + Whiskas x2 = 4660
(83, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
(83,  22, NULL, 'Whiskas Bolsita Adulto 85g',           'ALI-007',  580.00, 2),
-- Venta 84: Desparasitación Interna + Toallitas x2 = 3300
(84, NULL,  5, 'Desparasitación Interna',               'SRV-005', 1500.00, 1),
(84,  44, NULL, 'Toallitas Húmedas Hipoalergénicas x20u','HIG-004',  900.00, 2),
-- Venta 85: Certificado Sanitario + Royal Canin Mini Adult = 7000
(85, NULL, 14, 'Certificado Sanitario',                 'SRV-014', 2500.00, 1),
(85,  16, NULL, 'Royal Canin Mini Adult 3kg',           'ALI-001', 4500.00, 1),
-- Venta 86 (Pendiente): Castración Canino Macho = 18000
(86, NULL,  7, 'Castración Canino Macho',               'SRV-007',18000.00, 1),
-- Venta 87 (Pendiente): Royal Canin Large 15kg = 18000
(87,  17, NULL, 'Royal Canin Large Adult 15kg',         'ALI-002',18000.00, 1),
-- Venta 88 (Pendiente): Consulta General = 3500
(88, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
-- Venta 89 (Pendiente): Transportín Mediano = 9800
(89,  36, NULL, 'Transportín Plástico IATA Mediano',    'ACC-008', 9800.00, 1),
-- Venta 90 (Pendiente): Consulta Urgencia = 6000
(90, NULL,  2, 'Consulta de Urgencia',                  'SRV-002', 6000.00, 1),
-- Ventas 91-100 (Canceladas)
(91,  16, NULL, 'Royal Canin Mini Adult 3kg',           'ALI-001', 4500.00, 1),
(92, NULL,  1, 'Consulta General',                      'SRV-001', 3500.00, 1),
(93,  33, NULL, 'Kong Classic Juguete Relleable M',     'ACC-005', 2200.00, 1),
(94, NULL,  5, 'Desparasitación Interna',               'SRV-005', 1500.00, 1),
(95,  19, NULL, 'Hills Science Diet Cat Adult 4kg',     'ALI-004', 8500.00, 1),
(96, NULL, 15, 'Peluquería Canina Estándar',            'SRV-015', 4500.00, 1),
(97,   4, NULL, 'Dexametasona 2mg x20 comp.',           'MED-004', 1500.00, 1),
(98, NULL,  3, 'Vacunación Simple',                     'SRV-003', 2000.00, 1),
(99,  29, NULL, 'Correa Retráctil Flexi 5m',            'ACC-001', 3500.00, 1),
(100, 22, NULL, 'Whiskas Bolsita Adulto 85g',           'ALI-007',  580.00, 6);

-- ============================================================================
-- Modulo: Venta - Pago
-- Solo para ventas COMPLETADAS (ids 1-85)
-- Métodos: 1=Efectivo | 2=Tarjeta Crédito | 3=Tarjeta Débito | 4=Transferencia | 5=Mercado Pago
-- Estado: 1=Aprobado
-- Nota: algunas ventas tienen pago mixto (dos métodos)
-- ============================================================================

INSERT INTO pago (fecha, monto, monto_bonificado, referencia, id_metodo_pago, id_venta, id_estado) VALUES
-- Ventas 1-85 (Completadas)
('2026-01-01 10:35:00-03',  4200.00, 0.00, NULL,       1,  1,  1),  -- Efectivo
('2026-01-01 11:05:00-03',  4500.00, 0.00, NULL,       3,  2,  1),  -- Débito
('2026-01-02 09:50:00-03',  2250.00, 0.00, NULL,       1,  3,  1),  -- Efectivo
('2026-01-03 10:20:00-03',  1950.00, 0.00, NULL,       5,  4,  1),  -- Mercado Pago
('2026-01-04 11:35:00-03',  3050.00, 0.00, NULL,       1,  5,  1),  -- Efectivo
('2026-01-04 09:05:00-03',  3500.00, 0.00, NULL,       2,  6,  1),  -- Crédito
('2026-01-05 10:50:00-03',  5600.00, 0.00, NULL,       3,  7,  1),  -- Débito
('2026-01-05 11:05:00-03',  2320.00, 0.00, NULL,       1,  8,  1),  -- Efectivo
('2026-01-06 10:35:00-03', 18000.00, 0.00, NULL,       4,  9,  1),  -- Transferencia
('2026-01-06 09:20:00-03',  6500.00, 0.00, NULL,       2, 10,  1),  -- Crédito
('2026-01-07 11:50:00-03',  4400.00, 0.00, NULL,       1, 11,  1),  -- Efectivo
('2026-01-07 10:05:00-03',  2350.00, 0.00, NULL,       5, 12,  1),  -- Mercado Pago
('2026-01-09 09:35:00-03',  8500.00, 0.00, NULL,       4, 13,  1),  -- Transferencia
('2026-01-09 11:20:00-03',  7600.00, 0.00, NULL,       3, 14,  1),  -- Débito
('2026-01-10 10:05:00-03',  5200.00, 0.00, NULL,       1, 15,  1),  -- Efectivo
('2026-01-10 09:50:00-03',  2200.00, 0.00, NULL,       5, 16,  1),  -- Mercado Pago
('2026-01-11 11:05:00-03',  4100.00, 0.00, NULL,       2, 17,  1),  -- Crédito
('2026-01-11 10:35:00-03',  2800.00, 0.00, NULL,       1, 18,  1),  -- Efectivo
('2026-02-26 09:05:00-03',  2400.00, 0.00, NULL,       3, 19,  1),  -- Débito
('2026-02-26 11:20:00-03',  3100.00, 0.00, NULL,       1, 20,  1),  -- Efectivo
('2026-01-13 10:05:00-03', 16500.00, 0.00, NULL,       4, 21,  1),  -- Transferencia
('2026-01-13 09:35:00-03',  5500.00, 0.00, NULL,       2, 22,  1),  -- Crédito
('2026-01-14 11:05:00-03', 12000.00, 0.00, NULL,       4, 23,  1),  -- Transferencia
('2026-01-15 10:20:00-03',  3700.00, 0.00, NULL,       1, 24,  1),  -- Efectivo
('2026-01-15 09:50:00-03',  2550.00, 0.00, NULL,       5, 25,  1),  -- Mercado Pago
('2026-01-15 11:35:00-03',  4400.00, 0.00, NULL,       3, 26,  1),  -- Débito
('2026-01-16 10:05:00-03',  2000.00, 0.00, NULL,       1, 27,  1),  -- Efectivo
('2026-01-17 09:20:00-03',  4200.00, 0.00, NULL,       2, 28,  1),  -- Crédito
('2026-01-17 11:05:00-03',  3900.00, 0.00, NULL,       1, 29,  1),  -- Efectivo
('2026-01-18 10:35:00-03',  9800.00, 0.00, NULL,       4, 30,  1),  -- Transferencia
-- Venta 31: pago mixto (efectivo parcial + mercado pago)
('2026-01-18 09:50:00-03',  2000.00, 0.00, NULL,       1, 31,  1),  -- Efectivo
('2026-01-18 09:52:00-03',  2900.00, 0.00, NULL,       5, 31,  1),  -- Mercado Pago
('2026-02-26 11:20:00-03',  3000.00, 0.00, NULL,       3, 32,  1),  -- Débito
('2026-02-26 10:05:00-03', 15500.00, 0.00, NULL,       4, 33,  1),  -- Transferencia
('2026-01-20 09:35:00-03',  3700.00, 0.00, NULL,       1, 34,  1),  -- Efectivo
('2026-01-20 11:05:00-03',  1800.00, 0.00, NULL,       5, 35,  1),  -- Mercado Pago
('2026-01-21 10:20:00-03', 10500.00, 0.00, NULL,       2, 36,  1),  -- Crédito
('2026-01-21 09:50:00-03',  3500.00, 0.00, NULL,       1, 37,  1),  -- Efectivo
('2026-01-22 11:35:00-03',  3600.00, 0.00, NULL,       3, 38,  1),  -- Débito
('2026-01-23 10:05:00-03',  4800.00, 0.00, NULL,       1, 39,  1),  -- Efectivo
-- Venta 40: pago mixto (crédito + transferencia)
('2026-01-23 09:20:00-03',  8000.00, 0.00, NULL,       2, 40,  1),  -- Crédito
('2026-01-23 09:22:00-03',  6000.00, 0.00, NULL,       4, 40,  1),  -- Transferencia
('2026-01-24 10:35:00-03',  3500.00, 0.00, NULL,       1, 41,  1),  -- Efectivo
('2026-01-25 11:05:00-03',  6000.00, 0.00, NULL,       2, 42,  1),  -- Crédito
('2026-02-27 09:05:00-03',  2000.00, 0.00, NULL,       5, 43,  1),  -- Mercado Pago
('2026-02-27 10:20:00-03',  1500.00, 0.00, NULL,       1, 44,  1),  -- Efectivo
('2026-01-27 11:35:00-03', 18000.00, 0.00, NULL,       4, 45,  1),  -- Transferencia
('2026-01-27 09:50:00-03', 12000.00, 0.00, NULL,       4, 46,  1),  -- Transferencia
('2026-01-28 10:05:00-03',  8500.00, 0.00, NULL,       2, 47,  1),  -- Crédito
('2026-01-29 11:20:00-03',  9000.00, 0.00, NULL,       3, 48,  1),  -- Débito
('2026-01-29 09:35:00-03',  4500.00, 0.00, NULL,       1, 49,  1),  -- Efectivo
('2026-01-30 10:50:00-03',  3500.00, 0.00, NULL,       5, 50,  1),  -- Mercado Pago
('2026-01-30 09:05:00-03',  3500.00, 0.00, NULL,       1, 51,  1),  -- Efectivo
('2026-01-31 10:35:00-03',  1500.00, 0.00, NULL,       3, 52,  1),  -- Débito
('2026-01-31 11:05:00-03',  5500.00, 0.00, NULL,       2, 53,  1),  -- Crédito
-- Venta 54: pago mixto (débito + efectivo)
('2026-02-01 09:20:00-03', 20000.00, 0.00, NULL,       3, 54,  1),  -- Débito
('2026-02-01 09:22:00-03',  2000.00, 0.00, NULL,       1, 54,  1),  -- Efectivo
('2026-02-01 10:50:00-03',  2500.00, 0.00, NULL,       5, 55,  1),  -- Mercado Pago
-- Venta 56: pago mixto (transferencia + crédito)
('2026-02-27 11:05:00-03', 10000.00, 0.00, NULL,       4, 56,  1),  -- Transferencia
('2026-02-27 11:07:00-03',  5000.00, 0.00, NULL,       2, 56,  1),  -- Crédito
('2026-02-03 09:35:00-03',  4500.00, 0.00, NULL,       1, 57,  1),  -- Efectivo
('2026-02-03 10:20:00-03',  3500.00, 0.00, NULL,       3, 58,  1),  -- Débito
('2026-02-04 11:35:00-03',  2000.00, 0.00, NULL,       5, 59,  1),  -- Mercado Pago
('2026-02-05 09:50:00-03',  8500.00, 0.00, NULL,       2, 60,  1),  -- Crédito
('2026-02-05 10:05:00-03',  6000.00, 0.00, NULL,       4, 61,  1),  -- Transferencia
('2026-02-06 11:20:00-03',  1500.00, 0.00, NULL,       1, 62,  1),  -- Efectivo
('2026-02-07 09:35:00-03',  9000.00, 0.00, NULL,       3, 63,  1),  -- Débito
-- Venta 64: pago mixto (transferencia + mercado pago)
('2026-02-07 10:50:00-03', 15000.00, 0.00, NULL,       4, 64,  1),  -- Transferencia
('2026-02-07 10:52:00-03',  3000.00, 0.00, NULL,       5, 64,  1),  -- Mercado Pago
('2026-02-08 11:05:00-03',  3500.00, 0.00, NULL,       1, 65,  1),  -- Efectivo
('2026-02-28 09:20:00-03',  5500.00, 0.00, NULL,       2, 66,  1),  -- Crédito
('2026-02-28 10:35:00-03', 12000.00, 0.00, NULL,       4, 67,  1),  -- Transferencia
('2026-02-10 11:50:00-03',  4500.00, 0.00, NULL,       1, 68,  1),  -- Efectivo
('2026-02-11 09:05:00-03',  2500.00, 0.00, NULL,       5, 69,  1),  -- Mercado Pago
('2026-02-11 10:20:00-03',  3500.00, 0.00, NULL,       3, 70,  1),  -- Débito
('2026-02-12 09:35:00-03',  4200.00, 0.00, NULL,       1, 71,  1),  -- Efectivo
('2026-02-12 10:50:00-03',  4550.00, 0.00, NULL,       2, 72,  1),  -- Crédito
('2026-02-13 11:05:00-03',  3600.00, 0.00, NULL,       5, 73,  1),  -- Mercado Pago
('2026-02-14 09:20:00-03',  5700.00, 0.00, NULL,       3, 74,  1),  -- Débito
-- Venta 75: pago mixto (efectivo + mercado pago)
('2026-02-14 10:35:00-03',  3000.00, 0.00, NULL,       1, 75,  1),  -- Efectivo
('2026-02-14 10:37:00-03',  3400.00, 0.00, NULL,       5, 75,  1),  -- Mercado Pago
('2026-02-15 11:20:00-03', 11300.00, 0.00, NULL,       4, 76,  1),  -- Transferencia
('2026-02-15 09:50:00-03',  3600.00, 0.00, NULL,       1, 77,  1),  -- Efectivo
('2026-02-16 10:05:00-03',  7200.00, 0.00, NULL,       2, 78,  1),  -- Crédito
('2026-02-16 11:35:00-03',  5650.00, 0.00, NULL,       3, 79,  1),  -- Débito
('2026-02-17 09:05:00-03',  6300.00, 0.00, NULL,       1, 80,  1),  -- Efectivo
('2026-02-17 10:20:00-03',  3100.00, 0.00, NULL,       5, 81,  1),  -- Mercado Pago
('2026-02-18 11:05:00-03', 10300.00, 0.00, NULL,       4, 82,  1),  -- Transferencia
('2026-02-18 09:35:00-03',  4660.00, 0.00, NULL,       3, 83,  1),  -- Débito
('2026-02-19 10:50:00-03',  3300.00, 0.00, NULL,       1, 84,  1),  -- Efectivo
('2026-02-19 11:05:00-03',  7000.00, 0.00, NULL,       2, 85,  1);  -- Crédito

-- ============================================================================
-- Modulo: Venta - Anulacion Venta
-- Solo para ventas CANCELADAS (ids 91-100)
-- Motivos: 1=Error de Carga | 2=Cliente Desiste | 3=Falta de Fondos
-- ============================================================================

INSERT INTO anulacion_venta (fecha, observaciones, id_anulacion_venta_motivo, id_empleado, id_venta) VALUES
('2026-02-20 10:45:00-03', 'Cliente informó que ya tenía stock del alimento.',                1, 4,  91),
('2026-02-21 11:50:00-03', 'Cliente decidió no realizar la consulta en esta visita.',         2, 4,  92),
('2026-02-21 09:45:00-03', 'Se cargó producto incorrecto en el sistema.',                     1, 4,  93),
('2026-02-22 10:55:00-03', 'Cliente desistió del servicio al conocer el costo.',              2, 4,  94),
('2026-02-22 11:30:00-03', 'Pago rechazado. Cliente no contó con fondos suficientes.',        3, 4,  95),
('2026-02-23 10:05:00-03', 'Cliente reprogramó el servicio para otra fecha.',                 2, 4,  96),
('2026-02-24 10:40:00-03', 'Error de carga: se seleccionó producto equivocado.',              1, 4,  97),
('2026-02-24 11:55:00-03', 'Cliente solicitó cancelar por cambio de veterinaria indicada.',   2, 4,  98),
('2026-02-25 09:30:00-03', 'Pago con tarjeta rechazado. Sin otro medio de pago disponible.',  3, 4,  99),
('2026-02-25 11:00:00-03', 'Se cargó cantidad incorrecta. Venta reingresada correctamente.',  1, 4, 100);

-- ============================================================================
-- Fin del script de datos de prueba - Modulo Stock y Venta
-- ============================================================================
