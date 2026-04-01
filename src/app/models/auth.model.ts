export interface AuthEstado {
  autenticado: boolean;
  token: string | null;
  token_expiracion: Date | null;
  usuario_id: number | null;
  usuario_nombre: string | null;
  persona_id: number | null;
  persona_nombres: string | null;
  persona_apellidos: string | null;
  rol_id: number[] | null;
}

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  data: {
    token: string;
    exp: string;
  };
  code: number;
  error: string;
}

export interface JwtPayload {
  usuario_id: number;
  usuario_nombre: string;
  persona_id: number;
  persona_nombre: string;
  persona_apellido: string;
  rol_id: number[];
  iat: number;
  exp: number;
}
