import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { MascotaService } from '../../../services/mascota.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import type { HistorialClinico } from '../../../models/historial-clinico.interfaces';
import type { Mascota } from '../../../models/mascota.interfaces';
import type { Empleado } from '../../../models/empleado.interfaces';
import { ClinicaFormComponent } from '../formulario/clinica-form.component';

interface FiltroActivo {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-clinica-lista',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    DatePickerModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './clinica-lista.component.html',
  styleUrls: ['./clinica-lista.component.css'],
})
export class ClinicaListaComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private dialogCrearSub?: Subscription;
  private dialogEditarSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  @Input() mascotaId?: number;
  @Input() showMascotaFilter = true;
  @Input() showToolbar = true;
  @Input() clickToOpen = false;
  @Output() rowClicked = new EventEmitter<HistorialClinico>();

  listaHistoriales: HistorialClinico[] = [];
  private lastModifiedId: number | null = null;
  historialSeleccionado: HistorialClinico | null = null;

  mascotas: Mascota[] = [];
  veterinarios: Empleado[] = [];

  filtroMascotaSeleccionada: number | null = null;
  filtroVeterinarioSeleccionado: number | null = null;
  filtroFechaDesde: Date | null = null;
  filtroFechaHasta: Date | null = null;

  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  habilitaCrear = true;
  habilitaEditar = false;
  habilitaEliminar = false;
  puedeVerActivo = false;

  tableScrollHeight = 'calc(100vh - 300px)';
  refDialog: DynamicDialogRef | null = null;

  constructor(
    private readonly historialClinicoService: HistorialClinicoService,
    private readonly mascotaService: MascotaService,
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.habilitaCrear = this.authorizationService.canCreateClinica();
    this.habilitaEditar = false;
    this.habilitaEliminar = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
    this.cargarCatalogos();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calcularAlturaTabla();
    }, 100);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calcularAlturaTabla();
  }

  calcularAlturaTabla(): void {
    if (this.tableContainer?.nativeElement) {
      const containerTop =
        this.tableContainer.nativeElement.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - containerTop - 20;
      this.tableScrollHeight = `${availableHeight}px`;
    }
  }

  cargarCatalogos(): void {
    forkJoin({
      mascotas: this.mascotaService.list(),
      empleados: this.empleadoService.listVeterinarios(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.mascotas = response.mascotas.data;
          this.veterinarios = response.empleados.data;
          this.cargaInicial();
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargaInicial(): void {
    // If mascotaId is provided via Input, auto-set the filter
    if (this.mascotaId) {
      this.filtroMascotaSeleccionada = this.mascotaId;
    }

    const params: {
      idMascota?: number;
      idEmpleadoAsignado?: number;
      fechaDesde?: string;
      fechaHasta?: string;
      activo?: boolean;
    } = {};

    if (this.filtroMascotaSeleccionada) {
      params.idMascota = this.filtroMascotaSeleccionada;
    }

    if (this.filtroVeterinarioSeleccionado) {
      params.idEmpleadoAsignado = this.filtroVeterinarioSeleccionado;
    }

    if (this.filtroFechaDesde) {
      params.fechaDesde = this.filtroFechaDesde.toISOString();
    }

    if (this.filtroFechaHasta) {
      params.fechaHasta = this.filtroFechaHasta.toISOString();
    }

    if (this.filtroActivoSeleccionado.value !== null) {
      params.activo = this.filtroActivoSeleccionado.value;
    }

    this.historialClinicoService
      .list(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.listaHistoriales = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaHistoriales.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaHistoriales.splice(idx, 1);
              this.listaHistoriales.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onFiltroMascotaChange(): void {
    this.cargaInicial();
  }

  onFiltroVeterinarioChange(): void {
    this.cargaInicial();
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  onFechaDesdeChange(): void {
    if (this.filtroFechaDesde !== null) {
      // Set time to 00:00:00.000
      this.filtroFechaDesde.setHours(0, 0, 0, 0);

      // If Fecha Hasta exists and is before Fecha Desde, reset Fecha Hasta
      if (
        this.filtroFechaHasta !== null &&
        this.filtroFechaHasta < this.filtroFechaDesde
      ) {
        this.filtroFechaHasta = null;
      }
    }

    this.cargaInicial();
  }

  onFechaHastaChange(): void {
    if (this.filtroFechaHasta !== null) {
      // Set time to 23:59:59.999
      this.filtroFechaHasta.setHours(23, 59, 59, 999);

      // If Fecha Desde exists and is after Fecha Hasta, reset Fecha Desde
      if (
        this.filtroFechaDesde !== null &&
        this.filtroFechaDesde > this.filtroFechaHasta
      ) {
        this.filtroFechaDesde = null;
      }
    }

    this.cargaInicial();
  }

  crearHistorialBoton(): void {
    this.refDialog = this.dialogService.open(ClinicaFormComponent, {
      header: 'Nueva Consulta Clínica',
      width: '90vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {},
    });

    this.dialogCrearSub?.unsubscribe();
    this.dialogCrearSub = this.refDialog.onClose.subscribe(
      (result: unknown) => {
        if (
          result != null &&
          typeof result === 'object' &&
          'code' in result &&
          'data' in result &&
          (result as { code: number; data: number | null }).code === 0 &&
          (result as { code: number; data: number | null }).data != null
        ) {
          this.lastModifiedId = (
            result as { code: number; data: number | null }
          ).data;
        }
        this.cargaInicial();
      },
    );
  }

  editarHistorialBoton(): void {
    if (!this.historialSeleccionado) return;

    this.refDialog = this.dialogService.open(ClinicaFormComponent, {
      header: 'Editar Consulta Clínica',
      width: '90vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        historialId: this.historialSeleccionado.id,
      },
    });

    this.dialogEditarSub?.unsubscribe();
    this.dialogEditarSub = this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.historialSeleccionado?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarHistorialBoton(): void {
    if (!this.historialSeleccionado) return;

    const mascotaNombre = this.historialSeleccionado.mascota?.nombre || 'N/A';
    const fechaConsulta = this.historialSeleccionado.fechaConsulta
      ? new Date(this.historialSeleccionado.fechaConsulta).toLocaleDateString(
          'es-AR',
          { day: '2-digit', month: '2-digit', year: 'numeric' },
        )
      : 'N/A';

    this.confirmationService.confirm({
      key: 'clinicaLista',
      message: `¿Está seguro de que desea eliminar el historial clínico de ${mascotaNombre} (${fechaConsulta})?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.historialClinicoService
          .delete(this.historialSeleccionado!.id)
          .subscribe({
            next: () => {
              this.toastNotificationService.showSuccess(
                'Historial clínico eliminado correctamente',
              );
              this.cargaInicial();
              this.habilitaEditar = false;
              this.habilitaEliminar = false;
            },
            error: (error) => {
              this.httpErrorHandler.showErrorToast(error);
            },
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.dialogCrearSub?.unsubscribe();
    this.dialogEditarSub?.unsubscribe();
  }

  onRowSelect(): void {
    this.habilitaEditar = this.authorizationService.canEditClinica();
    this.habilitaEliminar = this.authorizationService.canDeleteClinica();
  }

  onRowUnselect(): void {
    this.habilitaEditar = false;
    this.habilitaEliminar = false;
  }

  onRowClick(historial: HistorialClinico): void {
    if (this.clickToOpen) {
      this.rowClicked.emit(historial);
    }
  }

  getVeterinarioLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getVeterinarioNombre(historial: HistorialClinico): string {
    const persona = historial.empleadoAsignado?.usuario?.persona;
    if (!persona) {
      return '-';
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }
}
