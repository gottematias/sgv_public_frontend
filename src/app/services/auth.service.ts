import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
  interval,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  AuthEstado,
  JwtPayload,
  LoginRequest,
  LoginResponse,
} from '../models/auth.model';
import { Keys } from '../constants/keys.enum';
import { environment } from '../../environments/environment';
import { HttpErrorHandlerService } from './http-error-handler.service';
import { ERROR_MESSAGES } from '../constants/error-messages.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private readonly API_URL: string;
  private refreshTokenSubscription?: Subscription;

  private readonly authEstadoSubject = new BehaviorSubject<AuthEstado>({
    autenticado: false,
    token: null,
    token_expiracion: null,
    usuario_id: null,
    usuario_nombre: null,
    persona_id: null,
    persona_nombres: null,
    persona_apellidos: null,
    rol_id: null,
  });

  public authEstado$ = this.authEstadoSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly errorHandler: HttpErrorHandlerService,
  ) {
    this.API_URL = environment.apiUrl.toLowerCase();
    this.loadAuthEstado();
  }

  ngOnDestroy(): void {
    this.stopRefreshToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.code === 0) {
            this.loginExitoso(response);
          } else {
            throw new Error(response.error ?? ERROR_MESSAGES.AUTH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<LoginResponse>(),
      );
  }

  private loginExitoso(response: LoginResponse): void {
    try {
      const decodedToken: JwtPayload = jwtDecode(response.data.token);
      const token_expiracion = new Date(decodedToken.exp * 1000);

      const usuario_id = decodedToken.usuario_id || 0;
      const usuario_nombre = decodedToken.usuario_nombre || '';
      const persona_id = decodedToken.persona_id || 0;
      const persona_nombres = decodedToken.persona_nombre || '';
      const persona_apellidos = decodedToken.persona_apellido || '';
      const rol_id = decodedToken.rol_id || [];

      localStorage.setItem(Keys.TOKEN, response.data.token);
      localStorage.setItem(
        Keys.TOKEN_EXPIRACION,
        token_expiracion.toISOString(),
      );
      localStorage.setItem(Keys.USUARIO_ID, usuario_id.toString());
      localStorage.setItem(Keys.USUARIO_NOMBRE, usuario_nombre);
      localStorage.setItem(Keys.PERSONA_ID, persona_id.toString());
      localStorage.setItem(Keys.PERSONA_NOMBRES, persona_nombres);
      localStorage.setItem(Keys.PERSONA_APELLIDOS, persona_apellidos);
      localStorage.setItem(Keys.ROL_ID, JSON.stringify(rol_id));

      this.authEstadoSubject.next({
        autenticado: true,
        token: response.data.token,
        token_expiracion: token_expiracion,
        usuario_id: usuario_id,
        usuario_nombre: usuario_nombre,
        persona_id: persona_id,
        persona_nombres: persona_nombres,
        persona_apellidos: persona_apellidos,
        rol_id: rol_id,
      });

      this.startRefreshToken();
    } catch (error) {
      console.error('Error al procesar el token JWT:', error);
      this.logout();
    }
  }

  logout(): void {
    this.stopRefreshToken();

    localStorage.removeItem(Keys.TOKEN);
    localStorage.removeItem(Keys.TOKEN_EXPIRACION);
    localStorage.removeItem(Keys.USUARIO_ID);
    localStorage.removeItem(Keys.USUARIO_NOMBRE);
    localStorage.removeItem(Keys.PERSONA_ID);
    localStorage.removeItem(Keys.PERSONA_NOMBRES);
    localStorage.removeItem(Keys.PERSONA_APELLIDOS);
    localStorage.removeItem(Keys.ROL_ID);

    this.authEstadoSubject.next({
      autenticado: false,
      token: null,
      token_expiracion: null,
      usuario_id: null,
      usuario_nombre: null,
      persona_id: null,
      persona_nombres: null,
      persona_apellidos: null,
      rol_id: null,
    });

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const estadoActual = this.authEstadoSubject.value;

    if (!estadoActual.autenticado || !estadoActual.token_expiracion) {
      return false;
    }

    return new Date() < estadoActual.token_expiracion;
  }

  getToken(): string | null {
    return this.authEstadoSubject.value.token;
  }

  getAuthEstado(): AuthEstado {
    return this.authEstadoSubject.value;
  }

  hasRole(roleId: number): boolean {
    const estado = this.authEstadoSubject.value;
    return estado.rol_id?.includes(roleId) ?? false;
  }

  hasAnyRole(roleIds: number[]): boolean {
    const estado = this.authEstadoSubject.value;
    return roleIds.some((roleId) => estado.rol_id?.includes(roleId) ?? false);
  }

  hasAllRoles(roleIds: number[]): boolean {
    const estado = this.authEstadoSubject.value;
    return roleIds.every((roleId) => estado.rol_id?.includes(roleId) ?? false);
  }

  getRoles(): number[] {
    return this.authEstadoSubject.value.rol_id ?? [];
  }

  getPersonaId(): number | null {
    return this.authEstadoSubject.value.persona_id;
  }

  private loadAuthEstado(): void {
    const token = localStorage.getItem(Keys.TOKEN);
    const token_expiracion = localStorage.getItem(Keys.TOKEN_EXPIRACION);
    const usuario_id = localStorage.getItem(Keys.USUARIO_ID);
    const usuario_nombre = localStorage.getItem(Keys.USUARIO_NOMBRE);
    const persona_id = localStorage.getItem(Keys.PERSONA_ID);
    const persona_nombres = localStorage.getItem(Keys.PERSONA_NOMBRES);
    const persona_apellidos = localStorage.getItem(Keys.PERSONA_APELLIDOS);
    const rol_id_json = localStorage.getItem(Keys.ROL_ID);

    if (token && token_expiracion) {
      const expiracionDate = new Date(token_expiracion);

      if (expiracionDate > new Date()) {
        this.authEstadoSubject.next({
          autenticado: true,
          token: token,
          token_expiracion: new Date(token_expiracion ?? ''),
          usuario_id: parseInt(usuario_id ?? '0'),
          usuario_nombre: usuario_nombre,
          persona_id: parseInt(persona_id ?? '0'),
          persona_nombres: persona_nombres,
          persona_apellidos: persona_apellidos,
          rol_id: rol_id_json ? JSON.parse(rol_id_json) : null,
        });
      } else {
        this.logout();
      }
    }
  }

  iniciarRefrescoTokenSiEstaAutenticado(): void {
    if (this.isLoggedIn()) {
      this.startRefreshToken();
    }
  }

  refreshToken(): Observable<LoginResponse> {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return EMPTY;
    }
    return this.http
      .get<LoginResponse>(`${this.API_URL}/auth/refreshtoken`)
      .pipe(
        tap((response) => {
          if (response.code === 0) {
            this.loginExitoso(response);
          } else {
            throw new Error(response.error ?? ERROR_MESSAGES.AUTH_FAILED);
          }
        }),
        this.errorHandler.handleHttpError<LoginResponse>(),
      );
  }

  private startRefreshToken(): void {
    this.stopRefreshToken();

    this.refreshTokenSubscription = interval(1000 * 60)
      .pipe(switchMap(() => (this.isLoggedIn() ? this.refreshToken() : EMPTY)))
      .subscribe({
        error: (err) => {
          console.error(
            'Error al refrescar el token. Se reintentará en el próximo intervalo.',
            err,
          );
        },
      });
  }

  private stopRefreshToken(): void {
    if (this.refreshTokenSubscription) {
      this.refreshTokenSubscription.unsubscribe();
    }
  }
}
