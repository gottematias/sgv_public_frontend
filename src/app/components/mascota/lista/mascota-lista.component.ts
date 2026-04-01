import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { Mascota, MascotaEstado } from '../../../models/mascota.interfaces';
import { MascotaService } from '../../../services/mascota.service';
import { PersonaService } from '../../../services/persona.service';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { MascotaFormComponent } from '../formulario/mascota-form.component';

interface FiltroActivo {
  label: string;
  value: boolean;
}

interface FiltroPersona {
  label: string;
  value: number;
}

interface FiltroEstado {
  label: string;
  value: number;
}

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-mascota-lista',
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
  templateUrl: './mascota-lista.component.html',
  styleUrl: './mascota-lista.component.css',
})
export class MascotaListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaMascotas: Mascota[] = [];
  private lastModifiedId: number | null = null;
  mascotaSeleccionada: Mascota | null = null;

  habilitaCrearMascota = true;
  habilitaEditarMascota = false;
  habilitaEliminarMascota = false;
  puedeVerActivo = false;

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  filtrosPersona: FiltroPersona[] = [];
  filtroPersonaSeleccionado: FiltroPersona | null = null;

  estados: MascotaEstado[] = [];
  filtrosEstado: FiltroEstado[] = [];
  filtrosEstadoSeleccionados: FiltroEstado[] = [];

  constructor(
    private readonly mascotaService: MascotaService,
    private readonly personaService: PersonaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargarPersonas();
    this.cargarEstados();
    this.cargaInicial();
    this.habilitaCrearMascota = this.authorizationService.canCreateMascota();
    this.habilitaEditarMascota = false;
    this.habilitaEliminarMascota = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
  }

  ngAfterViewInit(): void {
    this.calculateTableHeight();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
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

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.cargaInicial();
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  cargarPersonas(): void {
    this.personaService
      .list(undefined, PAGINATION_LIMITS.CATALOG_LARGE, 0, true)
      .subscribe({
        next: (response) => {
          this.filtrosPersona = response.data
            .map((persona) => ({
              label: `${persona.apellidos}, ${persona.nombres}`,
              value: persona.id,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  cargarEstados(): void {
    this.mascotaService.listMascotaEstados().subscribe({
      next: (response) => {
        this.estados = response.data;
        this.filtrosEstado = this.estados.map((e) => ({
          label: e.nombre,
          value: e.id,
        }));
      },
      error: (error) => {
        console.error('Error al cargar estados:', error);
      },
    });
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  onFiltroPersonaChange(): void {
    this.cargaInicial();
  }

  onFiltrosEstadoChange(): void {
    this.cargaInicial();
  }

  cargaInicial(): void {
    const activo = this.filtroActivoSeleccionado.value ?? undefined;
    const query = this.searchQuery.trim() || undefined;
    const idPersona = this.filtroPersonaSeleccionado?.value ?? undefined;
    const idMascotaEstados =
      this.filtrosEstadoSeleccionados.length > 0
        ? this.filtrosEstadoSeleccionados.map((f) => f.value)
        : undefined;

    this.mascotaService
      .list(
        query,
        PAGINATION_LIMITS.PAGE,
        0,
        idPersona,
        idMascotaEstados,
        activo,
      )
      .subscribe({
        next: (response) => {
          this.listaMascotas = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaMascotas.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaMascotas.splice(idx, 1);
              this.listaMascotas.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }

  crearMascotaBoton(): void {
    this.refDialog = this.dialogService.open(MascotaFormComponent, {
      header: 'Crear nueva mascota',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { mascotaId: null },
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
      this.mascotaSeleccionada = null;
      this.habilitaEditarMascota = false;
      this.habilitaEliminarMascota = false;
    });
  }

  editarMascotaBoton(): void {
    if (!this.mascotaSeleccionada) {
      return;
    }

    this.refDialog = this.dialogService.open(MascotaFormComponent, {
      header: 'Editar mascota',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { mascotaId: this.mascotaSeleccionada.id },
    });

    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.mascotaSeleccionada?.id ?? null;
      this.cargaInicial();
      this.mascotaSeleccionada = null;
      this.habilitaEditarMascota = false;
      this.habilitaEliminarMascota = false;
    });
  }

  eliminarMascotaBoton(): void {
    if (!this.mascotaSeleccionada) {
      return;
    }

    this.confirmationService.confirm({
      key: 'mascotaLista',
      message: `¿Está seguro que desea eliminar a ${this.mascotaSeleccionada.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.mascotaService.delete(this.mascotaSeleccionada!.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Mascota eliminada correctamente',
            );
            this.cargaInicial();
            this.mascotaSeleccionada = null;
            this.habilitaEditarMascota = false;
            this.habilitaEliminarMascota = false;
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
    });
  }

  onRowSelect(): void {
    this.habilitaEditarMascota = this.authorizationService.canEditMascota();
    this.habilitaEliminarMascota = this.authorizationService.canDeleteMascota();
  }

  onRowUnselect(): void {
    this.habilitaEditarMascota = false;
    this.habilitaEliminarMascota = false;
  }

  getMascotaEstadoSeverity(
    id: number | undefined,
  ): 'success' | 'secondary' | 'warn' | 'info' | 'danger' | 'contrast' {
    switch (id) {
      case 1:
        return 'success'; // Activo
      case 2:
        return 'secondary'; // Fallecido
      case 3:
        return 'warn'; // Extraviado
      case 4:
        return 'info'; // En Tratamiento
      case 5:
        return 'danger'; // Inactivo
      default:
        return 'contrast';
    }
  }
}
