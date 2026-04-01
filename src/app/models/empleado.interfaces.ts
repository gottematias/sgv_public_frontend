import { BaseResponse } from './generic-response.interface';
import { Usuario } from './usuario.interfaces';

export interface Puesto {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface AtributoTipo {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface EmpleadoPuesto {
  id: number;
  idEmpleado: number;
  idPuesto: number;
  fechaInicio: string;
  fechaFin: string | null;
  activo: boolean;
  puesto?: Puesto;
}

export interface EmpleadoAtributo {
  id: number;
  valor: string;
  idAtributoTipo: number;
  idEmpleado: number;
  atributoTipo?: AtributoTipo;
}

export interface EmpleadoEspecialidad {
  idEmpleado: number;
  idEspecialidad: number;
  especialidad?: Especialidad;
}

export interface Empleado {
  id: number;
  fechaIngreso: string;
  fechaEgreso: string | null;
  activo: boolean;
  idUsuario: number;
  usuario?: Usuario;
  empleadosPuestos?: EmpleadoPuesto[];
  empleadosAtributos?: EmpleadoAtributo[];
  empleadosEspecialidades?: EmpleadoEspecialidad[];
}

export interface EmpleadoPuestoDto {
  id: number;
  fechaInicio: string;
  fechaFin?: string | null;
}

export interface CreateEmpleadoAtributoDto {
  idAtributoTipo: number;
  valor: string;
}

export interface CreateEmpleadoRequest {
  idUsuario: number;
  fechaIngreso: string;
  puestos?: EmpleadoPuestoDto[];
  atributos?: CreateEmpleadoAtributoDto[];
  idEspecialidades?: number[];
}

export interface UpdateEmpleadoRequest {
  fechaIngreso?: string;
  fechaEgreso?: string;
  activo?: boolean;
  puestos?: EmpleadoPuestoDto[];
  atributos?: CreateEmpleadoAtributoDto[];
  idEspecialidades?: number[];
}

export interface CreateEmpleadoResponse extends BaseResponse {
  data: number | null;
}

export interface UpdateEmpleadoResponse extends BaseResponse {
  data: number | null;
}

export interface GetEmpleadoResponse extends BaseResponse {
  data: Empleado;
}

export interface ListEmpleadosResponse extends BaseResponse {
  data: Empleado[];
}

export interface ListPuestosResponse extends BaseResponse {
  data: Puesto[];
}

export interface ListAtributoTiposResponse extends BaseResponse {
  data: AtributoTipo[];
}

export interface ListEspecialidadesResponse extends BaseResponse {
  data: Especialidad[];
}

export interface DeleteEmpleadoResponse extends BaseResponse {
  data: null;
}
