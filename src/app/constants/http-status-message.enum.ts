/**
 * Mensajes en español para códigos de estado HTTP
 * Utilizados para proporcionar feedback amigable al usuario
 */
export enum HttpStatusMessage {
  // 1xx Informational
  CONTINUE = 'Continuar con la solicitud',
  SWITCHING_PROTOCOLS = 'Cambiando protocolos',
  PROCESSING = 'Procesando solicitud',

  // 2xx Success
  OK = 'Operación exitosa',
  CREATED = 'Recurso creado exitosamente',
  ACCEPTED = 'Solicitud aceptada',
  NO_CONTENT = 'Sin contenido',

  // 3xx Redirection
  MOVED_PERMANENTLY = 'Recurso movido permanentemente',
  FOUND = 'Recurso encontrado en otra ubicación',
  NOT_MODIFIED = 'Recurso no modificado',
  TEMPORARY_REDIRECT = 'Redirección temporal',

  // 4xx Client Errors
  BAD_REQUEST = 'Solicitud inválida. Verifique los datos enviados',
  UNAUTHORIZED = 'No autorizado. Por favor, inicie sesión',
  PAYMENT_REQUIRED = 'Pago requerido',
  FORBIDDEN = 'Acceso prohibido. No tiene permisos para esta acción',
  NOT_FOUND = 'Recurso no encontrado',
  METHOD_NOT_ALLOWED = 'Método HTTP no permitido',
  NOT_ACCEPTABLE = 'Formato no aceptable',
  REQUEST_TIMEOUT = 'Tiempo de espera agotado',
  CONFLICT = 'Conflicto con el estado actual del recurso',
  GONE = 'Recurso ya no disponible',
  PRECONDITION_FAILED = 'Condición previa fallida',
  PAYLOAD_TOO_LARGE = 'Tamaño de datos excedido',
  UNPROCESSABLE_ENTITY = 'Datos inválidos. Verifique la información',
  TOO_MANY_REQUESTS = 'Demasiadas solicitudes. Intente nuevamente más tarde',

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR = 'Error interno del servidor',
  NOT_IMPLEMENTED = 'Funcionalidad no implementada',
  BAD_GATEWAY = 'Error en la puerta de enlace',
  SERVICE_UNAVAILABLE = 'Servicio no disponible temporalmente',
  GATEWAY_TIMEOUT = 'Tiempo de espera de puerta de enlace agotado',

  // Network/Unknown
  NETWORK_ERROR = 'Error de conexión. Verifique su conexión a internet',
  UNKNOWN_ERROR = 'Error desconocido. Intente nuevamente',
}
