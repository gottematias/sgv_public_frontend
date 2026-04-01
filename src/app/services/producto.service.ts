import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  CreateProductoRequest,
  CreateResponse,
  DeleteResponse,
  ProductoCategoriaListResponse,
  ProductoListResponse,
  ProductoResponse,
  UpdateProductoRequest,
  UpdateResponse,
  ValorizacionInventarioResponse,
} from '../models/stock.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'producto';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(
    q?: string,
    idCategoria?: number,
    limit?: number,
    offset?: number,
    activo?: boolean,
  ): Observable<ProductoListResponse> {
    const params: Record<string, string> = {};

    if (q !== undefined && q.trim() !== '') {
      params['q'] = q;
    }
    if (idCategoria !== undefined) {
      params['idCategoria'] = idCategoria.toString();
    }
    if (limit !== undefined) {
      params['limit'] = limit.toString();
    }
    if (offset !== undefined) {
      params['offset'] = offset.toString();
    }
    if (activo !== undefined) {
      params['activo'] = activo.toString();
    }

    return this.http
      .get<ProductoListResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ProductoListResponse>(),
      );
  }

  listCategorias(): Observable<ProductoCategoriaListResponse> {
    return this.http
      .get<ProductoCategoriaListResponse>(
        `${this.API_URL}/${this.SERVICE}/categoria/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ProductoCategoriaListResponse>(),
      );
  }

  get(id: number): Observable<ProductoResponse> {
    return this.http
      .get<ProductoResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ProductoResponse>(),
      );
  }

  create(data: CreateProductoRequest): Observable<CreateResponse> {
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

  update(id: number, data: UpdateProductoRequest): Observable<UpdateResponse> {
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

  delete(id: number): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(`${this.API_URL}/${this.SERVICE}/delete/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<DeleteResponse>(),
      );
  }

  getStockBajo(): Observable<ProductoListResponse> {
    return this.http
      .get<ProductoListResponse>(
        `${this.API_URL}/${this.SERVICE}/reportes/stock-bajo`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DEFAULT);
          }
        }),
        this.errorHandler.handleHttpError<ProductoListResponse>(),
      );
  }

  getProximosVencer(dias = 30): Observable<ProductoListResponse> {
    const params: Record<string, string> = {};

    if (dias !== undefined) {
      params['dias'] = dias.toString();
    }

    return this.http
      .get<ProductoListResponse>(
        `${this.API_URL}/${this.SERVICE}/reportes/proximos-vencer`,
        { params },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DEFAULT);
          }
        }),
        this.errorHandler.handleHttpError<ProductoListResponse>(),
      );
  }

  getValorizacion(): Observable<ValorizacionInventarioResponse> {
    return this.http
      .get<ValorizacionInventarioResponse>(
        `${this.API_URL}/${this.SERVICE}/reportes/valorizacion`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DEFAULT);
          }
        }),
        this.errorHandler.handleHttpError<ValorizacionInventarioResponse>(),
      );
  }
}
