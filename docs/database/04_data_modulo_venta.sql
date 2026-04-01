-- ============================================================================
-- Datos para Sistema de Gestion de Veterinaria
-- PostgreSQL 16.11
-- ============================================================================

-- ============================================================================
-- Modulo: Stock
-- ============================================================================

-- Tabla: Producto Categoria
INSERT INTO producto_categoria (nombre, descripcion) VALUES 
('Medicamentos', 'Antibióticos, antiinflamatorios, etc.'),
('Alimentos', 'Balanceados y dietas prescriptas'),
('Accesorios', 'Correas, juguetes, camas'),
('Higiene', 'Shampoos, peines, piedras sanitarias');

-- Tabla: Movimiento Stock Tipo
INSERT INTO movimiento_stock_tipo (id, nombre, descripcion, factor) VALUES 
(1, 'Compra a Proveedor', 'Ingreso de mercadería por compra', 1),
(2, 'Venta', 'Egreso automático por venta realizada', -1),
(3, 'Ajuste Positivo', 'Corrección de inventario (sobrante)', 1),
(4, 'Ajuste Negativo', 'Corrección de inventario (faltante/rotura/vencimiento)', -1),
(5, 'Devolución Cliente', 'Reingreso por devolución de venta', 1);

-- ============================================================================
-- Modulo: Venta
-- ============================================================================

-- Tabla: Venta Estado
INSERT INTO venta_estado (id, nombre, descripcion) VALUES 
(1, 'Pendiente', 'Venta iniciada, esperando pago o finalización'),
(2, 'Completada', 'Venta cerrada y entregada'),
(3, 'Cancelada', 'Venta anulada sin efecto en stock ni caja');

-- Tabla: Pago Estado
INSERT INTO pago_estado (id, nombre, descripcion) VALUES 
(1, 'Aprobado', 'Pago recibido correctamente'),
(2, 'Rechazado', 'Pago rechazado por la entidad financiera'),
(3, 'Pendiente', 'Pago diferido o en proceso');

-- Tabla: Metodos Pago
INSERT INTO metodo_pago (nombre, descripcion) VALUES 
('Efectivo', 'Pago en moneda de curso legal'),
('Tarjeta de Crédito', 'Visa, Mastercard, etc.'),
('Tarjeta de Débito', 'Pago electrónico inmediato'),
('Transferencia', 'Transferencia bancaria'),
('Mercado Pago', 'Billetera virtual');

-- Tabla: Anulacion Venta Motivo
INSERT INTO anulacion_venta_motivo (id, nombre, descripcion) VALUES 
(1, 'Error de Carga', 'Error al seleccionar productos o cliente'),
(2, 'Cliente Desiste', 'El cliente decide no llevar los productos'),
(3, 'Falta de Fondos', 'El pago fue rechazado y no hay otro medio');