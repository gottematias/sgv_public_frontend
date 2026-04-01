import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateVacunaRequest,
  UpdateVacunaRequest,
  VacunaCreateResponse,
  VacunaGetResponse,
  VacunaListResponse,
  VacunaUpdateResponse,
  VacunaTipoListResponse,
  VacunaDeleteResponse,
} from '../models/vacuna.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class VacunaService {
  private readonly API_URL: string;
  private readonly SERVICE = 'vacuna';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  create(data: CreateVacunaRequest): Observable<VacunaCreateResponse> {
    return this.http
      .post<VacunaCreateResponse>(
        `${this.API_URL}/${this.SERVICE}/create`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaCreateResponse>(),
      );
  }

  update(
    id: number,
    data: UpdateVacunaRequest,
  ): Observable<VacunaUpdateResponse> {
    return this.http
      .put<VacunaUpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaUpdateResponse>(),
      );
  }

  get(id: number): Observable<VacunaGetResponse> {
    return this.http
      .get<VacunaGetResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaGetResponse>(),
      );
  }

  list(params?: {
    limit?: number;
    offset?: number;
    idMascota?: number;
    idEmpleado?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    fechaDesdeProximaAplicacion?: string;
    fechaHastaProximaAplicacion?: string;
    activo?: boolean;
  }): Observable<VacunaListResponse> {
    let httpParams = new HttpParams();

    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params?.idMascota !== undefined) {
      httpParams = httpParams.set('idMascota', params.idMascota.toString());
    }
    if (params?.idEmpleado !== undefined) {
      httpParams = httpParams.set('idEmpleado', params.idEmpleado.toString());
    }
    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.fechaDesdeProximaAplicacion !== undefined) {
      httpParams = httpParams.set(
        'fechaDesdeProximaAplicacion',
        params.fechaDesdeProximaAplicacion,
      );
    }
    if (params?.fechaHastaProximaAplicacion !== undefined) {
      httpParams = httpParams.set(
        'fechaHastaProximaAplicacion',
        params.fechaHastaProximaAplicacion,
      );
    }
    if (params?.activo !== undefined) {
      httpParams = httpParams.set('activo', params.activo.toString());
    }

    return this.http
      .get<VacunaListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params: httpParams,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaListResponse>(),
      );
  }

  listVacunaTipos(): Observable<VacunaTipoListResponse> {
    return this.http
      .get<VacunaTipoListResponse>(`${this.API_URL}/${this.SERVICE}/tipo/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaTipoListResponse>(),
      );
  }

  delete(id: number): Observable<VacunaDeleteResponse> {
    return this.http
      .delete<VacunaDeleteResponse>(
        `${this.API_URL}/${this.SERVICE}/delete/${id}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VacunaDeleteResponse>(),
      );
  }
}
