import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReporteService } from '../../../../services/reporte.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import type {
  ReporteGananciasDetalle,
  ReporteGananciasResumen,
} from '../../../../models/reporte.interfaces';

interface AgruparPorOpcion {
  label: string;
  value: 'dia' | 'mes' | 'anio';
}

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-reporte-ganancias',
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    TableModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './reporte-ganancias.component.html',
  styleUrls: ['./reporte-ganancias.component.css'],
})
export class ReporteGananciasComponent implements AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  tableScrollHeight = '400px';
  listaGananciasDetalle: ReporteGananciasDetalle[] = [];
  gananciasResumen: ReporteGananciasResumen | null = null;
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  agruparPor: 'dia' | 'mes' | 'anio' = 'mes';
  isLoading = false;
  hasQueried = false;
  agruparPorOpciones: AgruparPorOpcion[] = [
    { label: 'Por Día', value: 'dia' },
    { label: 'Por Mes', value: 'mes' },
    { label: 'Por Año', value: 'anio' },
  ];

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

  onFechaDesdeChange(): void {
    if (this.fechaDesde !== null) {
      this.fechaDesde.setHours(0, 0, 0, 0);
      if (this.fechaHasta !== null && this.fechaHasta < this.fechaDesde) {
        this.fechaHasta = null;
      }
    }
  }

  onFechaHastaChange(): void {
    if (this.fechaHasta !== null) {
      this.fechaHasta.setHours(23, 59, 59, 999);
      if (this.fechaDesde !== null && this.fechaDesde > this.fechaHasta) {
        this.fechaDesde = null;
      }
    }
  }

  generarReporte(): void {
    this.isLoading = true;
    this.hasQueried = true;

    const params: {
      fechaDesde?: string;
      fechaHasta?: string;
      agruparPor?: 'dia' | 'mes' | 'anio';
    } = {
      agruparPor: this.agruparPor,
    };

    if (this.fechaDesde) {
      params.fechaDesde = this.formatDateParam(this.fechaDesde);
    }
    if (this.fechaHasta) {
      params.fechaHasta = this.formatDateParam(this.fechaHasta);
    }

    this.reporteService.getGanancias(params).subscribe({
      next: (response) => {
        this.gananciasResumen = response.data.resumen;
        this.listaGananciasDetalle = response.data.detalle;
        this.isLoading = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
        this.isLoading = false;
      },
    });
  }

  exportar(formato: 'xlsx' | 'csv'): void {
    const params: Record<string, string> = {
      agruparPor: this.agruparPor,
    };
    if (this.fechaDesde) {
      params['fechaDesde'] = this.formatDateParam(this.fechaDesde);
    }
    if (this.fechaHasta) {
      params['fechaHasta'] = this.formatDateParam(this.fechaHasta);
    }

    this.reporteService.exportar('ganancias', formato, params).subscribe({
      next: (blob) => this.descargarArchivo(blob, `reporte_ganancias`, formato),
      error: () =>
        this.toastNotificationService.showError('Error al exportar el reporte'),
    });
  }

  private formatDateParam(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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
