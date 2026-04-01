import { Component, OnInit, Optional } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { ButtonModule } from 'primeng/button';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AnularVentaComponent } from '../anular-venta/anular-venta.component';
import { AgregarPagoComponent } from '../agregar-pago/agregar-pago.component';
import { EditarEstadoPagoComponent } from '../editar-estado-pago/editar-estado-pago.component';
import type { Pago, Venta } from '../../../models/venta.interfaces';

@Component({
  selector: 'app-venta-detalle',
  imports: [CommonModule, TableModule, ButtonModule, TagModule, TooltipModule],
  providers: [DialogService],
  templateUrl: './venta-detalle.component.html',
  styleUrls: ['./venta-detalle.component.css'],
})
export class VentaDetalleComponent implements OnInit {
  venta: Venta | null = null;
  ventaId: number | null = null;
  cargando = true;

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly ventaService: VentaService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly dialogService: DialogService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
    readonly authorizationService: AuthorizationService = null!,
  ) {}

  ngOnInit(): void {
    if (this.config?.data?.ventaId) {
      this.ventaId = this.config.data.ventaId;
      this.cargarVenta();
    } else {
      this.toastNotificationService.showError('ID de venta no proporcionado.');
      this.cerrar();
    }
  }

  cargarVenta(): void {
    if (!this.ventaId) {
      return;
    }

    this.cargando = true;
    this.ventaService.get(this.ventaId).subscribe({
      next: (response) => {
        this.venta = this.sanitizeVentaData(response.data);
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar venta:', error);
        this.httpErrorHandler.showErrorToast(error);
        this.cargando = false;
        this.cerrar();
      },
    });
  }

  getTotalItems(): number {
    return this.venta?.detalles.length || 0;
  }

  getTotalPagos(): number {
    return this.venta?.pagos.length || 0;
  }

  getTotalPagado(): number {
    if (!this.venta?.pagos) {
      return 0;
    }
    return this.venta.pagos
      .filter((pago) => pago.estado?.nombre.toLowerCase() === 'aprobado')
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

  getCalculatedSubtotal(): number {
    if (!this.venta?.detalles) {
      return 0;
    }
    return this.venta.detalles.reduce((sum, detalle) => {
      const subtotal = Number(detalle.subtotal);
      return sum + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);
  }

  hasCalculationMismatch(): boolean {
    if (!this.venta) {
      return false;
    }
    const calculated = this.getCalculatedSubtotal();
    const backend = Number(this.venta.totalFinal);
    return Math.abs(calculated - backend) > 0.01; // Allow 1 cent tolerance for rounding
  }

  getDiferencia(): number {
    if (!this.venta) {
      return 0;
    }
    return Math.abs(
      this.getCalculatedSubtotal() - Number(this.venta.totalFinal),
    );
  }

  private sanitizeVentaData(venta: Venta): Venta {
    return {
      ...venta,
      totalFinal: Number(venta.totalFinal),
      montoAjusteRedondeo: venta.montoAjusteRedondeo
        ? Number(venta.montoAjusteRedondeo)
        : null,
      detalles: venta.detalles.map((detalle) => ({
        ...detalle,
        cantidad: Number(detalle.cantidad),
        precioUnitario: Number(detalle.precioUnitario),
        subtotal: Number(detalle.subtotal),
      })),
      pagos: venta.pagos.map((pago) => ({
        ...pago,
        monto: Number(pago.monto),
        montoBonificado: Number(pago.montoBonificado ?? 0),
      })),
    };
  }

  puedeAgregarPago(): boolean {
    if (!this.venta) {
      return false;
    }

    // Only allow adding payments if venta is not cancelled/annulled
    const estadoNombre = this.venta.estado.nombre.toLowerCase();
    if (estadoNombre === 'cancelada' || estadoNombre === 'anulada') {
      return false;
    }

    // Check if there's pending balance
    const saldoPendiente = this.venta.totalFinal - this.getTotalPagado();
    return saldoPendiente > 0.01; // Allow small tolerance for rounding
  }

  agregarPago(): void {
    if (!this.venta) {
      return;
    }

    const ref = this.dialogService.open(AgregarPagoComponent, {
      header: `Agregar Pago - Venta #${this.venta.id}`,
      width: '700px',
      modal: true,
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: {
        ventaId: this.venta.id,
        totalVenta: this.venta.totalFinal,
        totalPagado: this.getTotalPagado(),
        saldoPendiente: this.venta.totalFinal - this.getTotalPagado(),
      },
    });

    ref.onClose.subscribe((pagoCreado: boolean) => {
      if (pagoCreado) {
        this.cargarVenta(); // Reload venta data to show new payment
      }
    });
  }

  cambiarEstadoPago(pago: Pago): void {
    if (!pago) {
      return;
    }

    const ref = this.dialogService.open(EditarEstadoPagoComponent, {
      header: `Cambiar Estado de Pago #${pago.id}`,
      width: '400px',
      modal: true,
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: {
        pagoId: pago.id,
        estadoActualId: pago.idEstado,
        estadoActualNombre: pago.estado?.nombre,
      },
    });

    ref.onClose.subscribe((actualizado: boolean) => {
      if (actualizado) {
        this.cargarVenta(); // Recargar datos de la venta
      }
    });
  }

  anularVenta(): void {
    if (!this.venta) {
      return;
    }

    // Verificar que no esté ya anulada
    if (
      this.venta.estado.nombre.toLowerCase() === 'cancelada' ||
      this.venta.estado.nombre.toLowerCase() === 'anulada'
    ) {
      this.toastNotificationService.showError('La venta ya está anulada.');
      return;
    }

    const ref = this.dialogService.open(AnularVentaComponent, {
      header: `Anular Venta #${this.venta.id}`,
      width: '500px',
      modal: true,
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: { ventaId: this.venta.id },
    });

    ref.onClose.subscribe((anulada: boolean) => {
      if (anulada) {
        this.cargarVenta(); // Recargar datos de la venta
      }
    });
  }

  cerrar(): void {
    if (this.refDialog) {
      this.refDialog.close();
    }
  }
}
