import { HttpErrorResponse } from '@angular/common/http';

/**
 * Estructura de respuesta de error del backend
 */
export interface BackendErrorResponse {
  code?: number;
  error?: string;
  data?: string[] | unknown;
}

/**
 * Información de error parseada
 */
export interface ParsedError {
  message: string;
  statusCode: number;
  statusText: string;
  validationErrors?: string[];
  originalError: HttpErrorResponse | Error;
}

/**
 * Opciones para extracción de mensajes de error
 */
export interface ErrorExtractionOptions {
  fallbackMessage?: string;
  includeStatusMessage?: boolean;
  joinValidationErrors?: boolean;
  separator?: string;
}
