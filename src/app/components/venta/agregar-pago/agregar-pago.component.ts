import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';

import { PagoService } from '../../../services/pago.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import {
  MetodoPago,
  PagoEstado,
  CreatePagoRequest,
} from '../../../models/venta.interfaces';
import { PagoEstadoEnum } from '../../../constants/pago-estado.enum';

@Component({
  selector: 'app-agregar-pago',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    TooltipModule,
  ],
  templateUrl: './agregar-pago.component.html',
})
export class AgregarPagoComponent implements OnInit {
  formGroupPago: FormGroup;
  metodosPago: MetodoPago[] = [];
  estadosPago: PagoEstado[] = [];

  ventaId: number;
  totalVenta: number;
  totalPagado: number;
  saldoPendiente: number;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly pagoService: PagoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {
    // Initialize from dialog config
    this.ventaId = this.config.data?.ventaId;
    this.totalVenta = this.config.data?.totalVenta ?? 0;
    this.totalPagado = this.config.data?.totalPagado ?? 0;
    this.saldoPendiente = this.config.data?.saldoPendiente ?? 0;

    this.formGroupPago = new FormGroup({
      metodoPago: new FormControl<MetodoPago | null>(null, [
        Validators.required,
      ]),
      estadoPago: new FormControl<PagoEstado | null>(null, [
        Validators.required,
      ]),
      monto: new FormControl<number | null>(0, [
        Validators.required,
        Validators.min(0.01),
      ]),
      montoBonificado: new FormControl<number | null>(0, [Validators.min(0)]),
      referencia: new FormControl<string>('', [Validators.maxLength(255)]),
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    forkJoin({
      metodosPago: this.pagoService.listMetodosPago(),
      estadosPago: this.pagoService.listEstados(),
    }).subscribe({
      next: (response) => {
        this.metodosPago = response.metodosPago.data;
        this.estadosPago = response.estadosPago.data;

        // Pre-select first method and "Aprobado" state
        if (this.metodosPago.length > 0) {
          this.formGroupPago.patchValue({ metodoPago: this.metodosPago[0] });
        }
        const estadoAprobado = this.estadosPago.find(
          (e) => e.id === PagoEstadoEnum.APROBADO,
        );
        if (estadoAprobado) {
          this.formGroupPago.patchValue({ estadoPago: estadoAprobado });
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  getMaxMonto(): number {
    const bonificado = Number(this.formGroupPago.value.montoBonificado ?? 0);
    return Math.max(
      0,
      this.saldoPendiente - (isNaN(bonificado) ? 0 : bonificado),
    );
  }

  getMaxMontoBonificado(): number {
    const monto = Number(this.formGroupPago.value.monto ?? 0);
    return Math.max(0, this.saldoPendiente - (isNaN(monto) ? 0 : monto));
  }

  onMetodoPagoChange(metodoPago: MetodoPago | null): void {
    if (metodoPago && !metodoPago.requiereReferencia) {
      this.formGroupPago.patchValue({ referencia: '' });
    }
  }

  guardar(): void {
    // Check authorization before submitting
    if (!this.authorizationService.canCreatePago()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para registrar pagos',
      );
      this.ref.close();
      return;
    }

    if (this.formGroupPago.invalid) {
      this.formGroupPago.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos.',
      );
      return;
    }

    const formValue = this.formGroupPago.value;
    const metodoPago = formValue.metodoPago;
    const referencia = formValue.referencia?.trim() || null;

    // Validate reference requirement
    if (metodoPago.requiereReferencia && !referencia) {
      this.toastNotificationService.showError(
        'Este método de pago requiere una referencia.',
      );
      return;
    }

    const createPagoRequest: CreatePagoRequest = {
      monto: Number(formValue.monto),
      montoBonificado: Number(formValue.montoBonificado ?? 0),
      referencia,
      idMetodoPago: metodoPago.id,
      idVenta: this.ventaId,
      idEstado: formValue.estadoPago.id,
    };

    this.pagoService.create(createPagoRequest).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess(
          'Pago registrado exitosamente.',
        );
        this.ref.close(true); // Return true to indicate success
      },
      error: (error) => {
        this.toastNotificationService.showError(
          `Error al crear pago: ${error.message}`,
        );
      },
    });
  }

  cerrar(): void {
    this.ref.close(false);
  }
}
