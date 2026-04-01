import { Component, OnInit, Optional } from '@angular/core';
import { StockMovimientoService } from '../../../../services/stock-movimiento.service';
import { ProductoService } from '../../../../services/producto.service';
import { AuthService } from '../../../../services/auth.service';
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
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import {
  CreateMovimientoStockRequest,
  MovimientoStockTipo,
  Producto,
} from '../../../../models/stock.interfaces';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
import { PAGINATION_LIMITS } from '../../../../constants/pagination.constant';
@Component({
  selector: 'app-movimiento-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    SelectModule,
    TooltipModule,
    DatePickerModule,
  ],
  providers: [],
  templateUrl: './movimiento-form.component.html',
  styleUrls: ['./movimiento-form.component.css'],
})
export class MovimientoFormComponent implements OnInit {
  formGroupMovimiento: FormGroup;
  productos: Producto[];
  tiposMovimiento: MovimientoStockTipo[];
  formEnviado: boolean;
  preselectedProductoId: number | null = null;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly movimientoService: StockMovimientoService = null!,
    private readonly productoService: ProductoService = null!,
    private readonly authService: AuthService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.productos = [];
    this.tiposMovimiento = [];
    this.formEnviado = false;

    this.formGroupMovimiento = new FormGroup({
      producto: new FormControl<Producto | null>(null, [Validators.required]),
      cantidad: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
      ]),
      tipoMovimiento: new FormControl<MovimientoStockTipo | null>(null, [
        Validators.required,
      ]),
      observaciones: new FormControl<string>('', [Validators.maxLength(500)]),
      fecha: new FormControl<Date>(new Date(), [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Check if productoId is provided to pre-select
    if (this.config?.data?.productoId) {
      this.preselectedProductoId = this.config.data.productoId;
    }

    this.productoService
      .list(undefined, undefined, PAGINATION_LIMITS.PAGE, 0, true)
      .subscribe({
        next: (response) => {
          this.productos = response.data;

          // Pre-select product if productoId was provided
          if (this.preselectedProductoId) {
            const producto = this.productos.find(
              (p) => p.id === this.preselectedProductoId,
            );
            if (producto) {
              this.formGroupMovimiento.patchValue({ producto });
            }
          } else if (this.productos.length > 0) {
            // Fallback to first product if no preselection
            this.formGroupMovimiento.patchValue({
              producto: this.productos[0],
            });
          }
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });

    this.movimientoService.listTipos().subscribe({
      next: (response) => {
        this.tiposMovimiento = response.data;

        if (this.tiposMovimiento.length > 0) {
          this.formGroupMovimiento.patchValue({
            tipoMovimiento: this.tiposMovimiento[0],
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar tipos de movimiento:', error);
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  cerrar(): void {
    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting (create-only)
    if (!this.authorizationService.canCreateMovimiento()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear movimientos de stock',
      );
      this.cerrar();
      return;
    }

    if (this.formGroupMovimiento.invalid) {
      this.formGroupMovimiento.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos correctamente.',
      );
      return;
    }

    const formValue = this.formGroupMovimiento.value;
    const authState = this.authService.getAuthEstado();

    if (!authState.usuario_id) {
      this.toastNotificationService.showError(
        'No se pudo identificar el usuario actual.',
      );
      return;
    }

    const createMovimientoRequest: CreateMovimientoStockRequest = {
      cantidad: formValue.cantidad,
      observaciones: formValue.observaciones?.trim() || null,
      idProducto: formValue.producto.id,
      idMovimientoTipo: formValue.tipoMovimiento.id,
      idEmpleado: authState.usuario_id,
    };

    this.movimientoService.create(createMovimientoRequest).subscribe({
      next: () => {
        this.toastNotificationService.showSuccess(
          'Movimiento de stock registrado exitosamente.',
        );

        if (this.refDialog) {
          this.refDialog.close();
        }
      },
      error: (error) => {
        console.error('Error al crear movimiento:', error);
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }
}
