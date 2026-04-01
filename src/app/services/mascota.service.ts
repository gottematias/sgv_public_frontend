import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/generic-response.interface';
import {
  CreateMascotaRequest,
  MascotaCreateResponse,
  MascotaEstadoListResponse,
  MascotaGetResponse,
  MascotaListResponse,
  MascotaUpdateResponse,
  UpdateMascotaRequest,
} from '../models/mascota.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class MascotaService {
  private readonly API_URL: string;
  private readonly SERVICE = 'mascota';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  create(data: CreateMascotaRequest): Observable<MascotaCreateResponse> {
    return this.http
      .post<MascotaCreateResponse>(
        `${this.API_URL}/${this.SERVICE}/create`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MascotaCreateResponse>(),
      );
  }

  update(
    id: number,
    data: UpdateMascotaRequest,
  ): Observable<MascotaUpdateResponse> {
    return this.http
      .put<MascotaUpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MascotaUpdateResponse>(),
      );
  }

  get(id: number): Observable<MascotaGetResponse> {
    return this.http
      .get<MascotaGetResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MascotaGetResponse>(),
      );
  }

  list(
    q?: string,
    limit?: number,
    offset?: number,
    idPersona?: number,
    idMascotaEstados?: number[],
    activo?: boolean,
  ): Observable<MascotaListResponse> {
    const params: Record<string, string> = {};

    if (q !== undefined && q.trim() !== '') {
      params['q'] = q;
    }
    if (limit !== undefined) {
      params['limit'] = limit.toString();
    }
    if (offset !== undefined) {
      params['offset'] = offset.toString();
    }
    if (idPersona !== undefined) {
      params['idPersona'] = idPersona.toString();
    }
    if (idMascotaEstados !== undefined && idMascotaEstados.length > 0) {
      params['idMascotaEstados'] = idMascotaEstados.join(',');
    }
    if (activo !== undefined) {
      params['activo'] = activo.toString();
    }

    return this.http
      .get<MascotaListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MascotaListResponse>(),
      );
  }

  listMascotaEstados(): Observable<MascotaEstadoListResponse> {
    return this.http
      .get<MascotaEstadoListResponse>(
        `${this.API_URL}/${this.SERVICE}/estado/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MascotaEstadoListResponse>(),
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
}
