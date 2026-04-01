import { BaseResponse } from './generic-response.interface';

export interface Especie {
  id: number;
  nombre: string;
}

export interface Raza {
  id: number;
  nombre: string;
  idEspecie: number;
  especie?: Especie;
}

export interface EspecieListResponse extends BaseResponse {
  data: Especie[];
}

export interface RazaListResponse extends BaseResponse {
  data: Raza[];
}
