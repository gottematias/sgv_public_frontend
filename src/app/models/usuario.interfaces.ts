import { BaseResponse } from './generic-response.interface';
import { Persona } from './persona.interfaces';

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface UsuarioRol {
  idUsuario: number;
  idRol: number;
  rol: Rol;
}

export interface Usuario {
  id: number;
  nombre: string;
  fechaAlta: Date;
  ultimoAcceso: Date;
  activo: boolean;
  idPersona: number;
  persona?: Persona;
  usuariosRoles?: UsuarioRol[];
}

export interface ListResponse extends BaseResponse {
  data: Usuario[];
}

export interface CreateRequest {
  username: string;
  password: string;
  idPersona: number;
  roles?: number[];
}

export interface CreateResponse extends BaseResponse {
  data: number | null;
}

export interface UpdateRequest {
  password?: string;
  activo?: boolean;
  roles?: number[];
}

export interface UpdateResponse extends BaseResponse {
  data: number | null;
}

export interface GetResponse extends BaseResponse {
  data: Usuario;
}

export interface DeleteResponse extends BaseResponse {
  data: null;
}

export interface ListRolesResponse extends BaseResponse {
  data: Rol[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse extends BaseResponse {
  data: null;
}
