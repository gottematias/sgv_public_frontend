import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateRequest,
  CreateResponse,
  DeleteResponse,
  GetResponse,
  ListResponse,
  ListRolesResponse,
  UpdateRequest,
  UpdateResponse,
} from '../models/usuario.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly API_URL: string;
  private readonly SERVICE = 'usuario';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(
    q?: string,
    limit?: number,
    offset?: number,
    activo?: boolean,
  ): Observable<ListResponse> {
    const params: Record<string, string> = {};
    if (q !== undefined && q.trim() !== '') params['q'] = q;
    if (limit !== undefined) params['limit'] = limit.toString();
    if (offset !== undefined) params['offset'] = offset.toString();
    if (activo !== undefined) params['activo'] = activo.toString();

    return this.http
      .get<ListResponse>(`${this.API_URL}/${this.SERVICE}/list`, { params })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListResponse>(),
      );
  }

  create(data: CreateRequest): Observable<CreateResponse> {
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

  update(id: number, data: UpdateRequest): Observable<UpdateResponse> {
    return this.http
      .put<UpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/` + id.toString(),
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<UpdateResponse>(),
      );
  }

  get(id: number): Observable<GetResponse> {
    return this.http
      .get<GetResponse>(`${this.API_URL}/${this.SERVICE}/get/` + id.toString())
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<GetResponse>(),
      );
  }

  /**
   * Elimina un usuario (soft delete)
   */
  delete(id: number): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(
        `${this.API_URL}/${this.SERVICE}/delete/` + id.toString(),
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<DeleteResponse>(),
      );
  }

  listRoles(): Observable<ListRolesResponse> {
    return this.http
      .get<ListRolesResponse>(`${this.API_URL}/${this.SERVICE}/roles/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListRolesResponse>(),
      );
  }

  changePassword(
    data: ChangePasswordRequest,
  ): Observable<ChangePasswordResponse> {
    return this.http
      .put<ChangePasswordResponse>(
        `${this.API_URL}/${this.SERVICE}/change-password`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ChangePasswordResponse>(),
      );
  }
}
