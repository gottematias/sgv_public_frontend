-- ============================================================================
-- Modulo: Stock
-- ============================================================================

CREATE TABLE producto_categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE servicio (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    codigo_interno VARCHAR(100) NOT NULL,
    precio DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    duracion_minutos INTEGER NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_servicio_nombre_unico_activo ON servicio(nombre) WHERE activo = true;
CREATE UNIQUE INDEX idx_servicio_codigo_interno_unico_activo ON servicio(codigo_interno) WHERE activo = true;

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(250) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(100),
	codigo_interno VARCHAR(100) NOT NULL,
    precio_venta DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    precio_costo DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    fecha_vencimiento TIMESTAMPTZ,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    id_categoria INTEGER NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_actualizacion TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES producto_categoria(id)
);
CREATE INDEX idx_producto_categoria ON producto(id_categoria);
CREATE UNIQUE INDEX idx_producto_nombre_unico_activo ON producto(nombre) WHERE activo = true;
CREATE UNIQUE INDEX idx_producto_codigo_unico_activo ON producto(codigo) WHERE activo = true;
CREATE UNIQUE INDEX idx_producto_codigo_interno_unico_activo ON producto(codigo_interno) WHERE activo = true;

CREATE TABLE movimiento_stock_tipo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    factor INTEGER NOT NULL DEFAULT 1,
	CONSTRAINT chk_movimiento_factor CHECK (factor IN (1, -1))
);

CREATE TABLE movimiento_stock (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    cantidad INTEGER NOT NULL,
    observaciones TEXT,
    id_producto INTEGER NOT NULL,
    id_movimiento_tipo INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL,
    CONSTRAINT fk_movimiento_stock_producto FOREIGN KEY (id_producto) REFERENCES producto(id),
    CONSTRAINT fk_movimiento_stock_movimiento_tipo FOREIGN KEY (id_movimiento_tipo) REFERENCES movimiento_stock_tipo(id),
    CONSTRAINT fk_movimiento_stock_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id)
);
CREATE INDEX idx_movimiento_stock_fecha ON movimiento_stock(fecha);
CREATE INDEX idx_movimiento_stock_producto ON movimiento_stock(id_producto);
CREATE INDEX idx_movimiento_stock_movimiento_tipo ON movimiento_stock(id_movimiento_tipo);
CREATE INDEX idx_movimiento_stock_empleado ON movimiento_stock(id_empleado);

-- ============================================================================
-- Modulo: Venta
-- ============================================================================

CREATE TABLE venta_estado (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    monto_ajuste_redondeo DECIMAL(15,2) DEFAULT 0.00,   
    total_final DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    id_cliente INTEGER,
    id_empleado INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    CONSTRAINT fk_venta_estado FOREIGN KEY (id_estado) REFERENCES venta_estado(id),
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) REFERENCES persona(id),
    CONSTRAINT fk_venta_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id)
);
CREATE INDEX idx_venta_fecha ON venta(fecha);
CREATE INDEX idx_venta_cliente ON venta(id_cliente);
CREATE INDEX idx_venta_empleado ON venta(id_empleado);
CREATE INDEX idx_venta_estado ON venta(id_estado);

CREATE TABLE pago_estado (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE metodo_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(15,2) NOT NULL,
    monto_bonificado DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    referencia VARCHAR(100),
    id_metodo_pago INTEGER NOT NULL,
    id_venta INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id),
    CONSTRAINT fk_pago_venta FOREIGN KEY (id_venta) REFERENCES venta(id),
    CONSTRAINT fk_pago_estado FOREIGN KEY (id_estado) REFERENCES pago_estado(id),
	CONSTRAINT chk_pago_monto_positivo CHECK (monto > 0),
    CONSTRAINT chk_pago_monto_bonificado_positiva CHECK (monto_bonificado >= 0)
);
CREATE INDEX idx_pago_venta ON pago(id_venta);

CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER,
    id_servicio INTEGER,
    ps_nombre VARCHAR(100) NOT NULL,
    ps_codigo VARCHAR(100) NOT NULL,
    ps_precio_unitario DECIMAL(15,2) NOT NULL,
    cantidad INTEGER NOT NULL,
	subtotal DECIMAL(15,2) GENERATED ALWAYS AS (ps_precio_unitario * cantidad) STORED,
    CONSTRAINT fk_detalle_venta_venta FOREIGN KEY (id_venta) REFERENCES venta(id),
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (id_producto) REFERENCES producto(id),
    CONSTRAINT fk_detalle_venta_servicio FOREIGN KEY (id_servicio) REFERENCES servicio(id),
    CONSTRAINT chk_detalle_cantidad_positiva CHECK (cantidad > 0),
    CONSTRAINT chk_producto_o_servicio CHECK (
	    (id_producto IS NOT NULL)::int + (id_servicio IS NOT NULL)::int = 1
    )
);
CREATE INDEX idx_detalle_venta_venta ON detalle_venta(id_venta);
CREATE INDEX idx_detalle_venta_producto ON detalle_venta(id_producto);
CREATE INDEX idx_detalle_venta_servicio ON detalle_venta(id_servicio);

CREATE TABLE anulacion_venta_motivo (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE anulacion_venta (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
	id_anulacion_venta_motivo INTEGER NOT NULL,
    id_empleado INTEGER NOT NULL, 
    id_venta INTEGER NOT NULL,
    CONSTRAINT fk_anulacion_motivo FOREIGN KEY (id_anulacion_venta_motivo) REFERENCES anulacion_venta_motivo(id),
    CONSTRAINT fk_anulacion_empleado FOREIGN KEY (id_empleado) REFERENCES empleado(id),
    CONSTRAINT fk_anulacion_venta FOREIGN KEY (id_venta) REFERENCES venta(id),
    CONSTRAINT uq_anulacion_venta_id_venta UNIQUE (id_venta)
);
CREATE INDEX idx_anulacion_venta_venta ON anulacion_venta(id_venta);