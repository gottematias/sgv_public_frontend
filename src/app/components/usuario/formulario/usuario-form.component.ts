import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { PersonaService } from '../../../services/persona.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Persona } from '../../../models/persona.interfaces';
import {
  CreateRequest,
  Rol,
  UpdateRequest,
} from '../../../models/usuario.interfaces';
import { Rol as RolEnum } from '../../../constants/rol.enum';
import { CreateEmpleadoResponse } from '../../../models/empleado.interfaces';
import { PasswordModule } from 'primeng/password';
import { MultiSelectModule } from 'primeng/multiselect';
import { catchError, switchMap, of, map } from 'rxjs';
import type { Observable } from 'rxjs';

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-usuario-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    CheckboxModule,
    PasswordModule,
    MultiSelectModule,
  ],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css'],
})
export class UsuarioFormComponent implements OnInit {
  usuarioId: number | null;
  formGroupUsuario: FormGroup;
  personas: Persona[];
  roles: Rol[];
  modoEdicion: boolean;
  formEnviado = false;
  puedeToggleActivo = false;

  constructor(
    private readonly refDialog: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly usuarioService: UsuarioService,
    private readonly personaService: PersonaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly empleadoService: EmpleadoService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {
    this.usuarioId = null;
    this.personas = [];
    this.roles = [];
    this.modoEdicion = false;

    this.formGroupUsuario = new FormGroup({
      username: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(100),
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      persona: new FormControl<Persona | null>(null, [Validators.required]),
      activo: new FormControl<boolean>(true),
      roles: new FormControl<number[]>([]),
    });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.usuarioId = this.config.data.usuarioId;
      this.modoEdicion = this.usuarioId !== null;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.modoEdicion) {
      this.formGroupUsuario.get('activo')?.disable();
    }

    this.usuarioService.listRoles().subscribe({
      next: (resRoles) => {
        this.roles = resRoles.data;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.toastNotificationService.showError('Error al cargar roles');
      },
    });

    this.personaService.list(undefined, undefined, undefined, true).subscribe({
      next: (resPersona) => {
        this.personas = resPersona.data;

        if (this.usuarioId) {
          this.formGroupUsuario.get('username')?.disable();
          this.formGroupUsuario.get('persona')?.disable();
          this.formGroupUsuario.get('password')?.clearValidators();
          this.formGroupUsuario.get('password')?.updateValueAndValidity();

          this.usuarioService.get(this.usuarioId).subscribe({
            next: (resUsuario) => {
              const personaEncontrada = this.personas.find(
                (p) => p.id === resUsuario.data.persona?.id,
              );

              const rolesIds =
                resUsuario.data.usuariosRoles?.map((ur) => ur.idRol) ?? [];

              this.formGroupUsuario.patchValue({
                username: resUsuario.data.nombre,
                password: '',
                persona: personaEncontrada || null,
                activo: resUsuario.data.activo,
                roles: rolesIds,
              });
            },
            error: (error) => {
              console.error(error);
              this.toastNotificationService.showError(
                'Error al cargar el usuario',
              );
            },
          });
        } else {
          if (this.personas.length > 0) {
            this.formGroupUsuario.patchValue({
              persona: null,
            });
          }
        }
      },
      error: (error) => {
        console.error('Error al cargar personas:', error);
        this.toastNotificationService.showError('Error al cargar personas');
      },
    });
  }

  cerrar(): void {
    this.refDialog.close();
  }

  private shouldCreateEmpleado(roles: number[]): boolean {
    return (
      roles.includes(RolEnum.VETERINARIO) ||
      roles.includes(RolEnum.RECEPCIONISTA)
    );
  }

  private createEmpleadoForUsuario(
    usuarioId: number,
  ): Observable<CreateEmpleadoResponse> {
    const today = new Date();
    const fechaIngreso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return this.empleadoService
      .createEmpleado({
        idUsuario: usuarioId,
        fechaIngreso: fechaIngreso,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al crear empleado:', error);
          return of({
            code: -1,
            error: error.message || 'Error desconocido al crear empleado',
            data: null,
          } as CreateEmpleadoResponse);
        }),
      );
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.modoEdicion && !this.authorizationService.canEditUsuario()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar usuarios',
      );
      this.cerrar();
      return;
    }

    if (!this.modoEdicion && !this.authorizationService.canCreateUsuario()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear usuarios',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupUsuario.invalid) {
      this.formGroupUsuario.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    if (this.modoEdicion && this.usuarioId && this.usuarioId > 0) {
      const updateUsuarioRequest: UpdateRequest = {
        activo: this.formGroupUsuario.value.activo,
        roles: this.formGroupUsuario.value.roles,
      };

      const password = this.formGroupUsuario.value.password?.trim();
      if (password && password.length >= 4) {
        updateUsuarioRequest.password = password;
      }

      this.usuarioService
        .update(this.usuarioId, updateUsuarioRequest)
        .subscribe({
          next: (response) => {
            this.toastNotificationService.showSuccess(
              'Usuario actualizado exitosamente.',
            );
            this.refDialog.close(response ?? false);
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            this.toastNotificationService.showError(
              error.message ?? 'Error al actualizar el usuario.',
            );
          },
        });
    } else {
      const createUsuarioRequest: CreateRequest = {
        username: this.formGroupUsuario.value.username.trim(),
        password: this.formGroupUsuario.value.password.trim(),
        idPersona: this.formGroupUsuario.value.persona.id,
        roles: this.formGroupUsuario.value.roles,
      };

      const selectedRoles: number[] = this.formGroupUsuario.value.roles;
      const needsEmpleado = this.shouldCreateEmpleado(selectedRoles);

      this.usuarioService
        .create(createUsuarioRequest)
        .pipe(
          switchMap((usuarioResponse) => {
            if (!needsEmpleado) {
              return of({ usuarioResponse, empleadoResponse: null });
            }

            const usuarioId = usuarioResponse.data;
            if (!usuarioId || usuarioId <= 0) {
              console.error('Usuario creado pero ID inválido:', usuarioId);
              return of({ usuarioResponse, empleadoResponse: null });
            }

            return this.createEmpleadoForUsuario(usuarioId).pipe(
              map((empleadoResponse) => ({
                usuarioResponse,
                empleadoResponse,
              })),
            );
          }),
        )
        .subscribe({
          next: ({ usuarioResponse, empleadoResponse }) => {
            if (!empleadoResponse) {
              this.toastNotificationService.showSuccess(
                'Usuario creado exitosamente.',
              );
            } else if (empleadoResponse.code === 0) {
              this.toastNotificationService.showSuccess(
                'Usuario y empleado creados exitosamente.',
              );
            } else {
              const errorMsg = empleadoResponse.error || 'Error desconocido';
              this.toastNotificationService.showWarning(
                `Usuario creado, pero hubo un error al crear el empleado: ${errorMsg}`,
              );
            }

            this.refDialog.close(usuarioResponse ?? false);
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.toastNotificationService.showError(
              error.message ?? 'Error al crear el usuario.',
            );
          },
        });
    }
  }
}
