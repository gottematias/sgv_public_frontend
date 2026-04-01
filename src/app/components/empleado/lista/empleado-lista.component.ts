import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Empleado, Puesto } from '../../../models/empleado.interfaces';
import { EmpleadoFormComponent } from '../formulario/empleado-form.component';

interface FiltroPuesto {
  label: string;
  value: number;
}

interface FiltroActivo {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-empleado-lista',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconField,
    InputIcon,
    TagModule,
    SelectModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './empleado-lista.component.html',
  styleUrls: ['./empleado-lista.component.css'],
})
export class EmpleadoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaEmpleados: Empleado[] = [];
  private lastModifiedId: number | null = null;
  empleadoSeleccionado: Empleado | null = null;
  habilitaCrear = false;
  habilitaEditar = false;
  habilitaEliminarEmpleado = false;
  puedeVerActivo = false;

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  searchQuery = '';
  puestos: Puesto[] = [];
  filtrosPuesto: FiltroPuesto[] = [];
  filtroPuestosSeleccionados: FiltroPuesto[] = [];

  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargarPuestos();
    this.cargaInicial();
    this.habilitaCrear = this.authorizationService.canCreateEmpleado();
    this.habilitaEditar = false;
    this.habilitaEliminarEmpleado = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.cargaInicial();
      });
  }

  ngAfterViewInit(): void {
    this.calculateTableHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateTableHeight();
  }

  private calculateTableHeight(): void {
    setTimeout(() => {
      if (this.tableContainer) {
        const containerHeight = this.tableContainer.nativeElement.offsetHeight;
        const pDataTable =
          this.tableContainer.nativeElement.querySelector('.p-datatable');

        if (pDataTable) {
          const header = pDataTable.querySelector('.p-datatable-thead');
          const headerHeight = header ? header.offsetHeight : 50;

          const adjustedHeight = containerHeight - headerHeight - 5;
          this.tableScrollHeight = `${Math.max(adjustedHeight, 100)}px`;
        } else {
          this.tableScrollHeight = `${containerHeight - 55}px`;
        }
      }
    }, 100);
  }

  cargarPuestos(): void {
    this.empleadoService.listPuestos().subscribe({
      next: (response) => {
        this.puestos = response.data;
        this.filtrosPuesto = this.puestos.map((p) => ({
          label: p.nombre,
          value: p.id,
        }));
      },
      error: (error) => {
        console.error('Error al cargar puestos:', error);
      },
    });
  }

  cargaInicial(): void {
    const activo = this.filtroActivoSeleccionado.value ?? undefined;
    const query = this.searchQuery.trim() || undefined;
    const idPuestos =
      this.filtroPuestosSeleccionados.length > 0
        ? this.filtroPuestosSeleccionados.map((f) => f.value)
        : undefined;

    this.empleadoService
      .listEmpleados(query, PAGINATION_LIMITS.CATALOG, 0, idPuestos, activo)
      .subscribe({
        next: (response) => {
          this.listaEmpleados = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaEmpleados.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaEmpleados.splice(idx, 1);
              this.listaEmpleados.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  onFiltroPuestosChange(): void {
    this.cargaInicial();
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  crearEmpleadoBoton(): void {
    this.refDialog = this.dialogService.open(EmpleadoFormComponent, {
      header: 'Crear nuevo Empleado',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { empleadoId: null },
    });

    this.refDialog.onClose.subscribe((result: unknown) => {
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
    });
  }

  editarEmpleadoBoton(): void {
    if (!this.empleadoSeleccionado) {
      return;
    }

    this.refDialog = this.dialogService.open(EmpleadoFormComponent, {
      header: 'Editar Empleado',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { empleadoId: this.empleadoSeleccionado.id },
    });

    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.empleadoSeleccionado?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarEmpleadoBoton(): void {
    if (!this.empleadoSeleccionado) {
      return;
    }

    const nombreCompleto =
      `${this.empleadoSeleccionado.usuario?.persona?.nombres || ''} ${this.empleadoSeleccionado.usuario?.persona?.apellidos || ''}`.trim();

    this.confirmationService.confirm({
      key: 'empleadoLista',
      message: `¿Está seguro que desea eliminar al empleado ${nombreCompleto}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.empleadoService.delete(this.empleadoSeleccionado!.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Empleado eliminado correctamente',
            );
            this.cargaInicial();
            this.habilitaEditar = false;
            this.habilitaEliminarEmpleado = false;
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
    });
  }

  onRowSelect(): void {
    this.habilitaEditar = this.authorizationService.canEditEmpleado();
    this.habilitaEliminarEmpleado =
      this.authorizationService.canDeleteEmpleado();
  }

  onRowUnselect(): void {
    this.habilitaEditar = false;
    this.habilitaEliminarEmpleado = false;
  }

  getActivoSeverity(
    activo: boolean,
  ): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' {
    return activo ? 'success' : 'secondary';
  }

  getActivoLabel(activo: boolean): string {
    return activo ? 'Activo' : 'Inactivo';
  }

  getPuestosLabels(empleado: Empleado): string[] {
    if (!empleado.empleadosPuestos || empleado.empleadosPuestos.length === 0) {
      return [];
    }
    return empleado.empleadosPuestos
      .filter((ep) => ep.puesto)
      .map((ep) => ep.puesto!.nombre);
  }

  getEspecialidadesLabels(empleado: Empleado): string[] {
    if (
      !empleado.empleadosEspecialidades ||
      empleado.empleadosEspecialidades.length === 0
    ) {
      return [];
    }
    return empleado.empleadosEspecialidades
      .filter((ee) => ee.especialidad)
      .map((ee) => ee.especialidad!.nombre);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getPersonaNombreCompleto(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) return '-';
    const apellidos = persona.apellidos || '';
    const nombres = persona.nombres || '';
    return `${apellidos}, ${nombres}`.trim();
  }
}
