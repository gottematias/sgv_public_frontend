import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import type { DiagnosticoListResponse } from '../models/diagnostico.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class DiagnosticoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'diagnostico';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(): Observable<DiagnosticoListResponse> {
    return this.http
      .get<DiagnosticoListResponse>(`${this.API_URL}/${this.SERVICE}/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<DiagnosticoListResponse>(),
      );
  }
}
