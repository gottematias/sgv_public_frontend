import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  CreatePagoRequest,
  CreateResponse,
  MetodoPagoListResponse,
  PagoEstadoListResponse,
  PagoListResponse,
} from '../models/venta.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'pago';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(params?: {
    limit?: number;
    offset?: number;
    idVenta?: number;
    idMetodoPago?: number;
    idEstado?: number;
  }): Observable<PagoListResponse> {
    let httpParams = new HttpParams();

    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params?.idVenta !== undefined) {
      httpParams = httpParams.set('idVenta', params.idVenta.toString());
    }
    if (params?.idMetodoPago !== undefined) {
      httpParams = httpParams.set(
        'idMetodoPago',
        params.idMetodoPago.toString(),
      );
    }
    if (params?.idEstado !== undefined) {
      httpParams = httpParams.set('idEstado', params.idEstado.toString());
    }

    return this.http
      .get<PagoListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params: httpParams,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<PagoListResponse>(),
      );
  }

  create(data: CreatePagoRequest): Observable<CreateResponse> {
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

  listMetodosPago(): Observable<MetodoPagoListResponse> {
    return this.http
      .get<MetodoPagoListResponse>(
        `${this.API_URL}/${this.SERVICE}/metodo/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MetodoPagoListResponse>(),
      );
  }

  listEstados(): Observable<PagoEstadoListResponse> {
    return this.http
      .get<PagoEstadoListResponse>(`${this.API_URL}/${this.SERVICE}/estados`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<PagoEstadoListResponse>(),
      );
  }

  updateEstado(idPago: number, idEstado: number): Observable<CreateResponse> {
    const url = `${this.API_URL}/${this.SERVICE}/${idPago}/estado`;
    return this.http.patch<CreateResponse>(url, { idEstado }).pipe(
      tap((response) => {
        if (response.code !== 0) {
          throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
        }
      }),
      this.errorHandler.handleHttpError<CreateResponse>(),
    );
  }
}
