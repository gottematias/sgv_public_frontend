import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EspecieListResponse,
  RazaListResponse,
} from '../models/especie.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class EspecieService {
  private readonly API_URL: string;
  private readonly SERVICE = 'especie';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(): Observable<EspecieListResponse> {
    return this.http
      .get<EspecieListResponse>(`${this.API_URL}/${this.SERVICE}/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<EspecieListResponse>(),
      );
  }

  listRazas(idEspecie?: number): Observable<RazaListResponse> {
    let params = new HttpParams();
    if (idEspecie !== undefined && idEspecie !== null) {
      params = params.set('idEspecie', idEspecie.toString());
    }

    return this.http
      .get<RazaListResponse>(`${this.API_URL}/${this.SERVICE}/raza/list`, {
        params,
      })
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<RazaListResponse>(),
      );
  }
}
