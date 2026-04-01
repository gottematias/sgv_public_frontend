import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  AnularResponse,
  AnularVentaRequest,
  AnulacionVentaMotivoListResponse,
  CreateResponse,
  CreateVentaRequest,
  UpdateResponse,
  UpdateVentaRequest,
  VentaEstadoListResponse,
  VentaListResponse,
  VentaResponse,
} from '../models/venta.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly API_URL: string;
  private readonly SERVICE = 'venta';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(params?: {
    q?: string;
    limit?: number;
    offset?: number;
    idCliente?: number;
    idEmpleado?: number;
    idEstado?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Observable<VentaListResponse> {
    let httpParams = new HttpParams();

    if (params?.q !== undefined && params.q.trim() !== '') {
      httpParams = httpParams.set('q', params.q);
    }
    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params?.idCliente !== undefined) {
      httpParams = httpParams.set('idCliente', params.idCliente.toString());
    }
    if (params?.idEmpleado !== undefined) {
      httpParams = httpParams.set('idEmpleado', params.idEmpleado.toString());
    }
    if (params?.idEstado !== undefined) {
      httpParams = httpParams.set('idEstado', params.idEstado.toString());
    }
    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }

    return this.http
      .get<VentaListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params: httpParams,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VentaListResponse>(),
      );
  }

  get(id: number): Observable<VentaResponse> {
    return this.http
      .get<VentaResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VentaResponse>(),
      );
  }

  create(data: CreateVentaRequest): Observable<CreateResponse> {
    return this.http
      .post<CreateResponse>(`${this.API_URL}/${this.SERVICE}/create`, data)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<CreateResponse>(),
      );
  }

  update(id: number, data: UpdateVentaRequest): Observable<UpdateResponse> {
    return this.http
      .put<UpdateResponse>(`${this.API_URL}/${this.SERVICE}/update/${id}`, data)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<UpdateResponse>(),
      );
  }

  anular(id: number, data: AnularVentaRequest): Observable<AnularResponse> {
    return this.http
      .post<AnularResponse>(
        `${this.API_URL}/${this.SERVICE}/anular/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DEFAULT);
          }
        }),
        this.errorHandler.handleHttpError<AnularResponse>(),
      );
  }

  listEstados(): Observable<VentaEstadoListResponse> {
    return this.http
      .get<VentaEstadoListResponse>(
        `${this.API_URL}/${this.SERVICE}/estado/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<VentaEstadoListResponse>(),
      );
  }

  listMotivosAnulacion(): Observable<AnulacionVentaMotivoListResponse> {
    return this.http
      .get<AnulacionVentaMotivoListResponse>(
        `${this.API_URL}/${this.SERVICE}/anulacion/motivo/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AnulacionVentaMotivoListResponse>(),
      );
  }
}
