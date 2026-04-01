import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { AnulacionVentaMotivo } from '../../../models/venta.interfaces';
import { VentaService } from '../../../services/venta.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';

@Component({
  selector: 'app-anular-venta',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    Textarea,
    SelectModule,
    TooltipModule,
  ],
  templateUrl: './anular-venta.component.html',
  styleUrls: ['./anular-venta.component.css'],
})
export class AnularVentaComponent implements OnInit {
  motivos: AnulacionVentaMotivo[] = [];

  formGroupAnular: FormGroup = new FormGroup({
    motivo: new FormControl<AnulacionVentaMotivo | null>(null, [
      Validators.required,
    ]),
    observaciones: new FormControl<string>('', [Validators.maxLength(500)]),
  });

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly ventaService: VentaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.cargarMotivos();
  }

  cargarMotivos(): void {
    this.ventaService.listMotivosAnulacion().subscribe({
      next: (response) => {
        this.motivos = response.data;
        // Auto-seleccionar primer motivo
        if (this.motivos.length > 0) {
          this.formGroupAnular.patchValue({ motivo: this.motivos[0] });
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  anular(): void {
    // Check authorization before cancelling
    if (!this.authorizationService.canAnularVenta()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para anular ventas',
      );
      this.ref.close();
      return;
    }

    if (this.formGroupAnular.invalid) {
      this.formGroupAnular.markAllAsTouched();
      return;
    }

    const ventaId = this.config.data?.ventaId;
    const formValue = this.formGroupAnular.value;

    if (!ventaId) {
      this.toastNotificationService.showError(
        'Error: datos de venta no disponibles.',
      );
      return;
    }

    this.ventaService
      .anular(ventaId, {
        idAnulacionVentaMotivo: formValue.motivo!.id,
        observaciones: formValue.observaciones || null,
      })
      .subscribe({
        next: () => {
          this.toastNotificationService.showSuccess(
            'Venta anulada exitosamente.',
          );
          this.ref.close(true); // Retornar true para indicar éxito
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
