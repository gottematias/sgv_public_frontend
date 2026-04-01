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
import { DecimalPipe } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ServicioService } from '../../../../services/servicio.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { PAGINATION_LIMITS } from '../../../../constants/pagination.constant';
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
import { ServicioFormComponent } from '../formulario/servicio-form.component';
import { Servicio } from '../../../../models/stock.interfaces';

interface FiltroActivo {
  label: string;
  value: boolean | null;
}

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-servicio-lista',
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
    DecimalPipe,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './servicio-lista.component.html',
  styleUrls: ['./servicio-lista.component.css'],
})
export class ServicioListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaServicios!: Servicio[];
  private lastModifiedId: number | null = null;
  servicioSeleccionado!: Servicio;

  habilitaCrearServicio = false;
  habilitaEditarServicio = false;
  habilitaEliminarServicio = false;
  puedeVerActivo = false;

  refDialog?: DynamicDialogRef;
  tableScrollHeight = '400px';

  searchQuery = '';
  filtrosActivo: FiltroActivo[] = [
    { label: 'Todos', value: null },
    { label: 'Activos', value: true },
    { label: 'Inactivos', value: false },
  ];
  filtroActivoSeleccionado: FiltroActivo = this.filtrosActivo[1];

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private readonly servicioService: ServicioService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargaInicial();
    this.habilitaCrearServicio = this.authorizationService.canCreateServicio();
    this.habilitaEditarServicio = false;
    this.habilitaEliminarServicio = false;
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

  crearServicioBoton() {
    this.refDialog = this.dialogService.open(ServicioFormComponent, {
      header: 'Crear nuevo Servicio',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        servicioId: null,
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

  editarServicioBoton() {
    this.refDialog = this.dialogService.open(ServicioFormComponent, {
      header: 'Editar Servicio',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        servicioId: this.servicioSeleccionado.id,
      },
    });
    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.servicioSeleccionado?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarServicioBoton() {
    this.confirmationService.confirm({
      key: 'servicioLista',
      message: `¿Está seguro que desea eliminar el servicio ${this.servicioSeleccionado.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.servicioService.delete(this.servicioSeleccionado.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Servicio eliminado correctamente',
            );
            this.cargaInicial();
            this.habilitaEditarServicio = false;
            this.habilitaEliminarServicio = false;
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
    });
  }

  onRowSelect() {
    this.habilitaEditarServicio = this.authorizationService.canEditServicio();
    this.habilitaEliminarServicio =
      this.authorizationService.canDeleteServicio();
  }

  onRowUnselect() {
    this.habilitaEditarServicio = false;
    this.habilitaEliminarServicio = false;
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

    this.servicioService
      .list(query, PAGINATION_LIMITS.PAGE, 0, activo)
      .subscribe({
        next: (response) => {
          this.listaServicios = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaServicios.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaServicios.splice(idx, 1);
              this.listaServicios.unshift(item);
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
