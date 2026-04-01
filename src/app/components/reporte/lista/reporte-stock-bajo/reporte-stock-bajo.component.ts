import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ReporteService } from '../../../../services/reporte.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import type { ReporteStockBajoItem } from '../../../../models/reporte.interfaces';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-reporte-stock-bajo',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    TagModule,
  ],
  templateUrl: './reporte-stock-bajo.component.html',
  styleUrls: ['./reporte-stock-bajo.component.css'],
})
export class ReporteStockBajoComponent implements AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  tableScrollHeight = '400px';
  listaStockBajo: ReporteStockBajoItem[] = [];
  isLoading = false;
  hasQueried = false;

  constructor(
    private readonly reporteService: ReporteService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

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

  generarReporte(): void {
    this.isLoading = true;
    this.hasQueried = true;

    this.reporteService.getStockBajo().subscribe({
      next: (response) => {
        this.listaStockBajo = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
        this.isLoading = false;
      },
    });
  }

  exportar(formato: 'xlsx' | 'csv'): void {
    this.reporteService.exportar('stock-bajo', formato).subscribe({
      next: (blob) =>
        this.descargarArchivo(blob, `reporte_stock-bajo`, formato),
      error: () =>
        this.toastNotificationService.showError('Error al exportar el reporte'),
    });
  }

  getStockEstadoSeverity(
    estado: string,
  ): 'danger' | 'warn' | 'success' | 'secondary' {
    if (estado === 'SIN_STOCK') return 'danger';
    if (estado === 'STOCK_BAJO') return 'warn';
    return 'success';
  }

  getStockEstadoLabel(estado: string): string {
    if (estado === 'SIN_STOCK') return 'Sin Stock';
    if (estado === 'STOCK_BAJO') return 'Stock Bajo';
    return estado;
  }

  private descargarArchivo(
    blob: Blob,
    nombre: string,
    formato: 'xlsx' | 'csv',
  ): void {
    const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombre}_${fecha}.${formato}`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
