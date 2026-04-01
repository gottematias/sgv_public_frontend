import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AlergiaListResponse,
  CondicionCronicaListResponse,
} from '../models/alergia.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class AlergiaService {
  private readonly API_URL: string;
  private readonly SERVICE = 'alergia';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  list(): Observable<AlergiaListResponse> {
    return this.http
      .get<AlergiaListResponse>(`${this.API_URL}/${this.SERVICE}/list`)
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<AlergiaListResponse>(),
      );
  }

  listCondicionesCronicas(): Observable<CondicionCronicaListResponse> {
    return this.http
      .get<CondicionCronicaListResponse>(
        `${this.API_URL}/${this.SERVICE}/condicioncronica/list`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<CondicionCronicaListResponse>(),
      );
  }
}
