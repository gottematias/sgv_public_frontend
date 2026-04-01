import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  Optional,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StockMovimientoService } from '../../../../services/stock-movimiento.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import { AuthorizationService } from '../../../../services/authorization.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DatePickerModule } from 'primeng/datepicker';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  MovimientoStock,
  MovimientoStockTipo,
} from '../../../../models/stock.interfaces';
import { MovimientoFormComponent } from '../formulario/movimiento-form.component';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-movimiento-lista',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    TooltipModule,
    DatePickerModule,
    ConfirmDialogModule,
    SharedModule,
  ],
  providers: [DialogService],
  templateUrl: './movimiento-lista.component.html',
  styleUrls: ['./movimiento-lista.component.css'],
})
export class MovimientoListaComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  listaMovimientos!: MovimientoStock[];
  productoId!: number;
  productoNombre!: string;

  tableScrollHeight = '400px';

  tiposMovimiento: MovimientoStockTipo[] = [];
  tipoSeleccionado: MovimientoStockTipo | null = null;

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  movimientoSeleccionado: MovimientoStock | null = null;
  habilitaCrear = false;
  refDialogForm: DynamicDialogRef | null = null;

  constructor(
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly movimientoService: StockMovimientoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly dialogService: DialogService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {}

  ngOnInit(): void {
    if (this.config?.data?.productoId) {
      this.productoId = this.config.data.productoId;
    }
    if (this.config?.data?.productoNombre) {
      this.productoNombre = this.config.data.productoNombre;
    }

    this.habilitaCrear = this.authorizationService.canCreateMovimiento();
    this.cargarTiposMovimiento();
    this.cargaInicial();
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

  private cargarTiposMovimiento(): void {
    this.movimientoService.listTipos().subscribe({
      next: (response) => {
        this.tiposMovimiento = response.data;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  onTipoChange(): void {
    this.cargaInicial();
  }

  onFechaDesdeChange(): void {
    if (this.fechaDesde !== null) {
      this.fechaDesde.setHours(0, 0, 0, 0);

      // Si Fecha Hasta existe y es menor que Fecha Desde, resetear Fecha Hasta
      if (this.fechaHasta !== null && this.fechaHasta < this.fechaDesde) {
        this.fechaHasta = null;
      }
    }
    this.cargaInicial();
  }

  onFechaHastaChange(): void {
    if (this.fechaHasta !== null) {
      this.fechaHasta.setHours(23, 59, 59, 999);

      // Si Fecha Desde existe y es mayor que Fecha Hasta, resetear Fecha Desde
      if (this.fechaDesde !== null && this.fechaDesde > this.fechaHasta) {
        this.fechaDesde = null;
      }
    }
    this.cargaInicial();
  }

  limpiarFiltros(): void {
    this.tipoSeleccionado = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.cargaInicial();
  }

  isEntrada(movimiento: MovimientoStock): boolean {
    return movimiento.movimientoTipo?.factor === 1;
  }

  isSalida(movimiento: MovimientoStock): boolean {
    return movimiento.movimientoTipo?.factor === -1;
  }

  crearMovimientoBoton(): void {
    this.refDialogForm = this.dialogService.open(MovimientoFormComponent, {
      header: 'Crear nuevo Movimiento',
      width: '60vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        productoId: this.productoId,
      },
    });

    this.refDialogForm.onClose.subscribe(() => {
      this.cargaInicial();
      this.movimientoSeleccionado = null;
    });
  }

  onRowSelect(): void {
    // Selection state handled by PrimeNG table binding
  }

  onRowUnselect(): void {
    this.movimientoSeleccionado = null;
  }

  private cargaInicial(): void {
    const params: {
      limit?: number;
      offset?: number;
      idProducto?: number;
      idMovimientoTipo?: number;
      fechaDesde?: string;
      fechaHasta?: string;
    } = {
      limit: 100,
      offset: 0,
      idProducto: this.productoId,
    };

    if (this.tipoSeleccionado) {
      params.idMovimientoTipo = this.tipoSeleccionado.id;
    }

    if (this.fechaDesde) {
      params.fechaDesde = this.fechaDesde.toISOString();
    }

    if (this.fechaHasta) {
      params.fechaHasta = this.fechaHasta.toISOString();
    }

    this.movimientoService.list(params).subscribe({
      next: (response) => {
        this.listaMovimientos = response.data;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }
}
