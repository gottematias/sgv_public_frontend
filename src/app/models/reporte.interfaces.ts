import type { BaseResponse } from './generic-response.interface';

export interface ReporteTurnoItem {
  id: number;
  fechaHora: string;
  duracionMinutos: number;
  motivo: string;
  notas: string | null;
  turnoTipo: string;
  turnoEstado: string;
  empleadoNombre: string;
  mascotaNombre: string;
  mascotaEspecie: string;
  mascotaRaza: string;
  clienteNombre: string;
}

export interface ReporteHistorialItem {
  id: number;
  fechaConsulta: string;
  motivoConsulta: string;
  tratamiento: string | null;
  observaciones: string | null;
  empleadoNombre: string;
  mascotaNombre: string;
  mascotaEspecie: string;
  mascotaRaza: string;
  clienteNombre: string;
  diagnosticos: string[];
  examenFisico: {
    peso: number | null;
    temperatura: number | null;
    frecuenciaCardiaca: number | null;
    frecuenciaRespiratoria: number | null;
    presionArterial: string | null;
    saturacionOxigeno: number | null;
  } | null;
}

export interface ReporteProductoItem {
  tipo: 'PRODUCTO' | 'SERVICIO';
  id: number;
  nombre: string;
  codigoInterno: string;
  totalVendido: number;
  totalIngreso: number;
  precio: number;
}

export interface ReporteGananciasDetalle {
  periodo: string;
  ingresosBrutos: number;
  gananciaNeta: number;
  cantidadVentas: number;
}

export interface ReporteGananciasResumen {
  ingresosBrutos: number;
  gananciaNeta: number;
  totalVentas: number;
}

export interface ReporteStockBajoItem {
  id: number;
  nombre: string;
  codigo: string | null;
  codigoInterno: string | null;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  categoria: string | null;
  precioVenta: number;
  precioCosto: number;
  estado: 'SIN_STOCK' | 'STOCK_BAJO';
}

export interface ReporteTurnosResponse extends BaseResponse {
  data: ReporteTurnoItem[];
}

export interface ReporteHistorialesResponse extends BaseResponse {
  data: ReporteHistorialItem[];
}

export interface ReporteProductosResponse extends BaseResponse {
  data: ReporteProductoItem[];
}

export interface ReporteGananciasResponse extends BaseResponse {
  data: {
    resumen: ReporteGananciasResumen;
    detalle: ReporteGananciasDetalle[];
  };
}

export interface ReporteStockBajoResponse extends BaseResponse {
  data: ReporteStockBajoItem[];
}
