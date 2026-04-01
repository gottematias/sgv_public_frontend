import { BaseResponse } from './generic-response.interface';
import { Raza } from './especie.interfaces';
import {
  MascotasAlergias,
  MascotasCondicionCronica,
} from './alergia.interfaces';

export interface MascotaEstado {
  id: number;
  nombre: string;
}

export interface PersonaMascota {
  id: number;
  nombres: string;
  apellidos: string;
  documento?: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  fechaNacimiento?: string | null;
  sexo: string;
  color: string;
  tamanio: string;
  pelaje: string;
  pesoGramos: number | null;
  esterilizado: boolean;
  observaciones?: string | null;
  identificador?: string | null;
  activo: boolean;
  idAdjuntoImagenPerfil?: number | null;

  raza?: Raza;
  mascotaEstado?: MascotaEstado;
  persona?: PersonaMascota;
  mascotasAlergias?: MascotasAlergias[];
  mascotasCondicionesCronicas?: MascotasCondicionCronica[];
}

export interface CreateMascotaRequest {
  nombre: string;
  fechaNacimiento?: string | null;
  sexo?: string;
  color?: string;
  tamanio?: string;
  pelaje?: string;
  pesoGramos?: number | null;
  esterilizado?: boolean;
  observaciones?: string | null;
  identificador?: string | null;
  idRaza: number;
  idMascotaEstado: number;
  idPersona: number;
  idAlergias?: number[];
  idCondicionesCronicas?: number[];
  idAdjuntoImagenPerfil?: number | null;
}

export interface UpdateMascotaRequest {
  nombre?: string;
  fechaNacimiento?: string | null;
  sexo?: string;
  color?: string;
  tamanio?: string;
  pelaje?: string;
  pesoGramos?: number | null;
  esterilizado?: boolean;
  observaciones?: string | null;
  identificador?: string | null;
  idRaza?: number;
  idMascotaEstado?: number;
  idPersona?: number;
  idAlergias?: number[];
  idCondicionesCronicas?: number[];
  activo?: boolean;
  idAdjuntoImagenPerfil?: number | null;
}

export interface MascotaListResponse extends BaseResponse {
  data: Mascota[];
}

export interface MascotaGetResponse extends BaseResponse {
  data: Mascota;
}

export interface MascotaCreateResponse extends BaseResponse {
  data: number | null;
}

export interface MascotaUpdateResponse extends BaseResponse {
  data: number | null;
}

export interface MascotaEstadoListResponse extends BaseResponse {
  data: MascotaEstado[];
}
