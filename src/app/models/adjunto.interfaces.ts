import { BaseResponse } from './generic-response.interface';

export enum AdjuntoTipoId {
  HISTORIAL_REGISTRO_FOTOGRAFICO = 1,
  HISTORIAL_INFORMES_LABORATORIO = 2,
  HISTORIAL_ESTUDIOS_IMAGEN = 3,
  HISTORIAL_CERTIFICADOS_RECETAS = 4,
  HISTORIAL_INFORMES_ESPECIALISTAS = 5,

  MASCOTA_FOTO_PERFIL = 6,
  MASCOTA_GALERIA_FOTOS = 7,
  MASCOTA_DOCUMENTOS_ADOPCION = 8,
  MASCOTA_PEDIGREE = 9,
  MASCOTA_IDENTIFICACION_CHIP_TATUAJE = 10,
}

export enum ReferenciaId {
  HISTORIAL_CLINICO = 1,
  MASCOTA = 2,
}

export interface Adjunto {
  id: number;
  nombre: string;
  extension: string;
  mime: string;
  tamanioBytes: string;
  fechaCarga: string;
  descripcion: string | null;
  idAdjuntoTipo: number;
  adjuntoTipo: AdjuntoTipo;
}

export interface AdjuntoTipo {
  id: number;
  nombre: string;
  descripcion: string | null;
  idReferencia?: number | null;
  referencia?: Referencia | null;
}

export interface Referencia {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export interface UploadAdjuntoRequest {
  file: File;
  descripcion?: string | null;
  idAdjuntoTipo: number;
}

export interface UpdateAdjuntoRequest {
  descripcion?: string | null;
  idAdjuntoTipo?: number;
}

export interface AdjuntoListResponse extends BaseResponse {
  data: Adjunto[];
}

export interface AdjuntoGetResponse extends BaseResponse {
  data: Adjunto;
}

export interface AdjuntoUploadResponse extends BaseResponse {
  data: number | null;
}

export interface AdjuntoUpdateResponse extends BaseResponse {
  data: number | null;
}

export interface AdjuntoDeleteResponse extends BaseResponse {
  data: null;
}

export interface AdjuntoTipoListResponse extends BaseResponse {
  data: AdjuntoTipo[];
}

export interface ReferenciaListResponse extends BaseResponse {
  data: Referencia[];
}
