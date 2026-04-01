import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import { Venta } from '../../../models/venta.interfaces';
import { VentaService } from '../../../services/venta.service';
import { PersonaService } from '../../../services/persona.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthService } from '../../../services/auth.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { VentaFormComponent } from '../formulario/venta-form.component';
import { VentaDetalleComponent } from '../detalle/venta-detalle.component';
import { AnularVentaComponent } from '../anular-venta/anular-venta.component';
import type { Persona } from '../../../models/persona.interfaces';
import type { Empleado } from '../../../models/empleado.interfaces';
import type { VentaEstado } from '../../../models/venta.interfaces';

@Component({
  selector: 'app-venta-lista',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ConfirmDialogModule,
    TagModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './venta-lista.component.html',
  styleUrl: './venta-lista.component.css',
})
export class VentaListaComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private dialogCrearSub?: Subscription;
  private dialogDetalleSub?: Subscription;
  private dialogAnularSub?: Subscription;

  listaVentas: Venta[] = [];
  private lastModifiedId: number | null = null;
  ventaSeleccionada: Venta | null = null;

  personas: Persona[] = [];
  empleados: Empleado[] = [];
  estadosVenta: VentaEstado[] = [];

  filtroPersonaSeleccionada: number | null = null;
  filtroEmpleadoSeleccionado: number | null = null;
  filtroEstadoSeleccionado: number | null = null;
  filtroFechaDesde: Date | null = null;
  filtroFechaHasta: Date | null = null;

  habilitaCrearVenta = true;
  habilitaVerDetalle = false;
  habilitaAnularVenta = false;

  refDialog?: DynamicDialogRef;

  constructor(
    private readonly ventaService: VentaService,
    private readonly personaService: PersonaService,
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.habilitaCrearVenta = this.authorizationService.canCreateVenta();
    this.habilitaVerDetalle = false;
    this.habilitaAnularVenta = false;
  }

  cargarCatalogos(): void {
    forkJoin({
      personas: this.personaService.list(),
      empleados: this.empleadoService.listEmpleados(),
      estados: this.ventaService.listEstados(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.personas = response.personas.data;
          this.empleados = response.empleados.data;
          this.estadosVenta = response.estados.data;
          this.cargaInicial();
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargaInicial(): void {
    const params: {
      idPersona?: number;
      idEmpleado?: number;
      idEstado?: number;
      fechaDesde?: string;
      fechaHasta?: string;
      activo?: boolean;
    } = {};

    if (this.filtroPersonaSeleccionada) {
      params.idPersona = this.filtroPersonaSeleccionada;
    }

    if (this.filtroEmpleadoSeleccionado) {
      params.idEmpleado = this.filtroEmpleadoSeleccionado;
    }

    if (this.filtroEstadoSeleccionado) {
      params.idEstado = this.filtroEstadoSeleccionado;
    }

    if (this.filtroFechaDesde) {
      params.fechaDesde = this.filtroFechaDesde.toISOString().split('T')[0];
    }

    if (this.filtroFechaHasta) {
      params.fechaHasta = this.filtroFechaHasta.toISOString().split('T')[0];
    }

    this.ventaService
      .list({
        idCliente: params.idPersona,
        idEmpleado: params.idEmpleado,
        idEstado: params.idEstado,
        fechaDesde: params.fechaDesde,
        fechaHasta: params.fechaHasta,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.listaVentas = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaVentas.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaVentas.splice(idx, 1);
              this.listaVentas.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          console.error('Error al cargar ventas:', error);
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onFiltroPersonaChange(): void {
    this.cargaInicial();
  }

  onFiltroEmpleadoChange(): void {
    this.cargaInicial();
  }

  onFiltroEstadoChange(): void {
    this.cargaInicial();
  }

  onFechaDesdeChange(): void {
    this.cargaInicial();
  }

  onFechaHastaChange(): void {
    this.cargaInicial();
  }

  getPersonaLabel(persona: Persona): string {
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getEmpleadoLabel(empleado: Empleado): string {
    if (empleado.usuario?.persona) {
      return `${empleado.usuario.persona.apellidos}, ${empleado.usuario.persona.nombres}`;
    }
    return 'Sin nombre';
  }

  ngOnDestroy(): void {
    this.dialogCrearSub?.unsubscribe();
    this.dialogDetalleSub?.unsubscribe();
    this.dialogAnularSub?.unsubscribe();
  }

  onVentaSelect(event: { data?: Venta | Venta[] }): void {
    if (event.data && !Array.isArray(event.data)) {
      this.ventaSeleccionada = event.data;
      this.habilitaVerDetalle = true;
      // Combine role permission with state-based restriction
      const estadoNombre =
        this.ventaSeleccionada?.estado?.nombre?.toLowerCase() ?? '';
      const canAnularByState =
        estadoNombre !== 'cancelada' && estadoNombre !== 'anulada';
      this.habilitaAnularVenta =
        this.authorizationService.canAnularVenta() && canAnularByState;
    }
  }

  onVentaUnselect(): void {
    this.ventaSeleccionada = null;
    this.habilitaVerDetalle = false;
    this.habilitaAnularVenta = false;
  }

  crearBoton(): void {
    this.refDialog = this.dialogService.open(VentaFormComponent, {
      header: 'Nueva Venta',
      width: '90vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
    });

    this.dialogCrearSub?.unsubscribe();
    this.dialogCrearSub = this.refDialog.onClose.subscribe(
      (result: unknown) => {
        if (
          result != null &&
          typeof result === 'object' &&
          'ventaId' in result &&
          (result as { ventaId: number }).ventaId != null
        ) {
          this.lastModifiedId = (result as { ventaId: number }).ventaId;
        }
        this.cargaInicial();
      },
    );
  }

  verDetalleBoton(): void {
    if (!this.ventaSeleccionada) {
      return;
    }

    this.refDialog = this.dialogService.open(VentaDetalleComponent, {
      header: `Detalle de Venta #${this.ventaSeleccionada.id}`,
      width: '80vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: {
        ventaId: this.ventaSeleccionada.id,
      },
    });

    this.dialogDetalleSub?.unsubscribe();
    this.dialogDetalleSub = this.refDialog.onClose.subscribe(() => {
      this.cargaInicial();
    });
  }

  anularBoton(): void {
    if (!this.ventaSeleccionada) {
      return;
    }

    this.abrirDialogoAnular(this.ventaSeleccionada);
  }

  abrirDialogoAnular(venta: Venta): void {
    const ref = this.dialogService.open(AnularVentaComponent, {
      header: `Anular Venta #${venta.id}`,
      width: '500px',
      modal: true,
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: { ventaId: venta.id },
    });

    this.dialogAnularSub?.unsubscribe();
    this.dialogAnularSub = ref.onClose.subscribe((anulada: boolean) => {
      if (anulada) {
        this.cargaInicial(); // Recargar lista
        this.ventaSeleccionada = null;
        this.habilitaVerDetalle = false;
        this.habilitaAnularVenta = false;
      }
    });
  }

  getVentaEstadoSeverity(
    nombre: string | undefined,
  ): 'success' | 'secondary' | 'warn' | 'info' | 'danger' | 'contrast' {
    switch (nombre?.toLowerCase()) {
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warn';
      case 'cancelada':
      case 'anulada':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
