import { BaseResponse } from './generic-response.interface';

export interface Persona {
  id: number;
  nombres: string;
  apellidos: string;
  documento: string | null;
  documentoTipo: DocumentoTipo | null;
  direcciones: Direccion[];
  contactos: Contacto[];
  activo: boolean;
  idDocumentoTipo: number;
}

export interface DocumentoTipo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Direccion {
  id: number;
  calle: string;
  numero: string;
  piso: string | null;
  departamento: string | null;
  observaciones: string | null;
  idPersona: number;
  idCiudad: number;
  ciudad: Ciudad;
}

export interface Ciudad {
  id: number;
  nombre: string;
  codigoPostal: string;
  idProvincia: number;
  provincia: Provincia;
}

export interface Provincia {
  id: number;
  nombre: string;
  idPais: number;
  pais: Pais;
}

export interface Pais {
  id: number;
  nombre: string;
}

export interface Contacto {
  id: number;
  dato: string;
  idPersona: number;
  idContactoTipo: number;
  contactoTipo: ContactoTipo;
}

export interface ContactoTipo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ListResponse extends BaseResponse {
  data: Persona[];
}

export interface ListDocumentoTipoResponse extends BaseResponse {
  data: DocumentoTipo[];
}

export interface CreateDireccionRequest {
  calle: string;
  numero: string;
  piso?: string | null;
  departamento?: string | null;
  observaciones?: string | null;
  idCiudad: number;
  idPersona: number;
}

export interface UpdateDireccionRequest {
  calle?: string;
  numero?: string;
  piso?: string | null;
  departamento?: string | null;
  observaciones?: string | null;
  idCiudad?: number;
}

export interface CreateContactoRequest {
  dato: string;
  idContactoTipo: number;
  idPersona: number;
}

export interface UpdateContactoRequest {
  dato: string;
  idContactoTipo: number;
}

export interface CreateRequest {
  nombres: string;
  apellidos: string;
  documento: string;
  idDocumentoTipo: number;
  direccion?: CreateDireccionRequest;
  contactos?: CreateContactoRequest[];
}

export interface CreateResponse extends BaseResponse {
  data: number | null;
}

export interface UpdateRequest {
  nombres?: string;
  apellidos?: string;
  documento?: string;
  idDocumentoTipo?: number;
  direccion?: UpdateDireccionRequest;
  contactos?: UpdateContactoRequest[];
  activo?: boolean;
}

export interface UpdateResponse extends BaseResponse {
  data: number | null;
}

export interface GetResponse extends BaseResponse {
  data: Persona;
}

export interface DeleteResponse extends BaseResponse {
  data: null;
}
