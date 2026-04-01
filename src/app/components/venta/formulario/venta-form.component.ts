import { Component, DestroyRef, inject, OnInit, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VentaService } from '../../../services/venta.service';
import { PagoService } from '../../../services/pago.service';
import { PersonaService } from '../../../services/persona.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { StepperModule } from 'primeng/stepper';
import { forkJoin } from 'rxjs';
import {
  CreateVentaRequest,
  CreatePagoInVentaDto,
  DetalleVentaRequest,
  MetodoPago,
  PagoEstado,
} from '../../../models/venta.interfaces';
import type { Persona } from '../../../models/persona.interfaces';
import {
  VentaItemsComponent,
  type ItemVenta,
} from './venta-items/venta-items.component';
import {
  VentaPagosComponent,
  type PagoVenta,
} from './venta-pagos/venta-pagos.component';

interface UnifiedItem {
  tipo: 'producto' | 'servicio';
  id: number;
  nombre: string;
  codigoInterno: string;
  precio: number;
  stockActual?: number;
  descripcion?: string;
}

@Component({
  selector: 'app-venta-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    StepperModule,
    VentaItemsComponent,
    VentaPagosComponent,
  ],
  providers: [],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
})
export class VentaFormComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  formGroupVenta: FormGroup;

  personas: Persona[] = [];
  metodosPago: MetodoPago[] = [];
  estadosPago: PagoEstado[] = [];

  items: ItemVenta[] = [];
  pagos: PagoVenta[] = [];

  currentStepIndex = 0;
  ventaIdGuardada: number | null = null;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly ventaService: VentaService = null!,
    private readonly pagoService: PagoService = null!,
    private readonly personaService: PersonaService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.formGroupVenta = new FormGroup({
      cliente: new FormControl<Persona | null>(null, []),
      montoAjusteRedondeo: new FormControl<number | null>(0, []),
    });
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    forkJoin({
      personas: this.personaService.list(
        undefined,
        PAGINATION_LIMITS.PAGE,
        0,
        true,
      ),
      metodosPago: this.pagoService.listMetodosPago(),
      estadosPago: this.pagoService.listEstados(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.personas = response.personas.data;
          this.metodosPago = response.metodosPago.data;
          this.estadosPago = response.estadosPago.data;
        },
        error: (error) => {
          console.error('Error al cargar catálogos:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onItemSeleccionado(item: UnifiedItem): void {
    // Validación de stock para productos
    if (
      item.tipo === 'producto' &&
      (!item.stockActual || item.stockActual === 0)
    ) {
      this.toastNotificationService.showWarning(
        `El producto "${item.nombre}" no tiene stock disponible.`,
      );
      return;
    }

    const existingIndex = this.items.findIndex(
      (i) => i.tipo === item.tipo && i.id === item.id,
    );

    if (existingIndex >= 0) {
      this.items[existingIndex].cantidad++;
      this.actualizarCantidad(
        existingIndex,
        this.items[existingIndex].cantidad,
      );
      this.toastNotificationService.showInfo(
        `Cantidad incrementada: ${item.nombre}`,
      );
    } else {
      const precio = Number(item.precio);
      this.items.push({
        tipo: item.tipo,
        id: item.id,
        nombre: item.nombre,
        codigoInterno: item.codigoInterno,
        cantidad: 1,
        precioUnitario: precio,
        subtotal: precio,
        stockDisponible: item.stockActual,
      });
      this.toastNotificationService.showSuccess('Item agregado.');
    }
  }

  onItemRemoved(index: number): void {
    this.items.splice(index, 1);
    this.toastNotificationService.showSuccess('Item eliminado.');
  }

  onCantidadActualizada(event: { index: number; cantidad: number }): void {
    this.actualizarCantidad(event.index, event.cantidad);
  }

  getMaxCantidad(item: ItemVenta): number {
    if (item.tipo === 'producto' && item.stockDisponible !== undefined) {
      return Math.min(item.stockDisponible, 999);
    }
    return 999;
  }

  actualizarCantidad(index: number, nuevaCantidad: number): void {
    if (index < 0 || index >= this.items.length) return;

    const item = this.items[index];
    const maxPermitido = this.getMaxCantidad(item);
    const cantidadAnterior = item.cantidad;
    item.cantidad = Math.max(1, Math.min(maxPermitido, nuevaCantidad || 1));

    if (item.cantidad !== cantidadAnterior && item.cantidad === maxPermitido) {
      if (
        item.tipo === 'producto' &&
        item.stockDisponible !== undefined &&
        item.stockDisponible < 999
      ) {
        this.toastNotificationService.showWarning(
          `Cantidad ajustada al stock disponible: ${item.stockDisponible}`,
        );
      } else {
        this.toastNotificationService.showInfo(
          `Cantidad ajustada al máximo permitido: 999`,
        );
      }
    }

    // Ensure numeric calculation to prevent string concatenation
    item.subtotal = Number(item.cantidad) * Number(item.precioUnitario);
  }

  onPagoAdded(pagosArray: PagoVenta[]): void {
    this.pagos = pagosArray; // Replace entire array with new array from child
  }

  getSubtotalItems(): number {
    return this.items.reduce((sum, item) => {
      const subtotal = Number(item.subtotal);
      return sum + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotalItems();
    const ajuste = Number(this.formGroupVenta.value.montoAjusteRedondeo ?? 0);
    return subtotal + (isNaN(ajuste) ? 0 : ajuste);
  }

  getTotalPagado(): number {
    return this.pagos
      .filter((pago) => pago.nombreEstado.toLowerCase() === 'aprobado')
      .reduce((sum, pago) => {
        const monto = Number(pago.monto);
        const bonificado = Number(pago.montoBonificado ?? 0);
        return (
          sum +
          (isNaN(monto) ? 0 : monto) +
          (isNaN(bonificado) ? 0 : bonificado)
        );
      }, 0);
  }

  cerrar(): void {
    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  guardarPagos(): void {
    // Check authorization before submitting (create-only)
    if (!this.authorizationService.canCreateVenta()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear ventas',
      );
      this.cerrar();
      return;
    }

    // Validate venta data
    if (this.formGroupVenta.invalid) {
      this.formGroupVenta.markAllAsTouched();
      this.toastNotificationService.showError(
        'Por favor, complete todos los campos requeridos.',
      );
      return;
    }

    if (this.items.length === 0) {
      this.toastNotificationService.showError(
        'Debe agregar al menos un producto o servicio.',
      );
      return;
    }

    const formValue = this.formGroupVenta.value;

    // Build detalles
    const detalles: DetalleVentaRequest[] = this.items.map((item) => ({
      cantidad: item.cantidad,
      idProducto: item.tipo === 'producto' ? item.id : null,
      idServicio: item.tipo === 'servicio' ? item.id : null,
    }));

    // Build CreatePagoInVentaDto array from this.pagos
    const pagosDto: CreatePagoInVentaDto[] = this.pagos
      .filter((pago) => pago.monto > 0)
      .map((pago) => ({
        monto: pago.monto,
        montoBonificado: Number(pago.montoBonificado ?? 0),
        referencia: pago.referencia ?? null,
        idMetodoPago: pago.idMetodoPago,
        idEstado: pago.idEstado,
      }));

    // Build venta request with optional pagos
    const createVentaRequest: CreateVentaRequest = {
      idCliente: formValue.cliente?.id ?? null,
      montoAjusteRedondeo: formValue.montoAjusteRedondeo ?? null,
      detalles,
      pagos: pagosDto.length > 0 ? pagosDto : undefined,
    };

    // Single API call creates venta + payments atomically
    this.ventaService
      .create(createVentaRequest)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ventaResponse) => {
          const ventaId = ventaResponse.data;

          if (!ventaId) {
            this.toastNotificationService.showError(
              'Error al crear la venta: ID no recibido.',
            );
            return;
          }

          this.ventaIdGuardada = ventaId;

          // Success message based on whether payments were included
          const message =
            pagosDto.length > 0
              ? 'Venta y pagos registrados exitosamente.'
              : 'Venta registrada exitosamente (sin pagos).';

          this.toastNotificationService.showSuccess(message);

          if (this.refDialog) {
            this.refDialog.close({ ventaId: this.ventaIdGuardada });
          }
        },
        error: (error) => {
          console.error('Error al crear venta:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  puedeAvanzarAPagos(): boolean {
    return this.items.length > 0 && this.formGroupVenta.valid;
  }

  volverAItems(): void {
    this.currentStepIndex = 0;
  }

  avanzarAPagos(): void {
    if (!this.puedeAvanzarAPagos()) {
      this.toastNotificationService.showError(
        'Debe agregar al menos un producto o servicio.',
      );
      return;
    }
    this.currentStepIndex = 1;
  }
}
