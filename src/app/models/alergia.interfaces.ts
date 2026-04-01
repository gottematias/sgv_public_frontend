import { BaseResponse } from './generic-response.interface';

export interface Alergia {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface CondicionCronica {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface MascotasAlergias {
  idMascota: number;
  idAlergia: number;
  alergia: Alergia;
}

export interface MascotasCondicionCronica {
  idMascota: number;
  idCondicionCronica: number;
  condicionCronica: CondicionCronica;
}

export interface AlergiaListResponse extends BaseResponse {
  data: Alergia[];
}

export interface CondicionCronicaListResponse extends BaseResponse {
  data: CondicionCronica[];
}
