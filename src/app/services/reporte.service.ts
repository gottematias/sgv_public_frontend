import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  ReporteTurnosResponse,
  ReporteHistorialesResponse,
  ReporteProductosResponse,
  ReporteGananciasResponse,
  ReporteStockBajoResponse,
} from '../models/reporte.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private readonly API_URL: string;
  private readonly SERVICE = 'reporte';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  getTurnos(params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    idEmpleado?: number;
    idEstado?: number;
    limit?: number;
    offset?: number;
  }): Observable<ReporteTurnosResponse> {
    let httpParams = new HttpParams();

    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.idEmpleado !== undefined) {
      httpParams = httpParams.set('idEmpleado', params.idEmpleado.toString());
    }
    if (params?.idEstado !== undefined) {
      httpParams = httpParams.set('idEstado', params.idEstado.toString());
    }
    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    return this.http
      .get<ReporteTurnosResponse>(`${this.API_URL}/${this.SERVICE}/turnos`, {
        params: httpParams,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ReporteTurnosResponse>(),
      );
  }

  getHistorialesClinicos(params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    idEmpleado?: number;
    idMascota?: number;
    limit?: number;
    offset?: number;
  }): Observable<ReporteHistorialesResponse> {
    let httpParams = new HttpParams();

    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.idEmpleado !== undefined) {
      httpParams = httpParams.set('idEmpleado', params.idEmpleado.toString());
    }
    if (params?.idMascota !== undefined) {
      httpParams = httpParams.set('idMascota', params.idMascota.toString());
    }
    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.offset !== undefined) {
      httpParams = httpParams.set('offset', params.offset.toString());
    }

    return this.http
      .get<ReporteHistorialesResponse>(
        `${this.API_URL}/${this.SERVICE}/historiales-clinicos`,
        { params: httpParams },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ReporteHistorialesResponse>(),
      );
  }

  getProductosMasVendidos(params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    limit?: number;
  }): Observable<ReporteProductosResponse> {
    let httpParams = new HttpParams();

    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http
      .get<ReporteProductosResponse>(
        `${this.API_URL}/${this.SERVICE}/productos-mas-vendidos`,
        { params: httpParams },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ReporteProductosResponse>(),
      );
  }

  getGanancias(params?: {
    fechaDesde?: string;
    fechaHasta?: string;
    agruparPor?: 'dia' | 'mes' | 'anio';
  }): Observable<ReporteGananciasResponse> {
    let httpParams = new HttpParams();

    if (params?.fechaDesde !== undefined) {
      httpParams = httpParams.set('fechaDesde', params.fechaDesde);
    }
    if (params?.fechaHasta !== undefined) {
      httpParams = httpParams.set('fechaHasta', params.fechaHasta);
    }
    if (params?.agruparPor !== undefined) {
      httpParams = httpParams.set('agruparPor', params.agruparPor);
    }

    return this.http
      .get<ReporteGananciasResponse>(
        `${this.API_URL}/${this.SERVICE}/ganancias`,
        { params: httpParams },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ReporteGananciasResponse>(),
      );
  }

  getStockBajo(): Observable<ReporteStockBajoResponse> {
    return this.http
      .get<ReporteStockBajoResponse>(
        `${this.API_URL}/${this.SERVICE}/stock-bajo`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ReporteStockBajoResponse>(),
      );
  }

  exportar(
    endpoint: string,
    formato: 'xlsx' | 'csv',
    params?: Record<string, string>,
  ): Observable<Blob> {
    let httpParams = new HttpParams().set('formato', formato);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, value);
      }
    }

    return this.http.get(`${this.API_URL}/${this.SERVICE}/${endpoint}/export`, {
      params: httpParams,
      responseType: 'blob',
    });
  }
}
