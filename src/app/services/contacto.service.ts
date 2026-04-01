import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ListContactoTipoResponse } from '../models/contacto.interfaces';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class ContactoService {
  private readonly API_URL: string;
  private readonly SERVICE = 'contacto';

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
  }

  listContactoTipo(): Observable<ListContactoTipoResponse> {
    return this.http
      .get<ListContactoTipoResponse>(
        `${this.API_URL}/${this.SERVICE}/listcontactotipo`,
      )
      .pipe(
        tap((response) => {
          if (response.code !== 0) {
            throw new Error(response.error ?? ERROR_MESSAGES.LIST_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<ListContactoTipoResponse>(),
      );
  }
}
