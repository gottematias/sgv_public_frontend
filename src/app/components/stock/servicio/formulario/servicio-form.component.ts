import { Component, OnInit, Optional } from '@angular/core';
import { ServicioService } from '../../../../services/servicio.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import { AuthorizationService } from '../../../../services/authorization.service';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TextareaModule } from 'primeng/textarea';
import {
  CreateServicioRequest,
  UpdateServicioRequest,
} from '../../../../models/stock.interfaces';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-servicio-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
    TextareaModule,
  ],
  providers: [],
  templateUrl: './servicio-form.component.html',
  styleUrls: ['./servicio-form.component.css'],
})
export class ServicioFormComponent implements OnInit {
  servicioId: number | null = null;

  formGroupServicio: FormGroup;
  formEnviado: boolean;
  puedeToggleActivo = false;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly servicioService: ServicioService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.formEnviado = false;

    this.formGroupServicio = new FormGroup({
      nombre: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      descripcion: new FormControl<string | null>(null, [
        Validators.maxLength(500),
      ]),
      codigoInterno: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      precio: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      duracionMinutos: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      activo: new FormControl<boolean>(true),
    });
  }

  ngOnInit(): void {
    if (this.servicioId === null && this.config?.data?.servicioId) {
      this.servicioId = this.config.data.servicioId;
    }

    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.servicioId) {
      this.formGroupServicio.get('activo')?.disable();
    } else {
      this.formGroupServicio.get('codigoInterno')?.disable();
    }

    if (this.servicioId) {
      this.servicioService.get(this.servicioId).subscribe({
        next: (response) => {
          this.formGroupServicio.setValue({
            nombre: response.data.nombre,
            descripcion: response.data.descripcion,
            codigoInterno: response.data.codigoInterno,
            precio: response.data.precio,
            duracionMinutos: response.data.duracionMinutos,
            activo: response.data.activo,
          });
        },
        error: (error) => {
          console.error(error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }

  cerrar(): void {
    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.servicioId && !this.authorizationService.canEditServicio()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar servicios',
      );
      this.cerrar();
      return;
    }

    if (!this.servicioId && !this.authorizationService.canCreateServicio()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear servicios',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupServicio.invalid) {
      this.formGroupServicio.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const formValue = this.formGroupServicio.value;

    if (this.servicioId && this.servicioId > 0) {
      const updateServicioRequest: UpdateServicioRequest = {
        nombre: formValue.nombre.trim(),
        descripcion: formValue.descripcion?.trim() || null,
        precio: formValue.precio,
        duracionMinutos: formValue.duracionMinutos,
        activo: formValue.activo,
      };

      this.servicioService
        .update(this.servicioId, updateServicioRequest)
        .subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Servicio actualizado exitosamente.',
            );

            if (this.refDialog) {
              this.refDialog.close();
            }
          },
          error: (error) => {
            console.error('Error al actualizar servicio:', error);
            this.httpErrorHandler.showErrorToast(error);
          },
        });
    } else {
      const createServicioRequest: CreateServicioRequest = {
        nombre: formValue.nombre.trim(),
        codigoInterno: formValue.codigoInterno.trim(),
        precio: formValue.precio,
        duracionMinutos: formValue.duracionMinutos,
      };

      this.servicioService.create(createServicioRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Servicio creado exitosamente.',
          );

          if (this.refDialog) {
            this.refDialog.close(response);
          }
        },
        error: (error) => {
          console.error('Error al crear servicio:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }
}
