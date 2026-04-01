import { BaseResponse } from './generic-response.interface';
import { Mascota } from './mascota.interfaces';
import { Empleado } from './empleado.interfaces';
import { Adjunto } from './adjunto.interfaces';

export interface HistorialClinico {
  id: number;
  motivoConsulta: string;
  fechaConsulta: string;
  tratamiento: string | null;
  observaciones: string | null;
  idMascota: number;
  idEmpleadoAsignado: number;
  activo: boolean;
  mascota: Mascota;
  empleadoAsignado: Empleado;
  examenFisico: ExamenFisico | null;
  historialesDiagnosticos: HistorialClinicoDiagnostico[];
  adjuntosCount: number;
  historialesAdjuntos?: HistorialClinicoAdjunto[];
  adjuntos?: Adjunto[];
}

export interface ExamenFisico {
  id: number;
  pesoGramos: number | null;
  temperaturaCorporal: string | null;
  frecuenciaCardiaca: string | null;
  frecuenciaRespiratoria: string | null;
  estadoHidratacion: string | null;
  general: string | null;
  idHistorialClinico: number;
}

export interface HistorialClinicoDiagnostico {
  idHistorialClinico: number;
  idDiagnostico: number;
  diagnostico: {
    id: number;
    nombre: string;
    descripcion: string | null;
  };
}

export interface HistorialClinicoAdjunto {
  idHistorialClinico: number;
  idAdjunto: number;
  adjunto: {
    id: number;
    nombre: string;
    extension: string;
    mime: string;
    tamanioBytes: string;
    fechaCarga: string;
    descripcion: string | null;
    idAdjuntoTipo: number;
    adjuntoTipo: {
      id: number;
      nombre: string;
      descripcion: string | null;
    };
  };
}

export interface CreateExamenFisicoRequest {
  pesoGramos?: number | null;
  temperaturaCorporal?: string | null;
  frecuenciaCardiaca?: string | null;
  frecuenciaRespiratoria?: string | null;
  estadoHidratacion?: string | null;
  general?: string | null;
}

export interface CreateHistorialClinicoRequest {
  motivoConsulta: string;
  fechaConsulta?: string | null;
  tratamiento?: string | null;
  observaciones?: string | null;
  idMascota: number;
  idEmpleadoAsignado: number;
  examenFisico?: CreateExamenFisicoRequest;
  idDiagnosticos?: number[];
  idAdjuntos?: number[];
}

export interface UpdateHistorialClinicoRequest {
  motivoConsulta?: string;
  fechaConsulta?: string | null;
  tratamiento?: string | null;
  observaciones?: string | null;
  idMascota?: number;
  idEmpleadoAsignado?: number;
  examenFisico?: CreateExamenFisicoRequest;
  idDiagnosticos?: number[];
  idAdjuntos?: number[];
  activo?: boolean;
}

export interface HistorialClinicoListResponse extends BaseResponse {
  data: HistorialClinico[];
}

export interface HistorialClinicoGetResponse extends BaseResponse {
  data: HistorialClinico;
}

export interface HistorialClinicoCreateResponse extends BaseResponse {
  data: number | null;
}

export interface HistorialClinicoUpdateResponse extends BaseResponse {
  data: number | null;
}

export interface HistorialClinicoDeleteResponse extends BaseResponse {
  data: null;
}
