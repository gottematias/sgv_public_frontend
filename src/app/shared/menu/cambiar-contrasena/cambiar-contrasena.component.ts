import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { UsuarioService } from '../../../services/usuario.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { ERROR_MESSAGES } from '../../../constants/error-messages.constant';

function contrasenasCoincidenValidator(
  group: AbstractControl,
): ValidationErrors | null {
  const nueva = group.get('contrasenaNueva')?.value as string;
  const confirmacion = group.get('confirmacionContrasena')?.value as string;
  if (nueva && confirmacion && nueva !== confirmacion) {
    return { contrasenasNoCoinciden: true };
  }
  return null;
}

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    TooltipModule,
  ],
  templateUrl: './cambiar-contrasena.component.html',
})
export class CambiarContrasenaComponent {
  formGroupContrasena: FormGroup = new FormGroup(
    {
      contrasenaActual: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      contrasenaNueva: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      confirmacionContrasena: new FormControl<string>('', [
        Validators.required,
      ]),
    },
    { validators: contrasenasCoincidenValidator },
  );

  formEnviado = false;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly usuarioService: UsuarioService,
    private readonly toastNotificationService: ToastNotificationService,
  ) {}

  guardar(): void {
    this.formEnviado = true;

    if (this.formGroupContrasena.invalid) {
      this.formGroupContrasena.markAllAsTouched();
      this.toastNotificationService.showError(
        ERROR_MESSAGES.TOAST_ERROR,
        'Por favor, complete todos los campos correctamente.',
      );
      return;
    }

    const { contrasenaActual, contrasenaNueva } = this.formGroupContrasena
      .value as {
      contrasenaActual: string;
      contrasenaNueva: string;
      confirmacionContrasena: string;
    };

    this.usuarioService
      .changePassword({
        currentPassword: contrasenaActual,
        newPassword: contrasenaNueva,
      })
      .subscribe({
        next: () => {
          this.toastNotificationService.showSuccess(
            ERROR_MESSAGES.TOAST_SUCCESS,
            'Contraseña actualizada exitosamente.',
          );
          this.ref.close(true);
        },
        error: (error: Error) => {
          this.toastNotificationService.showError(
            ERROR_MESSAGES.TOAST_ERROR,
            error.message,
          );
        },
      });
  }

  cerrar(): void {
    this.ref.close(false);
  }
}
