/**
 * Constantes de mensajes de error estándar en español
 * Proporciona mensajes consistentes en toda la aplicación
 */
export const ERROR_MESSAGES = {
  // Generic fallbacks
  DEFAULT: 'Error al realizar la solicitud.',
  VALIDATION: 'Error de validación en los datos.',
  NETWORK: 'Error de conexión. Verifique su conexión a internet.',

  // Specific operations
  CREATE_FAILED: 'Error al crear el registro.',
  UPDATE_FAILED: 'Error al actualizar el registro.',
  DELETE_FAILED: 'Error al eliminar el registro.',
  FETCH_FAILED: 'Error al obtener los datos.',
  LIST_FAILED: 'Error al listar los registros.',

  // Authentication (note: AuthInterceptor handles 401 separately)
  AUTH_FAILED: 'Error de autenticación.',
  SESSION_EXPIRED:
    'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',

  // Toast summaries
  TOAST_ERROR: 'Error',
  TOAST_WARNING: 'Advertencia',
  TOAST_SUCCESS: 'Éxito',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
