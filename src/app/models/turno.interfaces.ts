import { BaseResponse } from './generic-response.interface';
import { Mascota } from './mascota.interfaces';
import { Empleado } from './empleado.interfaces';
import { Usuario } from './usuario.interfaces';

export interface TurnoTipo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface TurnoEstado {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface Turno {
  id: number;
  fechaHora: string;
  duracionMinutos: number;
  motivo?: string | null;
  notas?: string | null;
  idTurnoTipo: number;
  idTurnoEstado: number;
  idUsuarioRegistro: number;
  idEmpleadoAsignado: number;
  idMascota: number;
  activo: boolean;
  empleadoAsignado?: Empleado;
  usuarioRegistro?: Usuario;
  mascota?: Mascota;
  turnoTipo?: TurnoTipo;
  turnoEstado?: TurnoEstado;
}

export interface SlotDisponible {
  fecha: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  duracionMinutos: number;
}

export interface EmpleadoAsignadoResumen {
  id: number;
  usuario: Usuario;
}

export interface TurnoDisponible {
  empleadoAsignado: EmpleadoAsignadoResumen;
  slotsDisponibles: SlotDisponible[];
}

export interface CreateTurnoRequest {
  fechaHora: string;
  duracionMinutos: number;
  motivo?: string | null;
  notas?: string | null;
  idTurnoTipo: number;
  idTurnoEstado: number;
  idEmpleadoAsignado: number;
  idMascota: number;
}

export interface UpdateTurnoRequest {
  fechaHora?: string;
  duracionMinutos?: number;
  motivo?: string | null;
  notas?: string | null;
  idTurnoTipo?: number;
  idTurnoEstado?: number;
  idEmpleadoAsignado?: number;
  idMascota?: number;
  activo?: boolean;
}

export interface TurnoListResponse extends BaseResponse {
  data: Turno[];
}

export interface TurnoGetResponse extends BaseResponse {
  data: Turno;
}

export interface TurnoCreateResponse extends BaseResponse {
  data: number | null;
}

export interface TurnoUpdateResponse extends BaseResponse {
  data: number | null;
}

export interface TurnoTipoListResponse extends BaseResponse {
  data: TurnoTipo[];
}

export interface TurnoEstadoListResponse extends BaseResponse {
  data: TurnoEstado[];
}

export interface TurnoDisponibleListResponse extends BaseResponse {
  data: TurnoDisponible[];
}

export interface VetSlotGroup {
  empleadoAsignado: EmpleadoAsignadoResumen;
  veterinarioLabel: string;
  slotsPorFecha: DateSlotGroup[];
}

export interface DateSlotGroup {
  fecha: string;
  fechaDisplay: string;
  slots: SlotDisponible[];
}
