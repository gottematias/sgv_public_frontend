-- ============================================================================
-- DDL para Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- ============================================================================

-- ============================================================================
-- Modulo: Persona
-- ============================================================================

-- Tabla: Pais
CREATE TABLE IF NOT EXISTS pais (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla: Provincia
CREATE TABLE IF NOT EXISTS provincia (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_pais INTEGER NOT NULL,
    CONSTRAINT fk_provincia_pais FOREIGN KEY (id_pais) REFERENCES pais(id),
	CONSTRAINT uq_provincia_nombre_pais UNIQUE (nombre, id_pais)
);
CREATE INDEX IF NOT EXISTS idx_provincia_pais ON provincia(id_pais);

-- Tabla: Ciudad
CREATE TABLE IF NOT EXISTS ciudad (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(50) NOT NULL,
    id_provincia INTEGER NOT NULL,
	CONSTRAINT uq_ciudad_nombre_provincia UNIQUE (nombre, id_provincia),
    CONSTRAINT fk_ciudad_provincia FOREIGN KEY (id_provincia) REFERENCES provincia(id)
);
CREATE INDEX IF NOT EXISTS idx_ciudad_provincia ON ciudad(id_provincia);

-- Tabla: DocumentoTipo
CREATE TABLE IF NOT EXISTS documento_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: ContactoTipo
CREATE TABLE IF NOT EXISTS contacto_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Persona
CREATE TABLE IF NOT EXISTS persona (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    documento VARCHAR(100) NOT NULL,
    id_documento_tipo INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_persona_documento_tipo FOREIGN KEY (id_documento_tipo) REFERENCES documento_tipo(id),
	CONSTRAINT uq_persona_identificacion UNIQUE (documento, id_documento_tipo)
);
CREATE INDEX IF NOT EXISTS idx_persona_nombres ON persona(nombres);
CREATE INDEX IF NOT EXISTS idx_persona_apellidos ON persona(apellidos);
CREATE INDEX IF NOT EXISTS idx_persona_documento ON persona(documento);
CREATE INDEX IF NOT EXISTS idx_persona_activo ON persona(activo);

-- Tabla: Direccion
CREATE TABLE IF NOT EXISTS direccion (
    id SERIAL PRIMARY KEY,
    calle VARCHAR(255),
    numero VARCHAR(20),
    piso VARCHAR(20),
    departamento VARCHAR(20),
	observaciones TEXT,
    id_ciudad INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    CONSTRAINT fk_direccion_ciudad FOREIGN KEY (id_ciudad) REFERENCES ciudad(id),
    CONSTRAINT fk_direccion_persona FOREIGN KEY (id_persona) REFERENCES persona(id)
);
CREATE INDEX IF NOT EXISTS idx_direccion_ciudad ON direccion(id_ciudad);
CREATE INDEX IF NOT EXISTS idx_direccion_persona ON direccion(id_persona);

-- Tabla: Contacto
CREATE TABLE IF NOT EXISTS contacto (
    id SERIAL PRIMARY KEY,
    dato VARCHAR(255) NOT NULL,
    id_persona INTEGER NOT NULL,
    id_contacto_tipo INTEGER NOT NULL,
    CONSTRAINT fk_contacto_persona FOREIGN KEY (id_persona) REFERENCES persona(id),
    CONSTRAINT fk_contacto_tipo FOREIGN KEY (id_contacto_tipo) REFERENCES contacto_tipo(id)
);
CREATE INDEX IF NOT EXISTS idx_contacto_persona ON contacto(id_persona);
CREATE INDEX IF NOT EXISTS idx_contacto_contacto_tipo ON contacto(id_contacto_tipo);
CREATE INDEX IF NOT EXISTS idx_contacto_dato ON contacto(LOWER(dato));

-- ============================================================================
-- Modulo: Usuario
-- ============================================================================

-- Tabla: Rol
CREATE TABLE IF NOT EXISTS rol (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Usuario
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(500) NOT NULL,
    fecha_alta TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT true,
    id_persona INTEGER NOT NULL,
    CONSTRAINT fk_usuario_persona FOREIGN KEY (id_persona) REFERENCES persona(id)
);
CREATE INDEX IF NOT EXISTS idx_usuario_persona ON usuario(id_persona);
CREATE INDEX IF NOT EXISTS idx_usuario_nombre ON usuario(nombre);
CREATE INDEX IF NOT EXISTS idx_usuario_activo ON usuario(activo);

-- Tabla: UsuarioRol
CREATE TABLE IF NOT EXISTS usuario_rol (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario)  REFERENCES usuario(id),
    CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES rol(id)
);
CREATE INDEX IF NOT EXISTS idx_usuario_rol_usuario ON usuario_rol(id_usuario);
CREATE INDEX IF NOT EXISTS idx_usuario_rol_rol ON usuario_rol(id_rol);

-- ============================================================================
-- Modulo: Mascota
-- ============================================================================

-- Tabla: Especie
CREATE TABLE IF NOT EXISTS especie (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla: Raza
CREATE TABLE IF NOT EXISTS raza (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_especie INTEGER NOT NULL,
    CONSTRAINT fk_raza_especie FOREIGN KEY (id_especie) REFERENCES especie(id),
    CONSTRAINT uq_raza_nombre_especie UNIQUE (nombre, id_especie)
);
CREATE INDEX IF NOT EXISTS idx_raza_especie ON raza(id_especie);

-- Tabla: MascotaEstado
CREATE TABLE IF NOT EXISTS mascota_estado (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Mascota
CREATE TABLE IF NOT EXISTS mascota (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo VARCHAR(1) NOT NULL DEFAULT 'I',
    color VARCHAR(100),
    tamanio VARCHAR(50),
    pelaje VARCHAR(50),
    peso_gramos INTEGER,
    esterilizado BOOLEAN DEFAULT false,
    observaciones TEXT,
    identificador VARCHAR(250),
	activo BOOLEAN NOT NULL DEFAULT true,
    id_raza INTEGER NOT NULL,
    id_mascota_estado INTEGER NOT NULL,
    id_persona INTEGER NOT NULL,
    CONSTRAINT fk_mascota_persona FOREIGN KEY (id_persona) REFERENCES persona(id),
    CONSTRAINT fk_mascota_raza FOREIGN KEY (id_raza) REFERENCES raza(id),
    CONSTRAINT fk_mascota_estado FOREIGN KEY (id_mascota_estado) REFERENCES mascota_estado(id),
    CONSTRAINT chk_mascota_sexo CHECK (sexo IN ('M', 'F', 'I')),
    CONSTRAINT chk_mascota_peso CHECK (peso_gramos > 0)
);
CREATE INDEX IF NOT EXISTS idx_mascota_nombre ON mascota(nombre);
CREATE INDEX IF NOT EXISTS idx_mascota_persona ON mascota(id_persona);
CREATE INDEX IF NOT EXISTS idx_mascota_raza ON mascota(id_raza);
CREATE INDEX IF NOT EXISTS idx_mascota_estado ON mascota(id_mascota_estado);

-- Tabla: Alergia
CREATE TABLE IF NOT EXISTS alergia (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: MascotaAlergia
CREATE TABLE IF NOT EXISTS mascota_alergia (
    id_mascota INTEGER NOT NULL,
    id_alergia INTEGER NOT NULL,
    PRIMARY KEY (id_mascota, id_alergia),
    CONSTRAINT fk_mascota_alergia_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id),
    CONSTRAINT fk_mascota_alergia_alergia FOREIGN KEY (id_alergia) REFERENCES alergia(id)
);
CREATE INDEX IF NOT EXISTS idx_mascota_alergia_mascota ON mascota_alergia(id_mascota);
CREATE INDEX IF NOT EXISTS idx_mascota_alergia_alergia ON mascota_alergia(id_alergia);

-- Tabla: CondicionCronica
CREATE TABLE IF NOT EXISTS condicion_cronica (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: MascotaCondicionCronica
CREATE TABLE IF NOT EXISTS mascota_condicion_cronica (
    id_mascota INTEGER NOT NULL,
    id_condicion_cronica INTEGER NOT NULL,
    PRIMARY KEY (id_mascota, id_condicion_cronica),
    CONSTRAINT fk_mascota_condicion_cronica_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id),
    CONSTRAINT fk_mascota_condicion_cronica_condicion FOREIGN KEY (id_condicion_cronica) REFERENCES condicion_cronica(id)
);
CREATE INDEX IF NOT EXISTS idx_mascota_condicion_cronica_mascota ON mascota_condicion_cronica(id_mascota);
CREATE INDEX IF NOT EXISTS idx_mascota_condicion_cronica_condicion ON mascota_condicion_cronica(id_condicion_cronica);

-- ============================================================================
-- Modulo: Empleado
-- ============================================================================

-- Tabla: Empleado
CREATE TABLE IF NOT EXISTS empleado (
    id SERIAL PRIMARY KEY,
    fecha_ingreso DATE NOT NULL,
    fecha_egreso DATE,
    activo BOOLEAN DEFAULT true,
    id_usuario INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_empleado_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    CONSTRAINT chk_empleado_fechas CHECK (fecha_egreso IS NULL OR fecha_egreso >= fecha_ingreso)
);
CREATE INDEX idx_empleado_activo ON empleado(activo);

-- Tabla: Puesto
CREATE TABLE IF NOT EXISTS puesto (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Empleado Puesto
CREATE TABLE IF NOT EXISTS empleado_puesto (
    id SERIAL PRIMARY KEY,
    id_empleado INTEGER NOT NULL,
    id_puesto INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_empleado_puesto_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id),
    CONSTRAINT fk_empleado_puesto_puesto FOREIGN KEY (id_puesto) REFERENCES puesto(id),
    CONSTRAINT chk_empleado_puesto_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);
CREATE INDEX idx_empleado_puesto_empleado ON empleado_puesto(id_empleado);
CREATE INDEX idx_empleado_puesto_puesto ON empleado_puesto(id_puesto);
CREATE INDEX idx_empleado_puesto_empleado_activo ON empleado_puesto(id_empleado, activo);
CREATE UNIQUE INDEX uq_empleado_puesto_activo ON empleado_puesto(id_empleado, id_puesto) WHERE activo = true;

-- Tabla: Atributo Tipo
CREATE TABLE IF NOT EXISTS atributo_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Empleado Atributo
CREATE TABLE IF NOT EXISTS empleado_atributo (
    id SERIAL PRIMARY KEY,
    valor TEXT NOT NULL,
    id_atributo_tipo INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    CONSTRAINT fk_empleado_atributo_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id),
    CONSTRAINT fk_empleado_atributo_atributo_tipo FOREIGN KEY (id_atributo_tipo) REFERENCES atributo_tipo(id)
);
CREATE INDEX idx_empleado_atributo_empleado ON empleado_atributo(id_empleado);
CREATE INDEX idx_empleado_atributo_tipo ON empleado_atributo(id_atributo_tipo);

-- Tabla: Especialidad
CREATE TABLE IF NOT EXISTS especialidad (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
	id_puesto INTEGER,
	CONSTRAINT fk_especialidad_puesto FOREIGN KEY (id_puesto) REFERENCES puesto(id)
);
CREATE INDEX idx_especialidad_puesto ON especialidad(id_puesto);

-- Tabla: Empleado Especialidad
CREATE TABLE IF NOT EXISTS empleado_especialidad (
    id_empleado INTEGER NOT NULL,
    id_especialidad INTEGER NOT NULL,
    PRIMARY KEY (id_empleado, id_especialidad),
    CONSTRAINT fk_empleado_especialidad_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id),
    CONSTRAINT fk_empleado_especialidad_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidad(id)
);
CREATE INDEX idx_empleado_especialidad_empleado ON empleado_especialidad(id_empleado);

-- ============================================================================
-- Modulo: Clinica
-- ============================================================================

-- Tabla: Diagnostico
CREATE TABLE IF NOT EXISTS diagnostico (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);
CREATE INDEX IF NOT EXISTS idx_diagnostico_nombre ON diagnostico(nombre);

-- Tabla: HistorialClinico
CREATE TABLE IF NOT EXISTS historial_clinico (
    id SERIAL PRIMARY KEY,
    fecha_consulta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo_consulta VARCHAR(200) NOT NULL,
    tratamiento TEXT,
    observaciones TEXT,
    id_mascota INTEGER NOT NULL,
    id_empleado_asignado INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_historial_clinico_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id),
    CONSTRAINT fk_historial_clinico_empleado_asignado FOREIGN KEY (id_empleado_asignado) REFERENCES empleado(id)
);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_mascota ON historial_clinico(id_mascota);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_empleado_asignado ON historial_clinico(id_empleado_asignado);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_fecha_consulta ON historial_clinico(fecha_consulta DESC);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_mascota_fecha_consulta ON historial_clinico(id_mascota, fecha_consulta DESC);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_activo ON historial_clinico(activo);

-- Tabla: ExamenFisico
CREATE TABLE IF NOT EXISTS examen_fisico (
    id SERIAL PRIMARY KEY,
    peso_gramos INTEGER,
    temperatura_corporal VARCHAR(100),
    frecuencia_cardiaca VARCHAR(100),
    frecuencia_respiratoria VARCHAR(100),
    estado_hidratacion VARCHAR(100),
    general TEXT,
    id_historial_clinico INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_examen_fisico_historial_clinico FOREIGN KEY (id_historial_clinico) REFERENCES historial_clinico(id)
);

-- Tabla: HistorialClinicoDiagnostico
CREATE TABLE IF NOT EXISTS historial_clinico_diagnostico (
    id_historial_clinico INTEGER NOT NULL,
    id_diagnostico INTEGER NOT NULL,
    PRIMARY KEY (id_historial_clinico, id_diagnostico),
    CONSTRAINT fk_historial_clinico_diagnostico_historial FOREIGN KEY (id_historial_clinico) REFERENCES historial_clinico(id),
    CONSTRAINT fk_historial_clinico_diagnostico_diagnostico FOREIGN KEY (id_diagnostico) REFERENCES diagnostico(id)
);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_diagnostico_historial ON historial_clinico_diagnostico(id_historial_clinico);
CREATE INDEX IF NOT EXISTS idx_historial_clinico_diagnostico_diagnostico ON historial_clinico_diagnostico(id_diagnostico);


-- ============================================================================
-- Modulo: Vacuna
-- ============================================================================

CREATE TABLE IF NOT EXISTS vacuna_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS vacuna (
    id SERIAL PRIMARY KEY,
    fecha_aplicacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_proxima_aplicacion TIMESTAMP WITH TIME ZONE,
    lote VARCHAR(100),
    numero_serie VARCHAR(100),
    observaciones TEXT,
    id_empleado INTEGER NOT NULL,
    id_mascota INTEGER NOT NULL,
    id_vacuna_tipo INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_vacuna_veterinario FOREIGN KEY (id_empleado) REFERENCES empleado(id),
    CONSTRAINT fk_vacuna_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id),
    CONSTRAINT fk_vacuna_tipo FOREIGN KEY (id_vacuna_tipo) REFERENCES vacuna_tipo(id)
);
CREATE INDEX IF NOT EXISTS idx_vacuna_mascota ON vacuna(id_mascota);
CREATE INDEX IF NOT EXISTS idx_vacuna_veterinario ON vacuna(id_empleado);
CREATE INDEX IF NOT EXISTS idx_vacuna_tipo ON vacuna(id_vacuna_tipo);
CREATE INDEX IF NOT EXISTS idx_vacuna_mascota_fecha ON vacuna(id_mascota, fecha_aplicacion DESC);
CREATE INDEX IF NOT EXISTS idx_vacuna_fecha_proxima ON vacuna(fecha_proxima_aplicacion) WHERE fecha_proxima_aplicacion IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vacuna_tipo_fecha ON vacuna(id_vacuna_tipo, fecha_aplicacion DESC);
CREATE INDEX IF NOT EXISTS idx_vacuna_activo ON vacuna(activo);

-- ============================================================================
-- Modulo: Turnos
-- ============================================================================

-- Tabla: TurnoTipo
CREATE TABLE IF NOT EXISTS turno_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: TurnoEstado
CREATE TABLE IF NOT EXISTS turno_estado (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: Turno
CREATE TABLE IF NOT EXISTS turno (
    id SERIAL PRIMARY KEY,
    fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    motivo VARCHAR(100),
    notas TEXT,
    id_turno_tipo INTEGER NOT NULL,
    id_turno_estado INTEGER NOT NULL,
    id_usuario_registro INTEGER NOT NULL,
    id_empleado_asignado INTEGER NOT NULL,
    id_mascota INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    CONSTRAINT fk_turno_tipo FOREIGN KEY (id_turno_tipo) REFERENCES turno_tipo(id),
    CONSTRAINT fk_turno_estado FOREIGN KEY (id_turno_estado) REFERENCES turno_estado(id),
    CONSTRAINT fk_turno_usuario_registro FOREIGN KEY (id_usuario_registro) REFERENCES usuario(id),
    CONSTRAINT fk_turno_empleado_asignado FOREIGN KEY (id_empleado_asignado) REFERENCES empleado(id),
    CONSTRAINT fk_turno_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id)
);
CREATE INDEX IF NOT EXISTS idx_turno_empleado_asignado_fecha ON turno(id_empleado_asignado, fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_turno_mascota_fecha ON turno(id_mascota, fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_turno_fecha_hora ON turno(fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_turno_activo ON turno(activo);

-- ============================================================================
-- Modulo: Adjuntos
-- ============================================================================

-- Tabla: Referencia
CREATE TABLE IF NOT EXISTS referencia (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- Tabla: AdjuntoTipo
CREATE TABLE IF NOT EXISTS adjunto_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
	id_referencia INTEGER,
	CONSTRAINT fk_adjunto_tipo_referencia FOREIGN KEY (id_referencia) REFERENCES referencia(id),
	CONSTRAINT uq_adjunto_tipo_referencia UNIQUE (nombre, id_referencia)
);

-- Tabla: Adjunto
CREATE TABLE IF NOT EXISTS adjunto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(250) NOT NULL,
    extension VARCHAR(10) NOT NULL,
    mime VARCHAR(150) NOT NULL,
    tamanio_bytes BIGINT NOT NULL,
    fecha_carga TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(250) NOT NULL,
    datos BYTEA NOT NULL,
    id_adjunto_tipo INTEGER NOT NULL,
    CONSTRAINT fk_adjunto_tipo FOREIGN KEY (id_adjunto_tipo) REFERENCES adjunto_tipo(id)
);
CREATE INDEX IF NOT EXISTS idx_adjunto_tipo ON adjunto(id_adjunto_tipo);
CREATE INDEX IF NOT EXISTS idx_adjunto_fecha_carga ON adjunto(fecha_carga DESC);

-- Tabla: Adjunto Referencia
CREATE TABLE IF NOT EXISTS adjunto_referencia (
    id_referencia INTEGER NOT NULL,
    id_adjunto INTEGER NOT NULL,
    id_entidad INTEGER NOT NULL,
    PRIMARY KEY (id_referencia, id_entidad, id_adjunto),
    CONSTRAINT fk_adjunto_referencia_referencia FOREIGN KEY (id_referencia) REFERENCES referencia(id),
    CONSTRAINT fk_adjunto_referencia_adjunto FOREIGN KEY (id_adjunto) REFERENCES adjunto(id)
);
CREATE INDEX IF NOT EXISTS idx_adjunto_referencia_referencia ON adjunto_referencia(id_referencia);
CREATE INDEX IF NOT EXISTS idx_adjunto_referencia_entidad ON adjunto_referencia(id_referencia, id_entidad);
CREATE INDEX IF NOT EXISTS idx_adjunto_referencia_adjunto ON adjunto_referencia(id_adjunto);
