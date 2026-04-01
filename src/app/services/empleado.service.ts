import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  CreateEmpleadoRequest,
  CreateEmpleadoResponse,
  UpdateEmpleadoRequest,
  UpdateEmpleadoResponse,
  GetEmpleadoResponse,
  ListEmpleadosResponse,
  ListPuestosResponse,
  ListAtributoTiposResponse,
  ListEspecialidadesResponse,
  DeleteEmpleadoResponse,
} from '../models/empleado.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'empleado';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  listEmpleados(
    q?: string,
    limit?: number,
    offset?: number,
    idPuestos?: number[],
    activo?: boolean,
  ): Observable<ListEmpleadosResponse> {
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
    if (idPuestos !== undefined && idPuestos.length > 0) {
      params['idPuestos'] = idPuestos.join(',');
    }
    if (activo !== undefined) {
      params['activo'] = activo.toString();
    }

    return this.http
      .get<ListEmpleadosResponse>(`${this.API_URL}/${this.SERVICE}/list`, {
        params,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListEmpleadosResponse>(),
      );
  }

  getEmpleado(id: number): Observable<GetEmpleadoResponse> {
    return this.http
      .get<GetEmpleadoResponse>(
        `${this.API_URL}/${this.SERVICE}/get/${id.toString()}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<GetEmpleadoResponse>(),
      );
  }

  createEmpleado(
    data: CreateEmpleadoRequest,
  ): Observable<CreateEmpleadoResponse> {
    return this.http
      .post<CreateEmpleadoResponse>(
        `${this.API_URL}/${this.SERVICE}/create`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<CreateEmpleadoResponse>(),
      );
  }

  updateEmpleado(
    id: number,
    data: UpdateEmpleadoRequest,
  ): Observable<UpdateEmpleadoResponse> {
    return this.http
      .put<UpdateEmpleadoResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id.toString()}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<UpdateEmpleadoResponse>(),
      );
  }

  listVeterinarios(
    q?: string,
    limit?: number,
    offset?: number,
  ): Observable<ListEmpleadosResponse> {
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

    return this.http
      .get<ListEmpleadosResponse>(
        `${this.API_URL}/${this.SERVICE}/veterinarios`,
        { params },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListEmpleadosResponse>(),
      );
  }

  listPuestos(): Observable<ListPuestosResponse> {
    return this.http
      .get<ListPuestosResponse>(`${this.API_URL}/${this.SERVICE}/puesto/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListPuestosResponse>(),
      );
  }

  listAtributoTipos(): Observable<ListAtributoTiposResponse> {
    return this.http
      .get<ListAtributoTiposResponse>(
        `${this.API_URL}/${this.SERVICE}/atributo-tipo/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListAtributoTiposResponse>(),
      );
  }

  listEspecialidades(
    idPuesto?: number,
  ): Observable<ListEspecialidadesResponse> {
    const params: Record<string, string> = {};

    if (idPuesto !== undefined) {
      params['idPuesto'] = idPuesto.toString();
    }

    return this.http
      .get<ListEspecialidadesResponse>(
        `${this.API_URL}/${this.SERVICE}/especialidad/list`,
        { params },
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListEspecialidadesResponse>(),
      );
  }

  delete(id: number): Observable<DeleteEmpleadoResponse> {
    return this.http
      .delete<DeleteEmpleadoResponse>(
        `${this.API_URL}/${this.SERVICE}/delete/${id}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<DeleteEmpleadoResponse>(),
      );
  }
}
