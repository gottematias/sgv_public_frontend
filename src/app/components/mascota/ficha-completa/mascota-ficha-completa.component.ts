import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

import { MascotaService } from '../../../services/mascota.service';
import { VacunaService } from '../../../services/vacuna.service';
import { PersonaService } from '../../../services/persona.service';
import { HistorialClinicoService } from '../../../services/historial-clinico.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';

import { Mascota } from '../../../models/mascota.interfaces';
import { HistorialClinico } from '../../../models/historial-clinico.interfaces';
import { Vacuna } from '../../../models/vacuna.interfaces';
import { Persona } from '../../../models/persona.interfaces';

import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { MascotaFormComponent } from '../../mascota/formulario/mascota-form.component';
import { ClinicaFormComponent } from '../../clinica/formulario/clinica-form.component';
import { VacunaFormComponent } from '../../vacuna/formulario/vacuna-form.component';
import { PersonaFormComponent } from '../../persona/formulario/persona-form.component';

@Component({
  selector: 'app-mascota-ficha-completa',
  imports: [
    CommonModule,
    TabsModule,
    ButtonModule,
    TagModule,
    TableModule,
    CardModule,
    TooltipModule,
    MascotaFormComponent,
    PersonaFormComponent,
  ],
  providers: [DialogService],
  templateUrl: './mascota-ficha-completa.component.html',
  styleUrl: './mascota-ficha-completa.component.css',
})
export class MascotaFichaCompletaComponent implements OnInit, OnDestroy {
  @ViewChild('mascotaForm') mascotaFormComponent?: MascotaFormComponent;
  @ViewChild('personaForm') personaFormComponent?: PersonaFormComponent;

  mascotaId!: number;

  mascota: Mascota | null = null;
  vacunas: Vacuna[] = [];
  dueno: Persona | null = null;
  historiales: HistorialClinico[] = [];

  cargandoDatos = true;
  activeTabValue = 0;
  cargandoVacunas = false;
  cargandoHistoriales = false;

  private refSubDialog?: DynamicDialogRef;

  constructor(
    private readonly mascotaService: MascotaService,
    private readonly vacunaService: VacunaService,
    private readonly personaService: PersonaService,
    private readonly historialClinicoService: HistorialClinicoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    public readonly refDialog: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
  ) {}

  ngOnInit(): void {
    this.mascotaId = this.config.data?.mascotaId;

    if (!this.mascotaId) {
      this.toastNotificationService.showError(
        'No se proporcionó ID de mascota',
      );
      this.refDialog.close();
      return;
    }

    this.cargarDatosIniciales();
  }

  ngOnDestroy(): void {
    this.refSubDialog?.close();
  }

  cargarDatosIniciales(): void {
    this.cargandoDatos = true;

    this.mascotaService.get(this.mascotaId).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.mascota = response.data;

          if (this.mascota?.persona?.id) {
            this.cargarDatosDueno(this.mascota.persona.id);
          }
        }
        this.cargandoDatos = false;
      },
      error: () => {
        this.toastNotificationService.showError(
          'Error al cargar datos de mascota',
        );
        this.cargandoDatos = false;
      },
    });
  }

  cargarDatosDueno(idPersona: number): void {
    this.personaService.get(idPersona).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.dueno = response.data;
        }
      },
      error: () => {
        this.toastNotificationService.showError(
          'Error al cargar datos del dueño',
        );
      },
    });
  }

  onTabChange(value: string | number): void {
    const tabValue = typeof value === 'string' ? parseInt(value, 10) : value;
    this.activeTabValue = tabValue;

    switch (tabValue) {
      case 1: // Historial Clínico
        if (this.historiales.length === 0) {
          this.cargarHistoriales();
        }
        break;
      case 2: // Vacunación
        if (this.vacunas.length === 0) {
          this.cargarVacunas();
        }
        break;
    }
  }

  cargarHistoriales(): void {
    this.cargandoHistoriales = true;
    this.historialClinicoService
      .list({
        idMascota: this.mascotaId,
        activo: true,
      })
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            this.historiales = response.data.sort(
              (a, b) =>
                new Date(b.fechaConsulta).getTime() -
                new Date(a.fechaConsulta).getTime(),
            );
          }
          this.cargandoHistoriales = false;
        },
        error: () => {
          this.toastNotificationService.showError(
            'Error al cargar historial clínico',
          );
          this.cargandoHistoriales = false;
        },
      });
  }

  cargarVacunas(): void {
    this.cargandoVacunas = true;
    this.vacunaService
      .list({
        idMascota: this.mascotaId,
        activo: true,
      })
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            this.vacunas = response.data.sort(
              (a, b) =>
                new Date(b.fechaAplicacion).getTime() -
                new Date(a.fechaAplicacion).getTime(),
            );
          }
          this.cargandoVacunas = false;
        },
        error: () => {
          this.toastNotificationService.showError('Error al cargar vacunas');
          this.cargandoVacunas = false;
        },
      });
  }

  onMascotaGuardada(): void {
    this.toastNotificationService.showSuccess(
      'Mascota actualizada exitosamente',
    );
    this.cargarDatosIniciales();
  }

  onPersonaGuardada(): void {
    this.toastNotificationService.showSuccess('Datos del dueño actualizados');
    if (this.dueno?.id) {
      this.cargarDatosDueno(this.dueno.id);
    }
  }

  onFormularioCancelado(): void {
    // No hacer nada, mantener tab abierto
  }

  abrirNuevoHistorialClinico(): void {
    this.refSubDialog = this.dialogService.open(ClinicaFormComponent, {
      header: 'Registrar Nuevo Historial Clínico',
      width: '90vw',
      modal: true,
      maximizable: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        mascotaId: this.mascotaId,
        historialId: null,
      },
    });

    this.refSubDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Historial clínico registrado exitosamente',
        );
        this.cargarHistoriales();
      }
    });
  }

  abrirHistorialClinico(historial: HistorialClinico): void {
    this.refSubDialog = this.dialogService.open(ClinicaFormComponent, {
      header: 'Ver Historial Clínico',
      width: '90vw',
      modal: true,
      maximizable: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        mascotaId: this.mascotaId,
        historialId: historial.id,
        modoVista: true,
      },
    });

    this.refSubDialog.onClose.subscribe(() => {
      this.cargarHistoriales();
    });
  }

  abrirNuevaVacuna(): void {
    this.refSubDialog = this.dialogService.open(VacunaFormComponent, {
      header: 'Registrar Nueva Vacuna',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        vacunaId: null,
        mascotaId: this.mascotaId,
      },
    });

    this.refSubDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Vacuna registrada exitosamente',
        );
        this.cargarVacunas();
      }
    });
  }

  abrirVacuna(vacuna: Vacuna): void {
    this.refSubDialog = this.dialogService.open(VacunaFormComponent, {
      header: 'Ver Vacunación',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        vacunaId: vacuna.id,
        modoVista: true,
      },
    });

    this.refSubDialog.onClose.subscribe(() => {
      this.cargarVacunas();
    });
  }

  cancelar(): void {
    this.refDialog.close();
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatPeso(pesoGramos: number | null): string {
    if (!pesoGramos) return '-';
    return `${(pesoGramos / 1000).toFixed(2)} kg`;
  }

  getDiagnosticos(historial: HistorialClinico): string {
    return (
      historial.historialesDiagnosticos
        ?.map((hd) => hd.diagnostico.nombre)
        .join(', ') || '-'
    );
  }

  getVeterinarioNombre(historial: HistorialClinico): string {
    const persona = historial.empleadoAsignado?.usuario?.persona;
    if (!persona) {
      return '-';
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getDiagnosticosTexto(historial: HistorialClinico): string {
    if (
      !historial.historialesDiagnosticos ||
      historial.historialesDiagnosticos.length === 0
    ) {
      return '';
    }
    return historial.historialesDiagnosticos
      .map((hd) => hd.diagnostico.nombre)
      .join(', ');
  }

  getContadorAdjuntos(historial: HistorialClinico): number {
    return historial.adjuntosCount || 0;
  }

  formatFechaHora(fecha: string): string {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
