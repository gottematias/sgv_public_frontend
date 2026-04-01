import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PersonaService } from '../../../services/persona.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { PersonaFormComponent } from '../formulario/persona-form.component';
import { Persona } from '../../../models/persona.interfaces';

interface FiltroActivo {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-persona-lista',
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    IconField,
    InputIcon,
    ConfirmDialogModule,
    FormsModule,
    SelectModule,
    TooltipModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './persona-lista.component.html',
  styleUrls: ['./persona-lista.component.css'],
})
export class PersonaListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaPersonas!: Persona[];
  private lastModifiedId: number | null = null;
  personaSeleccionada!: Persona;

  habilitaCrearPersona = false;
  habilitaEditarPersona = false;
  habilitaEliminarPersona = false;
  puedeVerActivo = false;

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  searchQuery = '';
  filtrosActivo: FiltroActivo[] = [
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[0];

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private readonly personaService: PersonaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargaInicial();
    this.habilitaCrearPersona = this.authorizationService.canCreatePersona();
    this.habilitaEditarPersona = false;
    this.habilitaEliminarPersona = false;
    this.puedeVerActivo = this.authorizationService.canToggleActivo();
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.length === 0 || query.length >= 2) {
          this.cargaInicial();
        }
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

  crearPersonaBoton() {
    this.refDialog = this.dialogService.open(PersonaFormComponent, {
      header: 'Crear nueva Persona',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        personaId: null,
      },
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

  editarPersonaBoton() {
    this.refDialog = this.dialogService.open(PersonaFormComponent, {
      header: 'Editar Persona',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        personaId: this.personaSeleccionada.id,
      },
    });
    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.personaSeleccionada?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarPersonaBoton() {
    this.confirmationService.confirm({
      key: 'personaLista',
      message: `¿Está seguro que desea eliminar a ${this.personaSeleccionada.nombres} ${this.personaSeleccionada.apellidos}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.personaService.delete(this.personaSeleccionada.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Persona eliminada correctamente',
            );
            this.cargaInicial();
            this.habilitaEditarPersona = false;
            this.habilitaEliminarPersona = false;
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
    });
  }

  onRowSelect() {
    this.habilitaEditarPersona = this.authorizationService.canEditPersona();
    this.habilitaEliminarPersona = this.authorizationService.canDeletePersona();
  }

  onRowUnselect() {
    this.habilitaEditarPersona = false;
    this.habilitaEliminarPersona = false;
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  private cargaInicial(): void {
    const activo = this.filtroActivoSeleccionado.value ?? undefined;
    const query = this.searchQuery.trim() || undefined;

    this.personaService
      .list(query, PAGINATION_LIMITS.PAGE, 0, activo)
      .subscribe({
        next: (response) => {
          this.listaPersonas = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaPersonas.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaPersonas.splice(idx, 1);
              this.listaPersonas.unshift(item);
            }
            this.lastModifiedId = null;
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
  }
}
