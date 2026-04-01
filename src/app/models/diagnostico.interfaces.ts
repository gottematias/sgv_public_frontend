import { BaseResponse } from './generic-response.interface';

export interface Diagnostico {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface DiagnosticoListResponse extends BaseResponse {
  data: Diagnostico[];
}
