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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, Subscription } from 'rxjs';
import { Vacuna } from '../../../models/vacuna.interfaces';
import { VacunaService } from '../../../services/vacuna.service';
import { MascotaService } from '../../../services/mascota.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { VacunaFormComponent } from '../formulario/vacuna-form.component';
import type { Mascota } from '../../../models/mascota.interfaces';
import type { Empleado } from '../../../models/empleado.interfaces';

interface FiltroActivo {
  label: string;
  value: boolean;
}

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-vacuna-lista',
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
  templateUrl: './vacuna-lista.component.html',
  styleUrl: './vacuna-lista.component.css',
})
export class VacunaListaComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private dialogCrearSub?: Subscription;
  private dialogEditarSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaVacunas: Vacuna[] = [];
  private lastModifiedId: number | null = null;
  vacunaSeleccionada: Vacuna | null = null;

  mascotas: Mascota[] = [];
  empleados: Empleado[] = [];

  filtroMascotaSeleccionada: number | null = null;
  filtroEmpleadoSeleccionado: number | null = null;
  filtroFechaDesde: Date | null = null;
  filtroFechaHasta: Date | null = null;

  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  habilitaCrearVacuna = true;
  habilitaEditarVacuna = false;
  habilitaEliminarVacuna = false;
  puedeVerActivo = false;

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  constructor(
    private readonly vacunaService: VacunaService,
    private readonly mascotaService: MascotaService,
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.cargarCatalogos();
    this.habilitaCrearVacuna = this.authorizationService.canCreateVacuna();
    this.habilitaEditarVacuna = false;
    this.habilitaEliminarVacuna = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
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

  cargarCatalogos(): void {
    forkJoin({
      mascotas: this.mascotaService.list(),
      empleados: this.empleadoService.listEmpleados(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.mascotas = response.mascotas.data;
          this.empleados = response.empleados.data;
          this.cargaInicial();
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargaInicial(): void {
    const params: {
      idMascota?: number;
      idEmpleado?: number;
      fechaDesde?: string;
      fechaHasta?: string;
      activo?: boolean;
    } = {};

    if (this.filtroMascotaSeleccionada) {
      params.idMascota = this.filtroMascotaSeleccionada;
    }

    if (this.filtroEmpleadoSeleccionado) {
      params.idEmpleado = this.filtroEmpleadoSeleccionado;
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

    this.vacunaService
      .list(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.listaVacunas = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaVacunas.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaVacunas.splice(idx, 1);
              this.listaVacunas.unshift(item);
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

  onFiltroEmpleadoChange(): void {
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

  crearVacunaBoton(): void {
    this.refDialog = this.dialogService.open(VacunaFormComponent, {
      header: 'Registrar nueva vacuna',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { vacunaId: null },
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
        this.vacunaSeleccionada = null;
        this.habilitaEditarVacuna = false;
        this.habilitaEliminarVacuna = false;
      },
    );
  }

  editarVacunaBoton(): void {
    if (!this.vacunaSeleccionada) {
      return;
    }

    this.refDialog = this.dialogService.open(VacunaFormComponent, {
      header: 'Editar registro de vacuna',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { vacunaId: this.vacunaSeleccionada.id },
    });

    this.dialogEditarSub?.unsubscribe();
    this.dialogEditarSub = this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.vacunaSeleccionada?.id ?? null;
      this.cargaInicial();
      this.vacunaSeleccionada = null;
      this.habilitaEditarVacuna = false;
      this.habilitaEliminarVacuna = false;
    });
  }

  eliminarVacunaBoton(): void {
    if (!this.vacunaSeleccionada) return;

    const mascotaNombre = this.vacunaSeleccionada.mascota?.nombre || 'N/A';
    const fechaAplicacion = this.vacunaSeleccionada.fechaAplicacion
      ? new Date(this.vacunaSeleccionada.fechaAplicacion).toLocaleDateString(
          'es-AR',
          { day: '2-digit', month: '2-digit', year: 'numeric' },
        )
      : 'N/A';

    this.confirmationService.confirm({
      key: 'vacunaLista',
      message: `¿Está seguro de que desea eliminar el registro de vacuna de ${mascotaNombre} (${fechaAplicacion})?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.vacunaService.delete(this.vacunaSeleccionada!.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Vacuna eliminada correctamente',
            );
            this.cargaInicial();
            this.habilitaEditarVacuna = false;
            this.habilitaEliminarVacuna = false;
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
    this.habilitaEditarVacuna = this.authorizationService.canEditVacuna();
    this.habilitaEliminarVacuna = this.authorizationService.canDeleteVacuna();
  }

  onRowUnselect(): void {
    this.habilitaEditarVacuna = false;
    this.habilitaEliminarVacuna = false;
  }

  getEmpleadoLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getMascotaLabel(mascota: Mascota): string {
    const persona = mascota.persona;
    if (!persona) {
      return mascota.nombre;
    }
    return `${mascota.nombre} (${persona.apellidos}, ${persona.nombres})`;
  }

  getVeterinarioNombre(vacuna: Vacuna): string {
    const persona = vacuna.empleado?.usuario?.persona;
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getMascotaNombre(vacuna: Vacuna): string {
    return vacuna.mascota?.nombre || '-';
  }

  getDuenioNombre(vacuna: Vacuna): string {
    const persona = vacuna.mascota?.persona;
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getVacunaTipoNombre(vacuna: Vacuna): string {
    return vacuna.vacunaTipo?.nombre || '-';
  }
}
