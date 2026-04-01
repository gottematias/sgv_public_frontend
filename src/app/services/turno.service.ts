import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/generic-response.interface';
import {
  CreateTurnoRequest,
  UpdateTurnoRequest,
  TurnoListResponse,
  TurnoGetResponse,
  TurnoCreateResponse,
  TurnoUpdateResponse,
  TurnoTipoListResponse,
  TurnoEstadoListResponse,
  TurnoDisponibleListResponse,
} from '../models/turno.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'turno';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  create(data: CreateTurnoRequest): Observable<TurnoCreateResponse> {
    return this.http
      .post<TurnoCreateResponse>(`${this.API_URL}/${this.SERVICE}/create`, data)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoCreateResponse>(),
      );
  }

  update(
    id: number,
    data: UpdateTurnoRequest,
  ): Observable<TurnoUpdateResponse> {
    return this.http
      .put<TurnoUpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoUpdateResponse>(),
      );
  }

  get(id: number): Observable<TurnoGetResponse> {
    return this.http
      .get<TurnoGetResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoGetResponse>(),
      );
  }

  list(params?: {
    idEmpleadoAsignado?: number;
    idMascota?: number;
    idTurnoEstado?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    activo?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<TurnoListResponse> {
    let httpParams = new HttpParams();

    if (params?.idEmpleadoAsignado !== undefined) {
      httpParams = httpParams.set(
        'idEmpleadoAsignado',
        params.idEmpleadoAsignado.toString(),
      );
    }
    if (params?.idMascota !== undefined) {
      httpParams = httpParams.set('idMascota', params.idMascota.toString());
    }
    if (params?.idTurnoEstado !== undefined && params.idTurnoEstado !== '') {
      httpParams = httpParams.set('idTurnoEstado', params.idTurnoEstado);
    }
    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.activo !== undefined) {
      httpParams = httpParams.set('activo', params.activo.toString());
    }
    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    return this.http
      .get<TurnoListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params: httpParams,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoListResponse>(),
      );
  }

  delete(id: number): Observable<BaseResponse> {
    return this.http
      .delete<BaseResponse>(`${this.API_URL}/${this.SERVICE}/delete/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<BaseResponse>(),
      );
  }

  getDisponibles(params: {
    fechaDesde: string;
    fechaHasta: string;
    idEmpleadoAsignado?: number;
    duracion: number;
  }): Observable<TurnoDisponibleListResponse> {
    let httpParams = new HttpParams()
      .set('fechaDesde', params.fechaDesde)
      .set('fechaHasta', params.fechaHasta)
      .set('duracionMinutos', params.duracion.toString());

    // Solo agregar idEmpleadoAsignado si está presente
    if (
      params.idEmpleadoAsignado !== undefined &&
      params.idEmpleadoAsignado !== null
    ) {
      httpParams = httpParams.set(
        'idEmpleadoAsignado',
        params.idEmpleadoAsignado.toString(),
      );
    }

    return this.http
      .get<TurnoDisponibleListResponse>(
        `${this.API_URL}/${this.SERVICE}/disponibles`,
        { params: httpParams },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoDisponibleListResponse>(),
      );
  }

  listTurnoTipos(): Observable<TurnoTipoListResponse> {
    return this.http
      .get<TurnoTipoListResponse>(`${this.API_URL}/${this.SERVICE}/tipo/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoTipoListResponse>(),
      );
  }

  listTurnoEstados(): Observable<TurnoEstadoListResponse> {
    return this.http
      .get<TurnoEstadoListResponse>(
        `${this.API_URL}/${this.SERVICE}/estado/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<TurnoEstadoListResponse>(),
      );
  }
}
