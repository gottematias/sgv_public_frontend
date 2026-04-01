import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  HistorialClinicoListResponse,
  HistorialClinicoGetResponse,
  HistorialClinicoCreateResponse,
  HistorialClinicoUpdateResponse,
  HistorialClinicoDeleteResponse,
  CreateHistorialClinicoRequest,
  UpdateHistorialClinicoRequest,
} from '../models/historial-clinico.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class HistorialClinicoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'historial-clinico';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  create(
    data: CreateHistorialClinicoRequest,
  ): Observable<HistorialClinicoCreateResponse> {
    return this.http
      .post<HistorialClinicoCreateResponse>(
        `${this.API_URL}/${this.SERVICE}/create`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<HistorialClinicoCreateResponse>(),
      );
  }

  update(
    id: number,
    data: UpdateHistorialClinicoRequest,
  ): Observable<HistorialClinicoUpdateResponse> {
    return this.http
      .put<HistorialClinicoUpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<HistorialClinicoUpdateResponse>(),
      );
  }

  get(id: number): Observable<HistorialClinicoGetResponse> {
    return this.http
      .get<HistorialClinicoGetResponse>(
        `${this.API_URL}/${this.SERVICE}/get/${id}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<HistorialClinicoGetResponse>(),
      );
  }

  list(params?: {
    q?: string;
    idMascota?: number;
    idEmpleadoAsignado?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    activo?: boolean;
    limit?: number;
    offset?: number;
  }): Observable<HistorialClinicoListResponse> {
    let httpParams = new HttpParams();

    if (params?.q !== undefined && params.q.trim() !== '') {
      httpParams = httpParams.set('q', params.q);
    }
    if (params?.idMascota !== undefined) {
      httpParams = httpParams.set('idMascota', params.idMascota.toString());
    }
    if (params?.idEmpleadoAsignado !== undefined) {
      httpParams = httpParams.set(
        'idEmpleadoAsignado',
        params.idEmpleadoAsignado.toString(),
      );
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
      .get<HistorialClinicoListResponse>(
        `${this.API_URL}/${this.SERVICE}/list`,
        { params: httpParams },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<HistorialClinicoListResponse>(),
      );
  }

  delete(id: number): Observable<HistorialClinicoDeleteResponse> {
    return this.http
      .delete<HistorialClinicoDeleteResponse>(
        `${this.API_URL}/${this.SERVICE}/delete/${id}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<HistorialClinicoDeleteResponse>(),
      );
  }
}
