import { BaseResponse } from './generic-response.interface';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  codigo: string | null;
  codigoInterno: string;
  precioVenta: number;
  precioCosto: number;
  fechaVencimiento: Date | null;
  stockActual: number;
  stockMinimo: number | null;
  activo: boolean;
  categoria: ProductoCategoria;
  idCategoria: number;
}

export interface ProductoCategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface CreateProductoRequest {
  nombre: string;
  descripcion?: string | null;
  codigo?: string | null;
  codigoInterno: string;
  precioVenta: number;
  precioCosto: number;
  fechaVencimiento?: string | null;
  stockActual: number;
  stockMinimo?: number | null;
  idCategoria: number;
}

export interface UpdateProductoRequest {
  nombre?: string;
  descripcion?: string | null;
  codigo?: string | null;
  codigoInterno?: string;
  precioVenta?: number;
  precioCosto?: number;
  fechaVencimiento?: string | null;
  stockMinimo?: number | null;
  idCategoria?: number;
  activo?: boolean;
}

export interface ProductoResponse extends BaseResponse {
  data: Producto;
}

export interface ProductoListResponse extends BaseResponse {
  data: Producto[];
}

export interface ProductoCategoriaListResponse extends BaseResponse {
  data: ProductoCategoria[];
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  codigoInterno: string;
  precio: number;
  duracionMinutos: number | null;
  activo: boolean;
}

export interface CreateServicioRequest {
  nombre: string;
  codigoInterno: string;
  precio: number;
  duracionMinutos: number;
}

export interface UpdateServicioRequest {
  nombre?: string;
  descripcion?: string | null;
  codigoInterno?: string;
  precio?: number;
  duracionMinutos?: number | null;
  activo?: boolean;
}

export interface ServicioResponse extends BaseResponse {
  data: Servicio;
}

export interface ServicioListResponse extends BaseResponse {
  data: Servicio[];
}

export interface MovimientoStock {
  id: number;
  cantidad: number;
  observaciones: string | null;
  fecha: Date;
  idProducto: number;
  idMovimientoTipo: number;
  idEmpleado: number;
  producto?: Producto;
  movimientoTipo?: MovimientoStockTipo;
  empleado?: {
    id: number;
    nombre: string;
  };
}

export interface MovimientoStockTipo {
  id: number;
  nombre: string;
  descripcion: string | null;
  factor: number;
}

export interface CreateMovimientoStockRequest {
  cantidad: number;
  observaciones?: string | null;
  idProducto: number;
  idMovimientoTipo: number;
  idEmpleado: number;
}

export interface MovimientoStockResponse extends BaseResponse {
  data: MovimientoStock;
}

export interface MovimientoStockListResponse extends BaseResponse {
  data: MovimientoStock[];
}

export interface MovimientoStockTipoListResponse extends BaseResponse {
  data: MovimientoStockTipo[];
}

export interface KardexEntry {
  fecha: Date;
  movimientoTipo: string;
  cantidad: number;
  saldo: number;
  observaciones: string | null;
}

export interface KardexResponse extends BaseResponse {
  data: {
    producto: Producto;
    movimientos: KardexEntry[];
  };
}

export interface CreateResponse extends BaseResponse {
  data: number | null; // Returns the created ID
}

export interface UpdateResponse extends BaseResponse {
  data: number | null; // Returns the updated ID
}

export interface DeleteResponse extends BaseResponse {
  data: null;
}

export interface ProductoValorizacion {
  id: number;
  nombre: string;
  stockActual: number;
  precioCosto: number;
  precioVenta: number;
  valorCosto: number; // stockActual * precioCosto
  valorVenta: number; // stockActual * precioVenta
}

export interface ValorizacionInventario {
  totalProductos: number;
  valorCosto: number;
  valorVenta: number;
  productos: ProductoValorizacion[];
}

export interface ValorizacionInventarioResponse extends BaseResponse {
  data: ValorizacionInventario;
}
