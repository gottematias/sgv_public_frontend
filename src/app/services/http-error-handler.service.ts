import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, OperatorFunction } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastNotificationService } from './toast-notification.service';
import { HttpStatusMessage } from '../constants/http-status-message.enum';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';
import {
  BackendErrorResponse,
  ParsedError,
  ErrorExtractionOptions,
} from '../models/http-error.interface';

/**
 * Servicio centralizado para manejo de errores HTTP
 * Proporciona extracción uniforme de mensajes de error y operador RxJS reutilizable
 */
@Injectable({
  providedIn: 'root',
})
export class HttpErrorHandlerService {
  private readonly statusMessageMap: Map<number, string>;

  constructor(
    private readonly toastNotificationService: ToastNotificationService,
  ) {
    this.statusMessageMap = this.initializeStatusMap();
  }

  /**
   * Operador RxJS personalizado para manejo de errores HTTP
   * Registra el error en consola y lanza un error con mensaje amigable
   *
   * @example
   * return this.http.get<Response>(url).pipe(
   *   handleHttpError<Response>()
   * );
   */
  handleHttpError<T>(): OperatorFunction<T, T> {
    return catchError((error: HttpErrorResponse | Error) => {
      console.error('HTTP Error:', error);

      const errorMessage = this.extractErrorMessage(error);
      return throwError(() => new Error(errorMessage));
    });
  }

  /**
   * Extrae un mensaje de error amigable de un HttpErrorResponse
   *
   * Maneja tres formatos de error del backend:
   * 1. error.error.data (array) - errores de validación
   * 2. error.error.error (string) - mensaje de error del backend
   * 3. Código de estado HTTP - mapeo a mensaje en español
   *
   * @param error - Error HTTP o Error estándar
   * @param options - Opciones de configuración para extracción
   * @returns Mensaje de error en español
   */
  extractErrorMessage(
    error: HttpErrorResponse | Error,
    options: ErrorExtractionOptions = {},
  ): string {
    const {
      fallbackMessage = ERROR_MESSAGES.DEFAULT,
      includeStatusMessage = true,
      joinValidationErrors = true,
      separator = ', ',
    } = options;

    // Manejo de errores que no son HttpErrorResponse
    if (!(error instanceof HttpErrorResponse)) {
      return error.message || fallbackMessage;
    }

    const backendError = error.error as BackendErrorResponse | undefined;

    // Prioridad 1: Errores de validación (data array)
    if (backendError?.data && Array.isArray(backendError.data)) {
      if (joinValidationErrors) {
        return backendError.data.join(separator);
      }
      // Si no se unen, retornar el primer error o fallback
      return backendError.data[0] || fallbackMessage;
    }

    // Prioridad 2: Mensaje de error del backend
    if (backendError?.error) {
      return backendError.error;
    }

    // Prioridad 3: Mensaje de código de estado HTTP (si está habilitado)
    if (includeStatusMessage) {
      const statusMessage = this.getStatusMessage(error.status);
      if (statusMessage) {
        return statusMessage;
      }
    }

    // Prioridad 4: Mensaje fallback
    return fallbackMessage;
  }

  /**
   * Parsea un error a una estructura ParsedError con información detallada
   *
   * @param error - Error HTTP o Error estándar
   * @returns Objeto ParsedError con información estructurada
   */
  parseError(error: HttpErrorResponse | Error): ParsedError {
    if (!(error instanceof HttpErrorResponse)) {
      return {
        message: error.message || ERROR_MESSAGES.DEFAULT,
        statusCode: 0,
        statusText: 'Unknown',
        originalError: error,
      };
    }

    const backendError = error.error as BackendErrorResponse | undefined;
    const validationErrors =
      backendError?.data && Array.isArray(backendError.data)
        ? backendError.data
        : undefined;

    return {
      message: this.extractErrorMessage(error),
      statusCode: error.status,
      statusText: error.statusText,
      validationErrors,
      originalError: error,
    };
  }

  /**
   * Obtiene el mensaje en español para un código de estado HTTP
   *
   * @param statusCode - Código de estado HTTP
   * @returns Mensaje en español o null si no existe mapeo
   */
  getStatusMessage(statusCode: number): string | null {
    return this.statusMessageMap.get(statusCode) || null;
  }

  /**
   * Muestra un toast de error con el mensaje extraído
   * Método de conveniencia para mostrar errores al usuario
   *
   * @param error - Error HTTP o Error estándar
   * @param summary - Resumen del toast (por defecto "Error")
   */
  showErrorToast(
    error: HttpErrorResponse | Error,
    summary: string = ERROR_MESSAGES.TOAST_ERROR,
  ): void {
    const message = this.extractErrorMessage(error);
    this.toastNotificationService.showError(summary, message);
  }

  /**
   * Inicializa el mapa de códigos de estado HTTP a mensajes en español
   * @private
   */
  private initializeStatusMap(): Map<number, string> {
    return new Map<number, string>([
      // 1xx Informational
      [100, HttpStatusMessage.CONTINUE],
      [101, HttpStatusMessage.SWITCHING_PROTOCOLS],
      [102, HttpStatusMessage.PROCESSING],

      // 2xx Success
      [200, HttpStatusMessage.OK],
      [201, HttpStatusMessage.CREATED],
      [202, HttpStatusMessage.ACCEPTED],
      [204, HttpStatusMessage.NO_CONTENT],

      // 3xx Redirection
      [301, HttpStatusMessage.MOVED_PERMANENTLY],
      [302, HttpStatusMessage.FOUND],
      [304, HttpStatusMessage.NOT_MODIFIED],
      [307, HttpStatusMessage.TEMPORARY_REDIRECT],

      // 4xx Client Errors
      [400, HttpStatusMessage.BAD_REQUEST],
      [401, HttpStatusMessage.UNAUTHORIZED],
      [402, HttpStatusMessage.PAYMENT_REQUIRED],
      [403, HttpStatusMessage.FORBIDDEN],
      [404, HttpStatusMessage.NOT_FOUND],
      [405, HttpStatusMessage.METHOD_NOT_ALLOWED],
      [406, HttpStatusMessage.NOT_ACCEPTABLE],
      [408, HttpStatusMessage.REQUEST_TIMEOUT],
      [409, HttpStatusMessage.CONFLICT],
      [410, HttpStatusMessage.GONE],
      [412, HttpStatusMessage.PRECONDITION_FAILED],
      [413, HttpStatusMessage.PAYLOAD_TOO_LARGE],
      [422, HttpStatusMessage.UNPROCESSABLE_ENTITY],
      [429, HttpStatusMessage.TOO_MANY_REQUESTS],

      // 5xx Server Errors
      [500, HttpStatusMessage.INTERNAL_SERVER_ERROR],
      [501, HttpStatusMessage.NOT_IMPLEMENTED],
      [502, HttpStatusMessage.BAD_GATEWAY],
      [503, HttpStatusMessage.SERVICE_UNAVAILABLE],
      [504, HttpStatusMessage.GATEWAY_TIMEOUT],

      // Special cases
      [0, HttpStatusMessage.NETWORK_ERROR], // Network error
    ]);
  }
}
