import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReporteService } from '../../../../services/reporte.service';
import { EmpleadoService } from '../../../../services/empleado.service';
import { MascotaService } from '../../../../services/mascota.service';
import { ToastNotificationService } from '../../../../services/toast-notification.service';
import type { ReporteHistorialItem } from '../../../../models/reporte.interfaces';
import type { Empleado } from '../../../../models/empleado.interfaces';
import type { Mascota } from '../../../../models/mascota.interfaces';

import { HttpErrorHandlerService } from '../../../../services/http-error-handler.service';
@Component({
  selector: 'app-reporte-historiales',
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
  templateUrl: './reporte-historiales.component.html',
  styleUrls: ['./reporte-historiales.component.css'],
})
export class ReporteHistorialesComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  tableScrollHeight = '400px';
  veterinarios: Empleado[] = [];
  mascotas: Mascota[] = [];
  listaHistoriales: ReporteHistorialItem[] = [];
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;
  idEmpleado: number | null = null;
  idMascota: number | null = null;
  isLoading = false;
  hasQueried = false;

  constructor(
    private readonly reporteService: ReporteService,
    private readonly empleadoService: EmpleadoService,
    private readonly mascotaService: MascotaService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      empleados: this.empleadoService.listVeterinarios(),
      mascotas: this.mascotaService.list(),
    }).subscribe({
      next: (response) => {
        this.veterinarios = response.empleados.data;
        this.mascotas = response.mascotas.data;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

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
      idEmpleado?: number;
      idMascota?: number;
    } = {};

    if (this.fechaDesde) {
      params.fechaDesde = this.formatDateParam(this.fechaDesde);
    }
    if (this.fechaHasta) {
      params.fechaHasta = this.formatDateParam(this.fechaHasta);
    }
    if (this.idEmpleado !== null) {
      params.idEmpleado = this.idEmpleado;
    }
    if (this.idMascota !== null) {
      params.idMascota = this.idMascota;
    }

    this.reporteService.getHistorialesClinicos(params).subscribe({
      next: (response) => {
        this.listaHistoriales = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
        this.isLoading = false;
      },
    });
  }

  exportar(formato: 'xlsx' | 'csv'): void {
    const params: Record<string, string> = {};
    if (this.fechaDesde) {
      params['fechaDesde'] = this.formatDateParam(this.fechaDesde);
    }
    if (this.fechaHasta) {
      params['fechaHasta'] = this.formatDateParam(this.fechaHasta);
    }
    if (this.idEmpleado !== null) {
      params['idEmpleado'] = this.idEmpleado.toString();
    }
    if (this.idMascota !== null) {
      params['idMascota'] = this.idMascota.toString();
    }

    this.reporteService
      .exportar('historiales-clinicos', formato, params)
      .subscribe({
        next: (blob) =>
          this.descargarArchivo(blob, `reporte_historiales-clinicos`, formato),
        error: () =>
          this.toastNotificationService.showError(
            'Error al exportar el reporte',
          ),
      });
  }

  getVeterinarioLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  formatFecha(fechaStr: string): string {
    if (!fechaStr) return '-';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
