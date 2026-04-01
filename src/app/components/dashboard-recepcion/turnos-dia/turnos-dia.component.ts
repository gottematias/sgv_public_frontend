import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TurnoService } from '../../../services/turno.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { TurnoFormComponent } from '../../turno/formulario/turno-form.component';

import {
  Turno,
  TurnoEstado,
  UpdateTurnoRequest,
} from '../../../models/turno.interfaces';
import { Persona } from '../../../models/persona.interfaces';
import { PersonaMascota } from '../../../models/mascota.interfaces';
import { Empleado } from '../../../models/empleado.interfaces';
import { TurnoEstado as TurnoEstadoEnum } from '../../../constants/turno-estado.enum';

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-turnos-dia',
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    SelectModule,
    TagModule,
    ConfirmDialogModule,
    ButtonModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './turnos-dia.component.html',
  styleUrls: ['./turnos-dia.component.css'],
})
export class TurnosDiaComponent implements OnInit, OnDestroy {
  fechaSeleccionada: Date = new Date();
  turnosDelDia: Turno[] = [];
  estadosDisponibles: TurnoEstado[] = [];
  cargandoTurnos = false;
  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL_MS = 300000;
  private refDialog?: DynamicDialogRef;

  constructor(
    private readonly turnoService: TurnoService,
    private readonly confirmationService: ConfirmationService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly dialogService: DialogService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {}

  ngOnInit(): void {
    this.cargarEstados();
    this.cargarTurnosPorFecha();

    this.refreshSubscription = interval(this.REFRESH_INTERVAL_MS).subscribe(
      () => {
        this.cargarTurnosPorFecha();
      },
    );
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
    this.refDialog?.close();
  }

  cargarEstados(): void {
    this.turnoService.listTurnoEstados().subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.estadosDisponibles = response.data;
        }
      },
      error: (error) => {
        this.toastNotificationService.showError('Error al cargar estados');
        console.error(error);
      },
    });
  }

  cargarTurnosPorFecha(): void {
    this.cargandoTurnos = true;

    const fechaInicio = new Date(this.fechaSeleccionada);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(this.fechaSeleccionada);
    fechaFin.setHours(23, 59, 59, 999);

    const params = {
      fechaDesde: fechaInicio.toISOString(),
      fechaHasta: fechaFin.toISOString(),
    };

    this.turnoService.list(params).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          const turnosFiltrados = response.data.filter(
            (turno) =>
              turno.idTurnoEstado === TurnoEstadoEnum.PROGRAMADO ||
              turno.idTurnoEstado === TurnoEstadoEnum.EN_SALA ||
              turno.idTurnoEstado === TurnoEstadoEnum.EN_CURSO,
          );
          if (this.hasTurnosChanged(turnosFiltrados)) {
            this.turnosDelDia = turnosFiltrados;
          }
        }
        this.cargandoTurnos = false;
      },
      error: (error) => {
        this.toastNotificationService.showError('Error al cargar turnos');
        this.cargandoTurnos = false;
        console.error(error);
      },
    });
  }

  onFechaChange(): void {
    this.cargarTurnosPorFecha();
  }

  refrescarTurnos(): void {
    this.cargarTurnosPorFecha();
  }

  editarTurno(turno: Turno): void {
    this.refDialog = this.dialogService.open(TurnoFormComponent, {
      header: 'Editar Turno',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { turnoId: turno.id },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.cargarTurnosPorFecha();
      }
    });
  }

  private hasTurnosChanged(nuevosTurnos: Turno[]): boolean {
    if (this.turnosDelDia.length !== nuevosTurnos.length) {
      return true;
    }

    const turnosActualesMap = new Map(
      this.turnosDelDia.map((turno) => [turno.id, turno]),
    );

    for (const turnoNuevo of nuevosTurnos) {
      const turnoActual = turnosActualesMap.get(turnoNuevo.id);

      if (!turnoActual) {
        return true;
      }

      if (
        turnoActual.idTurnoEstado !== turnoNuevo.idTurnoEstado ||
        turnoActual.fechaHora !== turnoNuevo.fechaHora ||
        turnoActual.duracionMinutos !== turnoNuevo.duracionMinutos ||
        turnoActual.motivo !== turnoNuevo.motivo ||
        turnoActual.idEmpleadoAsignado !== turnoNuevo.idEmpleadoAsignado
      ) {
        return true;
      }
    }

    return false;
  }

  cambiarEstadoTurno(turno: Turno, nuevoEstadoId: number): void {
    const idEstadoAnterior = turno.idTurnoEstado;
    const estadoAnterior = turno.turnoEstado;

    this.confirmationService.confirm({
      key: 'turnosDia',
      message: '¿Confirmar cambio de estado del turno?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const nuevoEstado = this.estadosDisponibles.find(
          (e) => e.id === nuevoEstadoId,
        );
        if (nuevoEstado) {
          turno.turnoEstado = nuevoEstado;
        }

        const updateRequest: UpdateTurnoRequest = {
          fechaHora: turno.fechaHora,
          duracionMinutos: turno.duracionMinutos,
          motivo: turno.motivo,
          notas: turno.notas,
          idTurnoTipo: turno.idTurnoTipo,
          idTurnoEstado: nuevoEstadoId,
          idEmpleadoAsignado: turno.idEmpleadoAsignado,
          idMascota: turno.idMascota,
          activo: turno.activo,
        };

        this.turnoService.update(turno.id, updateRequest).subscribe({
          next: () => {
            this.toastNotificationService.showSuccess(
              'Estado actualizado correctamente',
            );
          },
          error: (error) => {
            turno.idTurnoEstado = idEstadoAnterior;
            turno.turnoEstado = estadoAnterior;
            this.httpErrorHandler.showErrorToast(error);
          },
        });
      },
      reject: () => {
        turno.idTurnoEstado = idEstadoAnterior;
      },
    });
  }

  formatHora(fechaHora: string): string {
    if (!fechaHora) return '-';
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  getDuenoNombre(persona?: Persona | PersonaMascota): string {
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getVeterinarioNombre(empleado?: Empleado): string {
    if (!empleado?.usuario?.persona) return '-';
    const persona = empleado.usuario.persona;
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getEstadoSeverity(estadoNombre?: string): string {
    if (!estadoNombre) return 'secondary';

    const nombre = estadoNombre.toLowerCase();

    if (nombre.includes('completado')) return 'success';
    if (nombre.includes('en curso') || nombre.includes('en sala'))
      return 'info';
    if (nombre.includes('programado')) return 'warning';
    if (
      nombre.includes('cancelado') ||
      nombre.includes('no asistio') ||
      nombre.includes('no asistió')
    )
      return 'danger';
    if (nombre.includes('reprogramado')) return 'secondary';

    return 'secondary';
  }
}
