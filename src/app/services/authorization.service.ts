import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Rol } from '../constants/rol.enum';

/**
 * Service for handling role-based authorization checks.
 * Centralizes permission logic for UI element visibility based on user roles.
 *
 * @description
 * This service works in conjunction with AuthService to determine if the current
 * authenticated user has the necessary roles to perform specific actions.
 * Permission rules are defined based on the backend OpenAPI specification.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  // Persona module permissions
  private static readonly PERSONA_CREATE_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly PERSONA_EDIT_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly PERSONA_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Usuario module permissions
  private static readonly USUARIO_CREATE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly USUARIO_EDIT_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly USUARIO_DELETE_ROLES = [
    Rol.ADMINISTRADOR_SISTEMA, // Only system admin can delete users
  ];

  // Empleado module permissions
  private static readonly EMPLEADO_CREATE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly EMPLEADO_EDIT_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly EMPLEADO_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Mascota module permissions
  private static readonly MASCOTA_CREATE_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly MASCOTA_EDIT_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly MASCOTA_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Turno module permissions
  private static readonly TURNO_CREATE_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly TURNO_EDIT_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly TURNO_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Vacuna module permissions
  private static readonly VACUNA_CREATE_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA, // Only VETERINARIO and ADMIN_SISTEMA
  ];
  private static readonly VACUNA_EDIT_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly VACUNA_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Clinica (Historia Clínica) module permissions
  private static readonly CLINICA_CREATE_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA, // Only VETERINARIO and ADMIN_SISTEMA
  ];
  private static readonly CLINICA_EDIT_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly CLINICA_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly CLINICA_CHANGE_VET_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Producto module permissions
  private static readonly PRODUCTO_CREATE_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly PRODUCTO_EDIT_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly PRODUCTO_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Servicio module permissions
  private static readonly SERVICIO_CREATE_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly SERVICIO_EDIT_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly SERVICIO_DELETE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Movimiento module permissions (create-only)
  private static readonly MOVIMIENTO_CREATE_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  // Venta module permissions
  private static readonly VENTA_CREATE_ROLES = [
    Rol.CAJERO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly VENTA_EDIT_ROLES = [
    Rol.CAJERO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly VENTA_ANULAR_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ]; // Special: higher permissions required

  // Pago module permissions
  private static readonly PAGO_CREATE_ROLES = [
    Rol.CAJERO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  private static readonly PAGO_EDIT_ESTADO_ROLES = [
    Rol.CAJERO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  constructor(private readonly authService: AuthService) {}

  /**
   * Generic method to check if the current user has any of the required roles.
   *
   * @param requiredRoles - Array of role IDs required to perform the action
   * @returns true if user is authenticated and has at least one of the required roles
   */
  private canPerformAction(requiredRoles: number[]): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }

    return this.authService.hasAnyRole(requiredRoles);
  }

  // Persona permissions

  /**
   * Check if current user can create a new persona.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canCreatePersona(): boolean {
    return this.canPerformAction(AuthorizationService.PERSONA_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing persona.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canEditPersona(): boolean {
    return this.canPerformAction(AuthorizationService.PERSONA_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a persona.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeletePersona(): boolean {
    return this.canPerformAction(AuthorizationService.PERSONA_DELETE_ROLES);
  }

  // Usuario permissions

  /**
   * Check if current user can create a new usuario.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canCreateUsuario(): boolean {
    return this.canPerformAction(AuthorizationService.USUARIO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing usuario.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canEditUsuario(): boolean {
    return this.canPerformAction(AuthorizationService.USUARIO_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a usuario.
   * Required roles: ADMINISTRADOR_SISTEMA (only system admin)
   */
  canDeleteUsuario(): boolean {
    return this.canPerformAction(AuthorizationService.USUARIO_DELETE_ROLES);
  }

  // Empleado permissions

  /**
   * Check if current user can create a new empleado.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canCreateEmpleado(): boolean {
    return this.canPerformAction(AuthorizationService.EMPLEADO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing empleado.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canEditEmpleado(): boolean {
    return this.canPerformAction(AuthorizationService.EMPLEADO_EDIT_ROLES);
  }

  /**
   * Check if current user can delete an empleado.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteEmpleado(): boolean {
    return this.canPerformAction(AuthorizationService.EMPLEADO_DELETE_ROLES);
  }

  // Mascota permissions

  /**
   * Check if current user can create a new mascota.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canCreateMascota(): boolean {
    return this.canPerformAction(AuthorizationService.MASCOTA_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing mascota.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canEditMascota(): boolean {
    return this.canPerformAction(AuthorizationService.MASCOTA_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a mascota.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteMascota(): boolean {
    return this.canPerformAction(AuthorizationService.MASCOTA_DELETE_ROLES);
  }

  // Turno permissions

  /**
   * Check if current user can create a new turno.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canCreateTurno(): boolean {
    return this.canPerformAction(AuthorizationService.TURNO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing turno.
   * Required roles: VETERINARIO, RECEPCIONISTA, ADMINISTRADOR_SISTEMA
   */
  canEditTurno(): boolean {
    return this.canPerformAction(AuthorizationService.TURNO_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a turno.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteTurno(): boolean {
    return this.canPerformAction(AuthorizationService.TURNO_DELETE_ROLES);
  }

  // Vacuna permissions

  /**
   * Check if current user can create a new vacuna.
   * Required roles: VETERINARIO, ADMINISTRADOR_SISTEMA
   * Note: RECEPCIONISTA cannot create vacunas
   */
  canCreateVacuna(): boolean {
    return this.canPerformAction(AuthorizationService.VACUNA_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing vacuna.
   * Required roles: VETERINARIO, ADMINISTRADOR_SISTEMA
   */
  canEditVacuna(): boolean {
    return this.canPerformAction(AuthorizationService.VACUNA_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a vacuna.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteVacuna(): boolean {
    return this.canPerformAction(AuthorizationService.VACUNA_DELETE_ROLES);
  }

  // Clinica (Historia Clínica) permissions

  /**
   * Check if current user can create a new historia clínica.
   * Required roles: VETERINARIO, ADMINISTRADOR_SISTEMA
   * Note: RECEPCIONISTA cannot create historias clínicas
   */
  canCreateClinica(): boolean {
    return this.canPerformAction(AuthorizationService.CLINICA_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing historia clínica.
   * Required roles: VETERINARIO, ADMINISTRADOR_SISTEMA
   */
  canEditClinica(): boolean {
    return this.canPerformAction(AuthorizationService.CLINICA_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a historia clínica.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteClinica(): boolean {
    return this.canPerformAction(AuthorizationService.CLINICA_DELETE_ROLES);
  }

  /**
   * Check if current user can change the assigned veterinarian on an existing historia clínica.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canChangeVeterinarioClinica(): boolean {
    return this.canPerformAction(AuthorizationService.CLINICA_CHANGE_VET_ROLES);
  }

  // Producto permissions

  /**
   * Check if current user can create a new producto.
   * Required roles: GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA
   */
  canCreateProducto(): boolean {
    return this.canPerformAction(AuthorizationService.PRODUCTO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing producto.
   * Required roles: GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA
   */
  canEditProducto(): boolean {
    return this.canPerformAction(AuthorizationService.PRODUCTO_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a producto.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteProducto(): boolean {
    return this.canPerformAction(AuthorizationService.PRODUCTO_DELETE_ROLES);
  }

  // Servicio permissions

  /**
   * Check if current user can create a new servicio.
   * Required roles: GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA
   */
  canCreateServicio(): boolean {
    return this.canPerformAction(AuthorizationService.SERVICIO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing servicio.
   * Required roles: GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA
   */
  canEditServicio(): boolean {
    return this.canPerformAction(AuthorizationService.SERVICIO_EDIT_ROLES);
  }

  /**
   * Check if current user can delete a servicio.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   */
  canDeleteServicio(): boolean {
    return this.canPerformAction(AuthorizationService.SERVICIO_DELETE_ROLES);
  }

  // Movimiento permissions

  /**
   * Check if current user can create a new movimiento de stock.
   * Required roles: GESTOR_INVENTARIO, ADMINISTRADOR_SISTEMA
   * Note: Movimientos are create-only (immutable transaction log)
   */
  canCreateMovimiento(): boolean {
    return this.canPerformAction(AuthorizationService.MOVIMIENTO_CREATE_ROLES);
  }

  // Venta permissions

  /**
   * Check if current user can create a new venta.
   * Required roles: CAJERO, ADMINISTRADOR_SISTEMA
   */
  canCreateVenta(): boolean {
    return this.canPerformAction(AuthorizationService.VENTA_CREATE_ROLES);
  }

  /**
   * Check if current user can edit an existing venta.
   * Required roles: CAJERO, ADMINISTRADOR_SISTEMA
   */
  canEditVenta(): boolean {
    return this.canPerformAction(AuthorizationService.VENTA_EDIT_ROLES);
  }

  /**
   * Check if current user can anular (cancel) a venta.
   * Required roles: ADMINISTRADOR, ADMINISTRADOR_SISTEMA
   * Note: Requires higher permissions than create/edit
   */
  canAnularVenta(): boolean {
    return this.canPerformAction(AuthorizationService.VENTA_ANULAR_ROLES);
  }

  // Pago permissions

  /**
   * Check if current user can create a new pago.
   * Required roles: CAJERO, ADMINISTRADOR_SISTEMA
   */
  canCreatePago(): boolean {
    return this.canPerformAction(AuthorizationService.PAGO_CREATE_ROLES);
  }

  /**
   * Check if current user can edit the estado of a pago.
   * Required roles: CAJERO, ADMINISTRADOR_SISTEMA
   */
  canEditEstadoPago(): boolean {
    return this.canPerformAction(AuthorizationService.PAGO_EDIT_ESTADO_ROLES);
  }

  // Module access (visibility) permissions

  static readonly DASHBOARD_RECEPCION_ACCESS_ROLES = [
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly DASHBOARD_VETERINARIO_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly PERSONA_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly USUARIO_ACCESS_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly EMPLEADO_ACCESS_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly MASCOTA_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly CLINICA_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly VACUNA_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly TURNO_ACCESS_ROLES = [
    Rol.VETERINARIO,
    Rol.RECEPCIONISTA,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly PRODUCTO_ACCESS_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly SERVICIO_ACCESS_ROLES = [
    Rol.GESTOR_INVENTARIO,
    Rol.ADMINISTRADOR_SISTEMA,
  ];
  static readonly VENTA_ACCESS_ROLES = [
    Rol.CAJERO,
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  canAccessDashboardRecepcion(): boolean {
    return this.canPerformAction(
      AuthorizationService.DASHBOARD_RECEPCION_ACCESS_ROLES,
    );
  }

  canAccessDashboardVeterinario(): boolean {
    return this.canPerformAction(
      AuthorizationService.DASHBOARD_VETERINARIO_ACCESS_ROLES,
    );
  }

  canAccessPersona(): boolean {
    return this.canPerformAction(AuthorizationService.PERSONA_ACCESS_ROLES);
  }

  canAccessUsuario(): boolean {
    return this.canPerformAction(AuthorizationService.USUARIO_ACCESS_ROLES);
  }

  canAccessEmpleado(): boolean {
    return this.canPerformAction(AuthorizationService.EMPLEADO_ACCESS_ROLES);
  }

  canAccessMascota(): boolean {
    return this.canPerformAction(AuthorizationService.MASCOTA_ACCESS_ROLES);
  }

  canAccessClinica(): boolean {
    return this.canPerformAction(AuthorizationService.CLINICA_ACCESS_ROLES);
  }

  canAccessVacuna(): boolean {
    return this.canPerformAction(AuthorizationService.VACUNA_ACCESS_ROLES);
  }

  canAccessTurno(): boolean {
    return this.canPerformAction(AuthorizationService.TURNO_ACCESS_ROLES);
  }

  canAccessProducto(): boolean {
    return this.canPerformAction(AuthorizationService.PRODUCTO_ACCESS_ROLES);
  }

  canAccessServicio(): boolean {
    return this.canPerformAction(AuthorizationService.SERVICIO_ACCESS_ROLES);
  }

  canAccessVenta(): boolean {
    return this.canPerformAction(AuthorizationService.VENTA_ACCESS_ROLES);
  }

  static readonly REPORTE_ACCESS_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  canAccessReporte(): boolean {
    return this.canPerformAction(AuthorizationService.REPORTE_ACCESS_ROLES);
  }

  private static readonly ACTIVO_TOGGLE_ROLES = [
    Rol.ADMINISTRADOR,
    Rol.ADMINISTRADOR_SISTEMA,
  ];

  canToggleActivo(): boolean {
    return this.canPerformAction(AuthorizationService.ACTIVO_TOGGLE_ROLES);
  }

  static readonly BACKUP_ACCESS_ROLES = [Rol.ADMINISTRADOR_SISTEMA];

  canAccessBackup(): boolean {
    return this.canPerformAction(AuthorizationService.BACKUP_ACCESS_ROLES);
  }
}
