import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { Turno, TurnoEstado } from '../../../models/turno.interfaces';
import { Empleado } from '../../../models/empleado.interfaces';
import { Mascota } from '../../../models/mascota.interfaces';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';

import { TurnoService } from '../../../services/turno.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { MascotaService } from '../../../services/mascota.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { AuthService } from '../../../services/auth.service';
import { Rol } from '../../../constants/rol.enum';

import { ToastNotificationService } from '../../../services/toast-notification.service';
import { TurnoFormComponent } from '../formulario/turno-form.component';

interface FiltroActivo {
  label: string;
  value: boolean;
}

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-turno-lista',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    DatePickerModule,
    SelectModule,
    MultiSelectModule,
    TooltipModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './turno-lista.component.html',
  styleUrl: './turno-lista.component.css',
})
export class TurnoListaComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private dialogCrearSub?: Subscription;
  private dialogEditarSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaTurnos: Turno[] = [];
  private lastModifiedId: number | null = null;
  turnoSeleccionado: Turno | null = null;

  habilitaCrearTurno = true;
  habilitaEditarTurno = false;
  habilitaEliminarTurno = false;
  puedeVerActivo = false;
  puedeVerTodosVeterinarios = true;

  veterinarios: Empleado[] = [];
  mascotas: Mascota[] = [];
  estados: TurnoEstado[] = [];

  filtroVeterinario: number | null = null;
  filtroMascotaSeleccionada: number | null = null;
  estadosSeleccionados: number[] = [];
  filtroFechaDesde: Date | null = null;
  filtroFechaHasta: Date | null = null;

  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  constructor(
    private readonly turnoService: TurnoService,
    private readonly empleadoService: EmpleadoService,
    private readonly mascotaService: MascotaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authorizationService: AuthorizationService,
    private readonly authService: AuthService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.habilitaCrearTurno = this.authorizationService.canCreateTurno();
    this.habilitaEditarTurno = false;
    this.habilitaEliminarTurno = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
    this.puedeVerTodosVeterinarios = !this.authService.hasRole(Rol.VETERINARIO);

    if (this.authService.hasRole(Rol.VETERINARIO)) {
      const usuarioId = this.authService.getAuthEstado().usuario_id;
      if (usuarioId != null) {
        this.empleadoService
          .getEmpleado(usuarioId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (response) => {
              this.filtroVeterinario = response.data.id;
              this.cargarFiltros();
              this.cargaInicial();
            },
            error: (error) => {
              this.httpErrorHandler.showErrorToast(error);
              this.cargarFiltros();
              this.cargaInicial();
            },
          });
      } else {
        this.cargarFiltros();
        this.cargaInicial();
      }
    } else {
      this.cargarFiltros();
      this.cargaInicial();
    }
  }

  ngAfterViewInit(): void {
    this.calculateTableHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.calculateTableHeight();
  }

  calculateTableHeight(): void {
    if (this.tableContainer) {
      const containerTop =
        this.tableContainer.nativeElement.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - containerTop - 40;
      this.tableScrollHeight = `${availableHeight}px`;
      this.cdr.detectChanges();
    }
  }

  cargarFiltros(): void {
    this.empleadoService
      .listVeterinarios()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.veterinarios = response.data;
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });

    this.turnoService
      .listTurnoEstados()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.estados = response.data;
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });

    this.mascotaService
      .list(undefined, PAGINATION_LIMITS.CATALOG, 0, undefined, undefined, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.mascotas = response.data;
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargaInicial(): void {
    const params: {
      idEmpleadoAsignado?: number;
      idMascota?: number;
      idTurnoEstado?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      activo?: boolean;
    } = {};

    if (this.filtroVeterinario !== null) {
      params.idEmpleadoAsignado = this.filtroVeterinario;
    }

    if (this.filtroMascotaSeleccionada !== null) {
      params.idMascota = this.filtroMascotaSeleccionada;
    }

    if (this.estadosSeleccionados.length > 0) {
      params.idTurnoEstado = this.estadosSeleccionados.join(',');
    }

    if (this.filtroFechaDesde !== null) {
      params.fechaDesde = this.filtroFechaDesde.toISOString();
    }

    if (this.filtroFechaHasta !== null) {
      params.fechaHasta = this.filtroFechaHasta.toISOString();
    }

    if (this.filtroActivoSeleccionado.value !== null) {
      params.activo = this.filtroActivoSeleccionado.value;
    }

    this.turnoService
      .list(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.listaTurnos = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaTurnos.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaTurnos.splice(idx, 1);
              this.listaTurnos.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  onFiltroMascotaChange(): void {
    this.cargaInicial();
  }

  onFiltroVeterinarioChange(): void {
    this.cargaInicial();
  }

  onFiltroEstadoChange(): void {
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

  crearTurnoBoton(): void {
    this.refDialog = this.dialogService.open(TurnoFormComponent, {
      header: 'Crear nuevo turno',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { turnoId: null },
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
        this.turnoSeleccionado = null;
        this.habilitaEditarTurno = false;
        this.habilitaEliminarTurno = false;
      },
    );
  }

  editarTurnoBoton(): void {
    if (!this.turnoSeleccionado) {
      return;
    }

    this.refDialog = this.dialogService.open(TurnoFormComponent, {
      header: 'Editar turno',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { turnoId: this.turnoSeleccionado.id },
    });

    this.dialogEditarSub?.unsubscribe();
    this.dialogEditarSub = this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.turnoSeleccionado?.id ?? null;
      this.cargaInicial();
      this.turnoSeleccionado = null;
      this.habilitaEditarTurno = false;
      this.habilitaEliminarTurno = false;
    });
  }

  eliminarTurnoBoton(): void {
    if (!this.turnoSeleccionado) {
      return;
    }

    const estadoNombre = this.turnoSeleccionado.turnoEstado?.nombre;
    if (
      estadoNombre === 'Completado' ||
      estadoNombre === 'Cancelado por Cliente' ||
      estadoNombre === 'Cancelado por Clinica'
    ) {
      this.toastNotificationService.showWarning(
        'No se pueden eliminar turnos completados o cancelados',
      );
      return;
    }

    this.confirmationService.confirm({
      key: 'turnoLista',
      message: `¿Está seguro que desea eliminar el turno del ${this.formatFechaHora(this.turnoSeleccionado.fechaHora)}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.turnoService.delete(this.turnoSeleccionado!.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Turno eliminado correctamente',
            );
            this.cargaInicial();
            this.turnoSeleccionado = null;
            this.habilitaEditarTurno = false;
            this.habilitaEliminarTurno = false;
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
    this.habilitaEditarTurno = this.authorizationService.canEditTurno();

    // Combine role permission with state-based restriction
    const estadoNombre = this.turnoSeleccionado?.turnoEstado?.nombre;
    const canDeleteByState =
      estadoNombre !== 'Completado' &&
      estadoNombre !== 'Cancelado por Cliente' &&
      estadoNombre !== 'Cancelado por Clinica';

    this.habilitaEliminarTurno =
      this.authorizationService.canDeleteTurno() && canDeleteByState;
  }

  onRowUnselect(): void {
    this.habilitaEditarTurno = false;
    this.habilitaEliminarTurno = false;
  }

  getVeterinarioNombre(turno: Turno): string {
    const persona = turno.empleadoAsignado?.usuario?.persona;
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getEmpleadoNombre(turno: Turno): string {
    const persona = turno.usuarioRegistro?.persona;
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getMascotaNombre(turno: Turno): string {
    return turno.mascota?.nombre || '-';
  }

  getDuenioNombre(turno: Turno): string {
    const persona = turno.mascota?.persona;
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  formatFechaHora(fechaHora: string): string {
    const date = new Date(fechaHora);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getEstadoSeverity(
    estado: string,
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (estado) {
      case 'Pendiente':
        return 'warning';
      case 'Confirmado':
        return 'info';
      case 'En Curso':
        return 'info';
      case 'Completado':
        return 'success';
      case 'Cancelado por Cliente':
      case 'Cancelado por Clinica':
      case 'No Asistio':
        return 'danger';
      case 'Reprogramado':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  getVeterinarioLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }
}
