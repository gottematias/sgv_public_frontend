-- ============================================================================
-- Datos para Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- ============================================================================

-- ============================================================================
-- Modulo: Persona
-- ============================================================================

-- Tabla: Pais
INSERT INTO pais (id, nombre) 
VALUES 
(1, 'Argentina');

-- Tabla: Provincia
INSERT INTO provincia (id, nombre, id_pais)
VALUES 
(1, 'Buenos Aires', 1),
(2, 'Catamarca', 1),
(3, 'Chaco', 1),
(4, 'Chubut', 1),
(5, 'Córdoba', 1),
(6, 'Corrientes', 1),
(7, 'Entre Ríos', 1),
(8, 'Formosa', 1),
(9, 'Jujuy', 1),
(10, 'La Pampa', 1),
(11, 'La Rioja', 1),
(12, 'Mendoza', 1),
(13, 'Misiones', 1),
(14, 'Neuquén', 1),
(15, 'Río Negro', 1),
(16, 'Salta', 1),
(17, 'San Juan', 1),
(18, 'San Luis', 1),
(19, 'Santa Cruz', 1),
(20, 'Santa Fe', 1),
(21, 'Santiago del Estero', 1),
(22, 'Tierra del Fuego', 1),
(23, 'Tucumán', 1),
(24, 'Ciudad Autónoma de Buenos Aires', 1);

-- Tabla: Ciudad
INSERT INTO ciudad (id, nombre, codigo_postal, id_provincia)
VALUES  
(1, 'Paraná', '3100', 7),
(2, 'Concordia', '3200', 7),
(3, 'Gualeguaychú', '2820', 7),
(4, 'San Benito', '3107', 7),
(5, 'Oro Verde', '3100', 7),
(6, 'Colonia Avellaneda', '3107', 7),
(7, 'Diamante', '3105', 7),
(8, 'Crespo', '3116', 7),
(9, 'Viale', '3109', 7),
(10, 'Santa Fé', '3000', 20);

-- Tabla: DocumentoTipo
INSERT INTO documento_tipo (id, nombre, descripcion)
VALUES 
(1, 'DNI', 'Documento Nacional de Identidad'),
(2, 'Pasaporte', 'Pasaporte Argentino'),
(3, 'Codigo Interno', 'Codigo de uso interno para el Sistema');

-- Tabla: ContactoTipo
INSERT INTO contacto_tipo (id, nombre, descripcion)
VALUES 
(1, 'Correo', 'Dirección de correo electrónico'),
(2, 'Celular', 'Número de teléfono móvil'),
(3, 'Teléfono', 'Número de teléfono fijo');

-- ============================================================================
-- Modulo: Usuario
-- ============================================================================

-- Tabla: Rol
INSERT INTO rol (id, nombre, descripcion)
VALUES
(1, 'VETERINARIO', 'Gestión de Historiales Clínicos y Vacunas'),
(2, 'RECEPCIONISTA', 'Gestión de Personas, Mascotas y Turnos'),
(3, 'CAJERO', 'Venta de Productos/Servicios, Consulta de Stock y Registro de Pagos'),
(4, 'GESTOR_INVENTARIO', 'Gestión de Productos/Servicios y Movimientos de Stock'),
(5, 'ADMINISTRADOR', 'Gestión de Usuarios, Empleados y Configuraciones del Negocio'),
(7, 'ADMINISTRADOR_SISTEMA', 'Acceso total: todas las funcionalidades y configuraciones del sistema');

-- ============================================================================
-- Modulo: Mascota
-- ============================================================================

-- Tabla: Especie
INSERT INTO especie (id, nombre)
VALUES 
(1, 'Canino'),
(2, 'Felino');

-- Tabla: Raza
INSERT INTO raza (id, nombre, id_especie)
VALUES 
(1, 'Labrador Retriever', 1),
(2, 'Pastor Alemán', 1),
(3, 'Golden Retriever', 1),
(4, 'Bulldog Francés', 1),
(5, 'Beagle', 1),
(6, 'Caniche', 1),
(7, 'Chihuahua', 1),
(8, 'Dálmata', 1),
(9, 'Boxer', 1),
(10, 'Mestizo', 1),
(11, 'Persa', 2),
(12, 'Siamés', 2),
(13, 'Maine Coon', 2),
(14, 'Bengalí', 2),
(15, 'Angora', 2),
(16, 'Británico de Pelo Corto', 2),
(17, 'Siberiano', 2),
(18, 'Esfinge', 2),
(19, 'Ragdoll', 2),
(20, 'Común Europeo', 2),
(21, 'Mestizo', 2);

-- Tabla: MascotaEstado
INSERT INTO mascota_estado (id, nombre, descripcion)
VALUES 
(1, 'Activo', 'Mascota activa en el sistema'),
(2, 'Fallecido', 'Mascota fallecida'),
(3, 'Extraviado', 'Mascota reportada como extraviada'),
(4, 'En Tratamiento', 'Mascota con tratamiento médico en curso'),
(5, 'Inactivo', 'Mascota inactiva en el sistema');

-- Tabla: Alergia
INSERT INTO alergia (id, nombre, descripcion)
VALUES 
(1, 'Alimento - Pollo', 'Alergia alimentaria a proteínas de pollo'),
(2, 'Alimento - Vacuno', 'Alergia alimentaria a proteínas de carne vacuna'),
(3, 'Alimento - Lácteos', 'Intolerancia o alergia a productos lácteos'),
(4, 'Alimento - Cereales', 'Alergia a trigo, maíz u otros cereales'),
(5, 'Alimento - Pescado', 'Alergia a proteínas de pescado'),
(6, 'Ambiental - Polen', 'Alergia estacional a polen de plantas'),
(7, 'Ambiental - Ácaros', 'Alergia a ácaros del polvo doméstico'),
(8, 'Ambiental - Moho', 'Alergia a esporas de hongos y moho'),
(9, 'Contacto - Pulgas', 'Dermatitis alérgica por picadura de pulgas'),
(10, 'Medicamento - Penicilina', 'Alergia a antibióticos del grupo penicilina'),
(11, 'Medicamento - Vacunas', 'Reacción alérgica a componentes de vacunas'),
(12, 'Contacto - Químicos', 'Alergia a productos de limpieza o químicos'),
(13, 'Picadura - Insectos', 'Reacción alérgica a picaduras de abejas, avispas'),
(14, 'Alimento - Huevo', 'Alergia a proteínas del huevo');

-- Tabla: CondicionCronica
INSERT INTO condicion_cronica (id, nombre, descripcion)
VALUES 
(1, 'Diabetes Mellitus', 'Trastorno metabólico del azúcar en sangre'),
(2, 'Insuficiencia Renal Crónica', 'Pérdida progresiva de la función renal'),
(3, 'Enfermedad Cardíaca', 'Patologías crónicas del corazón'),
(4, 'Artritis', 'Inflamación crónica de articulaciones'),
(5, 'Epilepsia', 'Trastorno neurológico con convulsiones recurrentes'),
(6, 'Hipotiroidismo', 'Deficiencia en producción de hormonas tiroideas'),
(7, 'Hipertiroidismo', 'Exceso en producción de hormonas tiroideas'),
(8, 'Enfermedad Inflamatoria Intestinal', 'Inflamación crónica del tracto digestivo'),
(9, 'Asma Felino', 'Enfermedad respiratoria crónica en gatos'),
(10, 'Displasia de Cadera', 'Malformación congénita de la articulación de cadera'),
(11, 'Enfermedad Dental Crónica', 'Gingivitis y periodontitis crónica'),
(12, 'Glaucoma', 'Presión intraocular elevada crónica'),
(13, 'Insuficiencia Hepática', 'Deterioro progresivo de la función hepática'),
(14, 'Obesidad', 'Exceso de peso corporal crónico'),
(15, 'Dermatitis Atópica', 'Inflamación crónica de la piel por alergias');

-- ============================================================================
-- Modulo: Empleado
-- ============================================================================

-- Tabla: puesto
INSERT INTO puesto (id, nombre, descripcion) VALUES
(1, 'Veterinario', 'Profesional médico veterinario habilitado para diagnóstico y tratamiento'),
(2, 'Recepcionista', 'Atención al público, gestión de turnos y consultas'),
(3, 'Asistente Veterinario', 'Asistencia en procedimientos médicos y quirúrgicos'),
(4, 'Administrador', 'Gestión administrativa, financiera y de recursos humanos');

-- Tabla: atributo_tipo
INSERT INTO atributo_tipo (id, nombre, descripcion) VALUES
(1, 'Matrícula Profesional', 'Matrícula habilitante del colegio profesional correspondiente'),
(2, 'Legajo', 'Número de legajo interno del empleado');

-- Tabla: especialidad
INSERT INTO especialidad (id, nombre, descripcion, id_puesto) VALUES
(1, 'Clínica General', 'Medicina general y atención primaria de mascotas', 1),
(2, 'Cirugía General', 'Procedimientos quirúrgicos generales', 1),
(3, 'Medicina de Urgencias', 'Atención de emergencias y cuidados intensivos', 1),
(4, 'Asistencia Quirúrgica', 'Asistencia en procedimientos quirúrgicos', 3),
(5, 'Manejo de Internación', 'Cuidado de pacientes hospitalizados', 3),
(6, 'Toma de Muestras', 'Extracción de sangre, orina y otras muestras', 3);

-- ============================================================================
-- Modulo: Clinica
-- ============================================================================

-- Tabla: Diagnostico
INSERT INTO diagnostico (id, nombre, descripcion)
VALUES
(1, 'Parvovirosis', 'Infección viral grave que afecta el tracto gastrointestinal'),
(2, 'Moquillo', 'Enfermedad viral multisistémica altamente contagiosa'),
(3, 'Otitis', 'Inflamación del oído externo, medio o interno'),
(4, 'Dermatitis Alérgica', 'Inflamación cutánea por reacción alérgica'),
(5, 'Gastroenteritis', 'Inflamación del tracto gastrointestinal'),
(6, 'Enfermedad Respiratoria', 'Afecciones del sistema respiratorio'),
(7, 'Parasitosis', 'Infestación por parásitos internos o externos'),
(8, 'Traumatismo', 'Lesión por golpe, caída o accidente'),
(9, 'Infección Urinaria', 'Infección del tracto urinario'),
(10, 'Gingivitis/Periodontitis', 'Enfermedad dental y de encías'),
(11, 'Fractura', 'Rotura de hueso'),
(12, 'Luxación', 'Dislocación de articulación'),
(13, 'Deshidratación', 'Pérdida excesiva de líquidos corporales'),
(14, 'Intoxicación', 'Envenenamiento por sustancias tóxicas');

-- ============================================================================
-- Modulo: Vacuna
-- ============================================================================

-- Tabla: VacunaTipo
INSERT INTO vacuna_tipo (id, nombre, descripcion)
VALUES
(1, 'Séxtuple Canina', 'Protege contra Distemper, Hepatitis, Parainfluenza, Parvovirus, Leptospirosis y Coronavirus'),
(2, 'Antirrábica', 'Vacuna contra la rabia, obligatoria para caninos y felinos'),
(3, 'Quíntuple Canina', 'Protege contra Distemper, Hepatitis, Parainfluenza, Parvovirus y Leptospirosis'),
(4, 'Triple Felina', 'Protege contra Rinotraqueítis, Calicivirus y Panleucopenia'),
(5, 'Leucemia Felina', 'Vacuna contra el virus de la leucemia felina (FeLV)'),
(6, 'Tos de las Perreras', 'Protege contra Bordetella bronchiseptica'),
(7, 'Giardia', 'Vacuna contra Giardia lamblia'),
(8, 'Parvovirus', 'Vacuna específica contra Parvovirus canino'),
(9, 'Cuádruple Felina', 'Triple Felina más protección contra Clamidiosis'),
(10, 'Leptospirosis', 'Vacuna específica contra Leptospirosis');

-- ============================================================================
-- Modulo: Turnos
-- ============================================================================

-- Tabla: TurnoTipo
INSERT INTO turno_tipo (id, nombre, descripcion)
VALUES
(1, 'Consulta General', 'Consulta veterinaria de rutina y chequeo general'),
(2, 'Emergencia', 'Atencion de urgencia o emergencia veterinaria'),
(3, 'Cirugia', 'Procedimiento quirurgico programado'),
(4, 'Vacunacion', 'Aplicacion de vacunas y refuerzos'),
(5, 'Control Post-Operatorio', 'Seguimiento despues de cirugia o procedimiento'),
(6, 'Analisis de Laboratorio', 'Toma de muestras para estudios diagnosticos'),
(7, 'Desparasitacion', 'Tratamiento antiparasitario'),
(8, 'Estetica y Peluqueria', 'Servicios de higiene y estetica'),
(9, 'Castracion/Esterilizacion', 'Cirugia de castracion o esterilizacion'),
(10, 'Odontologia', 'Limpieza dental y tratamientos dentales'),
(11, 'Traumatologia', 'Atencion de fracturas, lesiones oseas o musculares'),
(12, 'Ecografia/Radiografia', 'Estudios por imagenes diagnosticas'),
(13, 'Certificado Sanitario', 'Emision de certificados para viajes o tramites'),
(14, 'Nutricion', 'Asesoria nutricional especializada');

-- Tabla: TurnoEstado
INSERT INTO turno_estado (id, nombre, descripcion)
VALUES
(1, 'Programado', 'Turno programado, espera asistencia'),
(2, 'En Sala', 'Paciente en sala de espera'),
(3, 'En Curso', 'Turno actualmente en atencion'),
(4, 'Completado', 'Turno finalizado exitosamente'),
(5, 'Cancelado por Cliente', 'Turno cancelado a solicitud del cliente'),
(6, 'Cancelado por Clinica', 'Turno cancelado por la clinica veterinaria'),
(7, 'No Asistio', 'Cliente no se presento al turno agendado'),
(8, 'Reprogramado', 'Turno que fue movido a otra fecha/hora');

-- ============================================================================
-- Modulo: Adjuntos
-- ============================================================================

-- Tabla: Referencia
INSERT INTO referencia (id, nombre, descripcion)
VALUES
(1, 'historial_clinico', 'Referencia a la tabla: historial_clinico'),
(2, 'mascota', 'Referencia a la tabla: mascota');

-- Tabla: AdjuntoTipo
INSERT INTO adjunto_tipo (id, nombre, descripcion, id_referencia)
VALUES
(1, 'Registro Fotográfico', 'Fotos de lesiones, heridas o evolución clínica', 1),
(2, 'Informes de Laboratorio', 'Resultados de sangre, orina y tests rápidos', 1),
(3, 'Estudios de Imagen', 'Radiografías, ecografías y otras capturas', 1),
(4, 'Certificados y Recetas', 'Certificados de salud, vacunas y recetas', 1),
(5, 'Informes de Especialistas', 'Documentos de interconsultas o especialistas externos', 1),
(6, 'Foto de Perfil', 'Imagen principal de la mascota para identificación', 2),
(7, 'Galería de Fotos', 'Fotos adicionales de la mascota en diferentes momentos', 2),
(8, 'Documentos de Adopción', 'Certificados o documentos relacionados con la adopción', 2),
(9, 'Pedigree', 'Certificado de pedigree o árbol genealógico', 2),
(10, 'Identificación (Chip/Tatuaje)', 'Documentación de microchip o tatuaje de identificación', 2);