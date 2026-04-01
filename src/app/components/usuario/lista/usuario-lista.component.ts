import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
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
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UsuarioFormComponent } from '../formulario/usuario-form.component';
import { Usuario } from '../../../models/usuario.interfaces';
import { CommonModule } from '@angular/common';
import { PAGINATION_LIMITS } from '../../../constants/pagination.constant';
import { HttpErrorResponse } from '@angular/common/http';

interface FiltroActivo {
  label: string;
  value: boolean;
}

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-usuario-lista',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconField,
    InputIcon,
    ConfirmDialogModule,
    SelectModule,
    TooltipModule,
    FormsModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css'],
})
export class UsuarioListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaUsuarios!: Usuario[];
  private lastModifiedId: number | null = null;
  usuarioSeleccionado!: Usuario;

  habilitaCrearUsuario = false;
  habilitaEditarUsuario = false;
  habilitaEliminarUsuario = false;
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
    private readonly usuarioService: UsuarioService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargaInicial();
    this.habilitaCrearUsuario = this.authorizationService.canCreateUsuario();
    this.habilitaEditarUsuario = false;
    this.habilitaEliminarUsuario = false;
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

  crearUsuarioBoton() {
    this.refDialog = this.dialogService.open(UsuarioFormComponent, {
      header: 'Crear nuevo Usuario',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        usuarioId: null,
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

  editarUsuarioBoton() {
    this.refDialog = this.dialogService.open(UsuarioFormComponent, {
      header: 'Editar Usuario',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        usuarioId: this.usuarioSeleccionado.id,
      },
    });
    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.usuarioSeleccionado?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarUsuarioBoton() {
    this.confirmationService.confirm({
      key: 'usuarioLista',
      message: `¿Está seguro que desea eliminar a ${this.usuarioSeleccionado.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.usuarioService.delete(this.usuarioSeleccionado.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Usuario eliminado correctamente',
            );
            this.cargaInicial();
            this.habilitaEditarUsuario = false;
            this.habilitaEliminarUsuario = false;
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 403) {
              this.toastNotificationService.showError(
                'No se puede eliminar este usuario protegido',
              );
            } else {
              this.toastNotificationService.showError(
                'Error al eliminar usuario',
                error.message,
              );
            }
          },
        });
      },
    });
  }

  onRowSelect() {
    this.habilitaEditarUsuario = this.authorizationService.canEditUsuario();
    this.habilitaEliminarUsuario = this.authorizationService.canDeleteUsuario();
  }

  onRowUnselect() {
    this.habilitaEditarUsuario = false;
    this.habilitaEliminarUsuario = false;
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  private cargaInicial() {
    const activo = this.filtroActivoSeleccionado.value ?? undefined;
    const query = this.searchQuery.trim() || undefined;

    this.usuarioService
      .list(query, PAGINATION_LIMITS.CATALOG, 0, activo)
      .subscribe({
        next: (response) => {
          this.listaUsuarios = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaUsuarios.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaUsuarios.splice(idx, 1);
              this.listaUsuarios.unshift(item);
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
