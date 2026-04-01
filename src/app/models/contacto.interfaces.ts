import { BaseResponse } from './generic-response.interface';

export interface ContactoTipo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ListContactoTipoResponse extends BaseResponse {
  data: ContactoTipo[];
}
