import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

import { PagoService } from '../../../services/pago.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { PagoEstado } from '../../../models/venta.interfaces';

@Component({
  selector: 'app-editar-estado-pago',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
  ],
  templateUrl: './editar-estado-pago.component.html',
})
export class EditarEstadoPagoComponent implements OnInit {
  formGroupEstado: FormGroup;
  estadosPago: PagoEstado[] = [];

  pagoId: number;
  estadoActualId: number;
  estadoActualNombre: string;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly pagoService: PagoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {
    // Initialize from dialog config
    this.pagoId = this.config.data?.pagoId;
    this.estadoActualId = this.config.data?.estadoActualId;
    this.estadoActualNombre = this.config.data?.estadoActualNombre ?? '';

    this.formGroupEstado = new FormGroup({
      estadoPago: new FormControl<PagoEstado | null>(null, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.pagoService.listEstados().subscribe({
      next: (response) => {
        this.estadosPago = response.data;

        // Pre-select current estado
        const estadoActual = this.estadosPago.find(
          (e) => e.id === this.estadoActualId,
        );
        if (estadoActual) {
          this.formGroupEstado.patchValue({ estadoPago: estadoActual });
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  guardar(): void {
    // Check authorization before submitting
    if (!this.authorizationService.canEditEstadoPago()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar estados de pago',
      );
      this.ref.close();
      return;
    }

    if (this.formGroupEstado.invalid) {
      this.formGroupEstado.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, seleccione un estado.',
      );
      return;
    }

    const formValue = this.formGroupEstado.value;
    const nuevoEstadoId = formValue.estadoPago.id;

    if (nuevoEstadoId === this.estadoActualId) {
      this.toastNotificationService.showInfo(
        'El estado no ha cambiado. No se realizó ninguna actualización.',
      );
      this.cerrar();
      return;
    }

    this.pagoService.updateEstado(this.pagoId, nuevoEstadoId).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess(
          'Estado del pago actualizado exitosamente.',
        );
        this.ref.close(true);
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  cerrar(): void {
    this.ref.close(false);
  }
}
