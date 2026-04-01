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
import { ProductoService } from '../../../../services/producto.service';
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
import { ProductoFormComponent } from '../formulario/producto-form.component';
import { MovimientoListaComponent } from '../../movimiento/lista/movimiento-lista.component';
import { MovimientoFormComponent } from '../../movimiento/formulario/movimiento-form.component';
import {
  Producto,
  ProductoCategoria,
} from '../../../../models/stock.interfaces';

interface FiltroActivo {
  label: string;
  value: boolean | null;
}

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-producto-lista',
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
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.css'],
})
export class ProductoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaProductos!: Producto[];
  private lastModifiedId: number | null = null;
  productoSeleccionado!: Producto;

  habilitaCrearProducto = false;
  habilitaEditarProducto = false;
  habilitaEliminarProducto = false;
  habilitaVerMovimientos = false;
  habilitaRegistrarMovimiento = false;
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

  categorias: ProductoCategoria[] = [];
  categoriaSeleccionada: ProductoCategoria | null = null;

  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  constructor(
    private readonly productoService: ProductoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly confirmationService: ConfirmationService,
    private readonly authorizationService: AuthorizationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.cargarCategorias();
    this.cargaInicial();
    this.habilitaCrearProducto = this.authorizationService.canCreateProducto();
    this.habilitaEditarProducto = false;
    this.habilitaEliminarProducto = false;
    this.habilitaRegistrarMovimiento =
      this.authorizationService.canCreateMovimiento();
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

  private cargarCategorias(): void {
    this.productoService.listCategorias().subscribe({
      next: (response) => {
        this.categorias = response.data;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  crearProductoBoton() {
    this.refDialog = this.dialogService.open(ProductoFormComponent, {
      header: 'Crear nuevo Producto',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        productoId: null,
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

  editarProductoBoton() {
    this.refDialog = this.dialogService.open(ProductoFormComponent, {
      header: 'Editar Producto',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        productoId: this.productoSeleccionado.id,
      },
    });
    this.refDialog.onClose.subscribe(() => {
      this.lastModifiedId = this.productoSeleccionado?.id ?? null;
      this.cargaInicial();
    });
  }

  eliminarProductoBoton() {
    this.confirmationService.confirm({
      key: 'productoLista',
      message: `¿Está seguro que desea eliminar el producto ${this.productoSeleccionado.nombre}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.productoService.delete(this.productoSeleccionado.id).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Producto eliminado correctamente',
            );
            this.cargaInicial();
            this.habilitaEditarProducto = false;
            this.habilitaEliminarProducto = false;
          },
          error: (error) => {
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
    });
  }

  onRowSelect() {
    this.habilitaEditarProducto = this.authorizationService.canEditProducto();
    this.habilitaEliminarProducto =
      this.authorizationService.canDeleteProducto();
    this.habilitaVerMovimientos = true;
  }

  onRowUnselect() {
    this.habilitaEditarProducto = false;
    this.habilitaEliminarProducto = false;
    this.habilitaVerMovimientos = false;
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFiltroActivoChange(): void {
    this.cargaInicial();
  }

  onCategoriaChange(): void {
    this.cargaInicial();
  }

  isStockBajo(producto: Producto): boolean {
    return (
      producto.stockMinimo !== null &&
      producto.stockActual < producto.stockMinimo
    );
  }

  verMovimientosBoton() {
    this.refDialog = this.dialogService.open(MovimientoListaComponent, {
      header: 'Historial de Movimientos',
      width: '80vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      closable: true,
      data: {
        productoId: this.productoSeleccionado.id,
        productoNombre: this.productoSeleccionado.nombre,
      },
    });
  }

  registrarMovimientoBoton() {
    this.refDialog = this.dialogService.open(MovimientoFormComponent, {
      header: 'Registrar Movimiento de Stock',
      width: '60vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        productoId: this.productoSeleccionado.id,
      },
    });
    this.refDialog.onClose.subscribe(() => {
      this.cargaInicial();
    });
  }

  private cargaInicial(): void {
    const activo = this.filtroActivoSeleccionado.value ?? undefined;
    const query = this.searchQuery.trim() || undefined;
    const idCategoria = this.categoriaSeleccionada?.id ?? undefined;

    this.productoService
      .list(query, idCategoria, PAGINATION_LIMITS.PAGE, 0, activo)
      .subscribe({
        next: (response) => {
          this.listaProductos = response.data;
          if (this.lastModifiedId != null) {
            const idx = this.listaProductos.findIndex(
              (item) => item.id === this.lastModifiedId,
            );
            if (idx > 0) {
              const [item] = this.listaProductos.splice(idx, 1);
              this.listaProductos.unshift(item);
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
