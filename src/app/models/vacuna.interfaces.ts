import { BaseResponse } from './generic-response.interface';
import { Empleado } from './empleado.interfaces';
import { Mascota } from './mascota.interfaces';

export interface VacunaTipo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Vacuna {
  id: number;
  fechaAplicacion: string;
  fechaProximaAplicacion: string | null;
  lote: string | null;
  numeroSerie: string | null;
  observaciones: string | null;
  activo: boolean;
  idEmpleado: number;
  idMascota: number;
  idVacunaTipo: number;
  empleado?: Empleado;
  mascota?: Mascota;
  vacunaTipo?: VacunaTipo;
}

export interface CreateVacunaRequest {
  fechaAplicacion: string;
  fechaProximaAplicacion?: string | null;
  lote?: string | null;
  numeroSerie?: string | null;
  observaciones?: string | null;
  idEmpleado: number;
  idMascota: number;
  idVacunaTipo: number;
}

export interface UpdateVacunaRequest {
  fechaAplicacion?: string;
  fechaProximaAplicacion?: string | null;
  lote?: string | null;
  numeroSerie?: string | null;
  observaciones?: string | null;
  activo?: boolean;
  idEmpleado?: number;
  idMascota?: number;
  idVacunaTipo?: number;
}

export interface VacunaListResponse extends BaseResponse {
  data: Vacuna[];
}

export interface VacunaGetResponse extends BaseResponse {
  data: Vacuna;
}

export interface VacunaCreateResponse extends BaseResponse {
  data: number | null;
}

export interface VacunaUpdateResponse extends BaseResponse {
  data: number | null;
}

export interface VacunaTipoListResponse extends BaseResponse {
  data: VacunaTipo[];
}

export interface VacunaDeleteResponse extends BaseResponse {
  data: null;
}
