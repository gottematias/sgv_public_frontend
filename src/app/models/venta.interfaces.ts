import { BaseResponse } from './generic-response.interface';
import { Producto } from './stock.interfaces';
import { Servicio } from './stock.interfaces';
import { Empleado } from './empleado.interfaces';

export interface Venta {
  id: number;
  fecha: Date;
  totalFinal: number;
  montoAjusteRedondeo: number | null;
  idCliente: number | null;
  idEmpleado: number;
  idEstado: number;
  cliente?: {
    id: number;
    nombres: string;
    apellidos: string;
  } | null;
  empleado: Empleado;
  estado: VentaEstado;
  detalles: DetalleVenta[];
  pagos: Pago[];
}

export interface DetalleVenta {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  idVenta: number;
  idProducto: number | null;
  idServicio: number | null;
  producto?: Producto | null;
  servicio?: Servicio | null;
}

export interface VentaEstado {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface DetalleVentaRequest {
  cantidad: number;
  idProducto?: number | null;
  idServicio?: number | null;
}

export interface CreatePagoInVentaDto {
  monto: number;
  montoBonificado: number;
  referencia?: string | null;
  idMetodoPago: number;
  idEstado: number;
}

export interface CreateVentaRequest {
  idCliente?: number | null;
  montoAjusteRedondeo?: number | null;
  detalles: DetalleVentaRequest[];
  pagos?: CreatePagoInVentaDto[];
}

export interface UpdateVentaRequest {
  idCliente?: number | null;
  detalles?: DetalleVentaRequest[];
}

export interface AnulacionVentaMotivo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface AnularVentaRequest {
  idAnulacionVentaMotivo: number;
  observaciones?: string | null;
}

export interface VentaResponse extends BaseResponse {
  data: Venta;
}

export interface VentaListResponse extends BaseResponse {
  data: Venta[];
}

export interface VentaEstadoListResponse extends BaseResponse {
  data: VentaEstado[];
}

export interface AnulacionVentaMotivoListResponse extends BaseResponse {
  data: AnulacionVentaMotivo[];
}

export interface Pago {
  id: number;
  monto: number;
  montoBonificado: number | null;
  fecha: Date;
  referencia: string | null;
  idVenta: number;
  idMetodoPago: number;
  idEstado: number;
  metodoPago: MetodoPago;
  estado: PagoEstado;
}

export interface MetodoPago {
  id: number;
  nombre: string;
  descripcion: string | null;
  requiereReferencia: boolean;
  activo: boolean;
}

export interface PagoEstado {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface CreatePagoRequest {
  monto: number;
  montoBonificado: number;
  referencia?: string | null;
  idMetodoPago: number;
  idVenta: number;
  idEstado: number;
}

export interface PagoResponse extends BaseResponse {
  data: Pago;
}

export interface PagoListResponse extends BaseResponse {
  data: Pago[];
}

export interface MetodoPagoListResponse extends BaseResponse {
  data: MetodoPago[];
}

export interface PagoEstadoListResponse extends BaseResponse {
  data: PagoEstado[];
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

export interface AnularResponse extends BaseResponse {
  data: null;
}
