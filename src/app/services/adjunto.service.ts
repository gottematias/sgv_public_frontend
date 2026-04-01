import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import type {
  AdjuntoListResponse,
  AdjuntoGetResponse,
  AdjuntoUploadResponse,
  AdjuntoUpdateResponse,
  AdjuntoDeleteResponse,
  AdjuntoTipoListResponse,
  UploadAdjuntoRequest,
  UpdateAdjuntoRequest,
} from '../models/adjunto.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class AdjuntoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'adjunto';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  upload(request: UploadAdjuntoRequest): Observable<AdjuntoUploadResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    if (request.descripcion) {
      formData.append('descripcion', request.descripcion);
    }
    formData.append('idAdjuntoTipo', request.idAdjuntoTipo.toString());

    return this.http
      .post<AdjuntoUploadResponse>(
        `${this.API_URL}/${this.SERVICE}/upload`,
        formData,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.CREATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AdjuntoUploadResponse>(),
      );
  }

  download(id: number): Observable<Blob> {
    return this.http
      .get(`${this.API_URL}/${this.SERVICE}/download/${id}`, {
        responseType: 'blob',
      })
      .pipe(this.errorHandler.handleHttpError<Blob>());
  }

  view(id: number): Observable<Blob> {
    return this.http
      .get(`${this.API_URL}/${this.SERVICE}/view/${id}`, {
        responseType: 'blob',
      })
      .pipe(this.errorHandler.handleHttpError<Blob>());
  }

  get(id: number): Observable<AdjuntoGetResponse> {
    return this.http
      .get<AdjuntoGetResponse>(`${this.API_URL}/${this.SERVICE}/get/${id}`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.FETCH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AdjuntoGetResponse>(),
      );
  }

  list(idAdjuntoTipo?: number): Observable<AdjuntoListResponse> {
    let url = `${this.API_URL}/${this.SERVICE}/list`;
    if (idAdjuntoTipo) {
      url += `?idAdjuntoTipo=${idAdjuntoTipo}`;
    }

    return this.http.get<AdjuntoListResponse>(url).pipe(
      tap((response) => {
        if (response.code !== 0) {
          throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
        }
      }),
      this.errorHandler.handleHttpError<AdjuntoListResponse>(),
    );
  }

  update(
    id: number,
    data: UpdateAdjuntoRequest,
  ): Observable<AdjuntoUpdateResponse> {
    return this.http
      .put<AdjuntoUpdateResponse>(
        `${this.API_URL}/${this.SERVICE}/update/${id}`,
        data,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.UPDATE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AdjuntoUpdateResponse>(),
      );
  }

  delete(id: number): Observable<AdjuntoDeleteResponse> {
    return this.http
      .delete<AdjuntoDeleteResponse>(
        `${this.API_URL}/${this.SERVICE}/delete/${id}`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.DELETE_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AdjuntoDeleteResponse>(),
      );
  }

  listAdjuntoTipos(idReferencia?: number): Observable<AdjuntoTipoListResponse> {
    let url = `${this.API_URL}/${this.SERVICE}/tipo/list`;
    if (idReferencia) {
      url += `?idReferencia=${idReferencia}`;
    }

    return this.http.get<AdjuntoTipoListResponse>(url).pipe(
      tap((response) => {
        if (response.code !== 0) {
          throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
        }
      }),
      this.errorHandler.handleHttpError<AdjuntoTipoListResponse>(),
    );
  }
}
