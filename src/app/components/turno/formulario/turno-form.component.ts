import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import {
  CreateTurnoRequest,
  UpdateTurnoRequest,
  TurnoTipo,
  TurnoEstado as TurnoEstadoInterface,
  SlotDisponible,
  TurnoDisponible,
  EmpleadoAsignadoResumen,
  VetSlotGroup,
  DateSlotGroup,
} from '../../../models/turno.interfaces';
import { TurnoEstado as TurnoEstadoEnum } from '../../../constants/turno-estado.enum';
import { Mascota } from '../../../models/mascota.interfaces';
import { Empleado } from '../../../models/empleado.interfaces';
import { TurnoService } from '../../../services/turno.service';
import { MascotaService } from '../../../services/mascota.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { AuthService } from '../../../services/auth.service';
import { Rol } from '../../../constants/rol.enum';

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-turno-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    Textarea,
    InputNumberModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    AccordionModule,
    TooltipModule,
    TagModule,
    CheckboxModule,
  ],
  templateUrl: './turno-form.component.html',
  styleUrl: './turno-form.component.css',
})
export class TurnoFormComponent implements OnInit, OnDestroy {
  turnoId: number | null;
  formGroupTurno: FormGroup;
  modoEdicion: boolean;
  puedeToggleActivo = false;
  esVeterinario = false;
  veterinarioAutoAsignado = false;

  mascotas: Mascota[] = [];
  veterinarios: Empleado[] = [];
  turnoTipos: TurnoTipo[] = [];
  turnoEstados: TurnoEstadoInterface[] = [];

  slotsDisponibles: SlotDisponible[] = [];
  selectedSlot: SlotDisponible | null = null;
  selectedVeterinarioId: number | null = null;
  loadingSlots = false;
  selectedDate: Date | null = null;

  slotsDisponiblesPorVeterinario: TurnoDisponible[] = [];
  vetSlotGroups: VetSlotGroup[] = [];
  expandedAccordionIndexes: number[] = [];

  minDate: Date = new Date();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly refDialog: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly turnoService: TurnoService,
    private readonly mascotaService: MascotaService,
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
    private readonly authService: AuthService,
    private readonly httpErrorHandler: HttpErrorHandlerService,
  ) {
    this.turnoId = null;
    this.modoEdicion = false;

    this.formGroupTurno = new FormGroup({
      fechaHora: new FormControl<Date | null>(null, [Validators.required]),
      duracion: new FormControl<number>(15, [
        Validators.required,
        Validators.min(15),
        this.multipleOf15Validator.bind(this),
      ]),
      motivo: new FormControl<string>('', [
        Validators.minLength(1),
        Validators.maxLength(100),
      ]),
      notas: new FormControl<string>(''),
      idTurnoTipo: new FormControl<number | null>(null, [Validators.required]),
      idTurnoEstado: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      idEmpleadoAsignado: new FormControl<number | null>(null),
      idMascota: new FormControl<number | null>(null, [Validators.required]),
      activo: new FormControl<boolean>(true),
    });
  }

  onDateChange(fecha: Date): void {
    this.selectedDate = fecha;
    this.selectedSlot = null;
    this.slotsDisponibles = [];
    this.slotsDisponiblesPorVeterinario = [];
    this.vetSlotGroups = [];
    this.formGroupTurno.patchValue({ fechaHora: null });
    this.loadSlotsDisponibles();
  }

  onVeterinarioChange(): void {
    const idEmpleadoAsignado =
      this.formGroupTurno.get('idEmpleadoAsignado')?.value;
    if (!idEmpleadoAsignado) {
      return;
    }
  }

  loadSlotsDisponibles(): void {
    if (!this.selectedDate) {
      return;
    }

    const duracion = this.formGroupTurno.get('duracion')?.value || 15;
    const idEmpleadoAsignado =
      this.formGroupTurno.get('idEmpleadoAsignado')?.value;

    this.loadingSlots = true;

    const startOfDay = new Date(this.selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(this.selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const fechaDesdeStr = startOfDay.toISOString();
    const fechaHastaStr = endOfDay.toISOString();

    const params: {
      fechaDesde: string;
      fechaHasta: string;
      duracion: number;
      idEmpleadoAsignado?: number;
    } = {
      fechaDesde: fechaDesdeStr,
      fechaHasta: fechaHastaStr,
      duracion: duracion,
    };

    if (idEmpleadoAsignado) {
      params.idEmpleadoAsignado = idEmpleadoAsignado;
    }

    this.turnoService
      .getDisponibles(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.code === 0 && response.data) {
            this.slotsDisponiblesPorVeterinario = response.data;
            this.transformarSlots();
          } else {
            this.slotsDisponiblesPorVeterinario = [];
            this.vetSlotGroups = [];
          }
          this.loadingSlots = false;
        },
        error: () => {
          this.toastNotificationService.showError('Error al cargar horarios');
          this.slotsDisponiblesPorVeterinario = [];
          this.vetSlotGroups = [];
          this.loadingSlots = false;
        },
      });
  }

  selectSlot(
    slot: SlotDisponible,
    empleadoAsignado: EmpleadoAsignadoResumen,
  ): void {
    this.selectedSlot = slot;
    this.selectedVeterinarioId = empleadoAsignado.id;
    const fechaHora = new Date(slot.fechaHoraInicio);

    const patchData: { fechaHora: Date; idEmpleadoAsignado?: number } = {
      fechaHora,
    };
    if (!this.esVeterinario || this.modoEdicion) {
      patchData.idEmpleadoAsignado = empleadoAsignado.id;
    }
    this.formGroupTurno.patchValue(patchData);

    this.expandedAccordionIndexes = [];

    const persona = empleadoAsignado.usuario?.persona;
    if (persona && (!this.esVeterinario || this.modoEdicion)) {
      this.toastNotificationService.showInfo(
        `Veterinario ${persona.nombres} ${persona.apellidos} seleccionado automáticamente`,
      );
    }
  }

  formatSlotTime(slot: SlotDisponible): string {
    const fecha = new Date(slot.fechaHoraInicio);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  getSelectedSlotDisplay(): string {
    if (!this.selectedSlot || !this.selectedVeterinarioId) {
      return '';
    }

    const veterinarioSeleccionado = this.veterinarios.find(
      (vet) => vet.id === this.selectedVeterinarioId,
    );

    const fecha = new Date(this.selectedSlot.fechaHoraInicio);
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    const nombreVeterinario = veterinarioSeleccionado?.usuario?.persona
      ? `${veterinarioSeleccionado.usuario.persona.nombres} ${veterinarioSeleccionado.usuario.persona.apellidos}`
      : '';

    return `${horas}:${minutos} - ${dia}/${mes}/${año} - ${nombreVeterinario}`;
  }

  expandAllAccordions(): void {
    this.expandedAccordionIndexes = this.vetSlotGroups.map((_, index) => index);
  }

  private transformarSlots(): void {
    const vetSlotGroups = this.slotsDisponiblesPorVeterinario.map((vetData) => {
      const slotsPorFecha = new Map<string, SlotDisponible[]>();

      vetData.slotsDisponibles.forEach((slot) => {
        if (!slotsPorFecha.has(slot.fecha)) {
          slotsPorFecha.set(slot.fecha, []);
        }
        slotsPorFecha.get(slot.fecha)!.push(slot);
      });

      const dateGroups: DateSlotGroup[] = Array.from(
        slotsPorFecha.entries(),
      ).map(([fecha, slots]) => ({
        fecha,
        fechaDisplay: this.formatearFechaDisplay(fecha),
        slots: slots.sort((a, b) =>
          a.fechaHoraInicio.localeCompare(b.fechaHoraInicio),
        ),
      }));

      return {
        empleadoAsignado: vetData.empleadoAsignado,
        veterinarioLabel: this.getVeterinarioLabel(vetData.empleadoAsignado),
        slotsPorFecha: dateGroups,
      };
    });

    this.expandedAccordionIndexes = this.modoEdicion
      ? []
      : vetSlotGroups.map((_, index) => index);
    this.vetSlotGroups = vetSlotGroups;
  }

  private formatearFechaDisplay(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private getVeterinarioLabel(
    empleadoAsignado: EmpleadoAsignadoResumen,
  ): string {
    const persona = empleadoAsignado.usuario?.persona;
    if (persona) {
      return `${persona.nombres} ${persona.apellidos}`;
    }
    return `Empleado ID: ${empleadoAsignado.id}`;
  }

  getVetSlotCount(vet: VetSlotGroup): number {
    return vet.slotsPorFecha.reduce(
      (total, dateGroup) => total + dateGroup.slots.length,
      0,
    );
  }

  isSlotSelected(slot: SlotDisponible, veterinarioId: number): boolean {
    return (
      this.selectedSlot?.fechaHoraInicio === slot.fechaHoraInicio &&
      this.selectedVeterinarioId === veterinarioId
    );
  }

  ngOnInit(): void {
    this.turnoId = this.config.data.turnoId;
    this.modoEdicion = this.turnoId !== null;
    this.puedeToggleActivo = this.authorizationService.canToggleActivo();
    this.esVeterinario = this.authService.hasRole(Rol.VETERINARIO);

    if (!this.modoEdicion) {
      this.selectedDate = null;
      this.formGroupTurno.patchValue({ fechaHora: null });
      this.formGroupTurno.get('activo')?.disable();
    }

    this.cargarCatalogos();
    this.setupFormSubscriptions();
  }

  setupFormSubscriptions(): void {
    this.formGroupTurno
      .get('idEmpleadoAsignado')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onVeterinarioChange();
      });

    this.formGroupTurno
      .get('duracion')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedDate) {
          this.loadSlotsDisponibles();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  multipleOf15Validator(control: FormControl): Record<string, boolean> | null {
    const value = control.value;
    if (value && value % 15 !== 0) {
      return { notMultipleOf15: true };
    }
    return null;
  }

  cargarCatalogos(): void {
    forkJoin({
      mascotas: this.mascotaService.list(),
      empleados: this.empleadoService.listVeterinarios(),
      turnoTipos: this.turnoService.listTurnoTipos(),
      turnoEstados: this.turnoService.listTurnoEstados(),
    }).subscribe({
      next: (response) => {
        this.mascotas = response.mascotas.data;
        this.veterinarios = response.empleados.data;
        this.turnoTipos = response.turnoTipos.data;
        this.turnoEstados = response.turnoEstados.data;

        if (!this.modoEdicion && this.esVeterinario) {
          const usuarioId = this.authService.getAuthEstado().usuario_id;
          if (usuarioId !== null) {
            const miEmpleado = this.veterinarios.find(
              (v) => v.idUsuario === usuarioId,
            );
            if (miEmpleado) {
              this.formGroupTurno.patchValue({
                idEmpleadoAsignado: miEmpleado.id,
              });
              this.formGroupTurno.get('idEmpleadoAsignado')?.disable();
              this.veterinarioAutoAsignado = true;
            } else {
              this.toastNotificationService.showWarning(
                'No se encontró su registro de empleado. Seleccione un veterinario manualmente.',
              );
            }
          }
        }

        if (!this.modoEdicion) {
          this.formGroupTurno.patchValue({
            idTurnoEstado: TurnoEstadoEnum.PROGRAMADO,
          });
          this.formGroupTurno.get('idTurnoEstado')?.disable();
        }

        if (this.modoEdicion && this.turnoId) {
          this.cargarDatosTurno();
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  cargarDatosTurno(): void {
    if (!this.turnoId) return;

    this.turnoService.get(this.turnoId).subscribe({
      next: (response) => {
        const turno = response.data;
        const fechaHora = turno.fechaHora ? new Date(turno.fechaHora) : null;

        if (fechaHora) {
          const fecha = new Date(fechaHora);
          fecha.setHours(0, 0, 0, 0);
          this.selectedDate = fecha;
        }

        this.formGroupTurno.patchValue({
          fechaHora: fechaHora,
          duracion: turno.duracionMinutos,
          motivo: turno.motivo || '',
          notas: turno.notas || '',
          idTurnoTipo: turno.idTurnoTipo,
          idTurnoEstado: turno.idTurnoEstado,
          idEmpleadoAsignado: turno.idEmpleadoAsignado,
          idMascota: turno.idMascota,
          activo: turno.activo,
        });

        this.formGroupTurno.get('idMascota')?.disable();
        this.formGroupTurno.get('fechaHora')?.disable();
        this.formGroupTurno.get('duracion')?.disable();
        this.formGroupTurno.get('idEmpleadoAsignado')?.disable();

        if (fechaHora) {
          const fechaStr = fechaHora.toISOString().split('T')[0];

          const fechaHoraFin = new Date(fechaHora);
          fechaHoraFin.setMinutes(
            fechaHoraFin.getMinutes() + turno.duracionMinutos,
          );

          this.selectedSlot = {
            fecha: fechaStr,
            fechaHoraInicio: fechaHora.toISOString(),
            fechaHoraFin: fechaHoraFin.toISOString(),
            duracionMinutos: turno.duracionMinutos,
          };

          this.selectedVeterinarioId = turno.idEmpleadoAsignado;

          this.loadSlotsDisponibles();
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  guardar(): void {
    // Check authorization before submitting
    if (this.modoEdicion && !this.authorizationService.canEditTurno()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar turnos',
      );
      this.cancelar();
      return;
    }

    if (!this.modoEdicion && !this.authorizationService.canCreateTurno()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear turnos',
      );
      this.cancelar();
      return;
    }

    if (this.formGroupTurno.invalid) {
      this.formGroupTurno.markAllAsTouched();
      this.toastNotificationService.showError(
        'Complete todos los campos requeridos correctamente',
      );
      return;
    }

    const formValue = this.formGroupTurno.getRawValue();

    if (formValue.fechaHora) {
      const hours = formValue.fechaHora.getHours();
      const minutes = formValue.fechaHora.getMinutes();

      if (hours < 8 || hours >= 20) {
        this.toastNotificationService.showError(
          'El horario debe estar entre las 8:00 AM y las 8:00 PM',
        );
        return;
      }

      if (minutes % 15 !== 0) {
        this.toastNotificationService.showError(
          'La hora debe estar en bloques de 15 minutos (00, 15, 30, 45)',
        );
        return;
      }
    }

    const fechaHora = formValue.fechaHora
      ? new Date(formValue.fechaHora).toISOString()
      : null;

    if (this.modoEdicion && this.turnoId) {
      const updateRequest: UpdateTurnoRequest = {
        fechaHora: fechaHora || undefined,
        duracionMinutos: formValue.duracion,
        motivo: formValue.motivo || null,
        notas: formValue.notas || null,
        idTurnoTipo: formValue.idTurnoTipo,
        idTurnoEstado: formValue.idTurnoEstado,
        idEmpleadoAsignado: formValue.idEmpleadoAsignado,
        activo: formValue.activo,
      };

      this.turnoService.update(this.turnoId, updateRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Turno actualizado exitosamente',
          );
          this.refDialog.close(response);
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    } else {
      if (!fechaHora) {
        this.toastNotificationService.showError(
          'La fecha y hora son requeridas',
        );
        return;
      }

      const createRequest: CreateTurnoRequest = {
        fechaHora: fechaHora,
        duracionMinutos: formValue.duracion,
        motivo: formValue.motivo || null,
        notas: formValue.notas || null,
        idTurnoTipo: formValue.idTurnoTipo,
        idTurnoEstado: formValue.idTurnoEstado,
        idEmpleadoAsignado: formValue.idEmpleadoAsignado,
        idMascota: formValue.idMascota,
      };

      this.turnoService.create(createRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Turno creado exitosamente',
          );
          this.refDialog.close(response);
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }

  cancelar(): void {
    this.refDialog.close();
  }

  getMascotaLabel(mascota: Mascota): string {
    const persona = mascota.persona;
    if (!persona) {
      return mascota.nombre;
    }
    return `${mascota.nombre} (${persona.apellidos}, ${persona.nombres})`;
  }

  getVeterinarioDisplayLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getSelectedMascota(): Mascota | undefined {
    const idMascota = this.formGroupTurno.get('idMascota')?.value;
    if (!idMascota) return undefined;
    return this.mascotas.find((m) => m.id === idMascota);
  }

  getSelectedVeterinario(): Empleado | undefined {
    const idEmpleadoAsignado =
      this.formGroupTurno.get('idEmpleadoAsignado')?.value;
    if (!idEmpleadoAsignado) return undefined;
    return this.veterinarios.find((v) => v.id === idEmpleadoAsignado);
  }
}
