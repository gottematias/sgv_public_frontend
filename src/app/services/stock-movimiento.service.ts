import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  CreateMovimientoStockRequest,
  CreateResponse,
  KardexResponse,
  MovimientoStockListResponse,
  MovimientoStockTipoListResponse,
} from '../models/stock.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class StockMovimientoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'stock/movimiento';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(params?: {
    limit?: number;
    offset?: number;
    idProducto?: number;
    idMovimientoTipo?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Observable<MovimientoStockListResponse> {
    let httpParams = new HttpParams();

    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }
    if (params?.idProducto !== undefined) {
      httpParams = httpParams.set('idProducto', params.idProducto.toString());
    }
    if (params?.idMovimientoTipo !== undefined) {
      httpParams = httpParams.set(
        'idMovimientoTipo',
        params.idMovimientoTipo.toString(),
      );
    }
    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }

    return this.http
      .get<MovimientoStockListResponse>(
        `${this.API_URL}/${this.SERVICE}/list`,
        {
          params: httpParams,
        },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MovimientoStockListResponse>(),
      );
  }

  listTipos(): Observable<MovimientoStockTipoListResponse> {
    return this.http
      .get<MovimientoStockTipoListResponse>(
        `${this.API_URL}/${this.SERVICE}/tipo/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<MovimientoStockTipoListResponse>(),
      );
  }

  create(data: CreateMovimientoStockRequest): Observable<CreateResponse> {
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

  getKardex(idProducto: number): Observable<KardexResponse> {
    return this.http
      .get<KardexResponse>(
        `${this.API_URL}/stock/producto/${idProducto}/kardex`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<KardexResponse>(),
      );
  }
}
