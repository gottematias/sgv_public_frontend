import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { forkJoin } from 'rxjs';
import {
  CreateVacunaRequest,
  UpdateVacunaRequest,
  VacunaTipo,
} from '../../../models/vacuna.interfaces';
import { Mascota } from '../../../models/mascota.interfaces';
import { Empleado } from '../../../models/empleado.interfaces';
import { VacunaService } from '../../../services/vacuna.service';
import { MascotaService } from '../../../services/mascota.service';
import { EmpleadoService } from '../../../services/empleado.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';

import { HttpErrorHandlerService } from '../../../services/http-error-handler.service';
@Component({
  selector: 'app-vacuna-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    Textarea,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    TooltipModule,
    CheckboxModule,
  ],
  templateUrl: './vacuna-form.component.html',
  styleUrl: './vacuna-form.component.css',
})
export class VacunaFormComponent implements OnInit {
  @Input() vacunaId: number | null = null;
  @Input() mascotaId: number | null = null;
  @Input() modoVista = false;
  @Input() modoEmbebido = false;

  @Output() vacunaGuardada = new EventEmitter<unknown>();
  @Output() formularioCancelado = new EventEmitter<void>();

  formGroupVacuna: FormGroup;
  modoEdicion: boolean;
  formEnviado = false;
  puedeToggleActivo = false;

  mascotas: Mascota[] = [];
  veterinarios: Empleado[] = [];
  vacunaTipos: VacunaTipo[] = [];

  today: Date = new Date(); // Para restricción [maxDate]

  constructor(
    @Optional() private readonly refDialog?: DynamicDialogRef,
    @Optional() private readonly config?: DynamicDialogConfig,
    private readonly vacunaService: VacunaService = null!,
    private readonly mascotaService: MascotaService = null!,
    private readonly empleadoService: EmpleadoService = null!,
    private readonly toastNotificationService: ToastNotificationService = null!,
    private readonly authorizationService: AuthorizationService = null!,
    private readonly httpErrorHandler: HttpErrorHandlerService = null!,
  ) {
    this.modoEdicion = false;

    this.formGroupVacuna = new FormGroup({
      fechaAplicacion: new FormControl<Date | null>(new Date(), [
        Validators.required,
      ]),
      fechaProximaAplicacion: new FormControl<Date | null>(null),
      lote: new FormControl<string>('', [Validators.maxLength(100)]),
      numeroSerie: new FormControl<string>('', [Validators.maxLength(100)]),
      observaciones: new FormControl<string>(''),
      idMascota: new FormControl<number | null>(null, [Validators.required]),
      idEmpleado: new FormControl<number | null>(null, [Validators.required]),
      idVacunaTipo: new FormControl<number | null>(null, [Validators.required]),
      activo: new FormControl<boolean>(true),
    });
  }

  ngOnInit(): void {
    // Priorizar inputs
    if (this.vacunaId === null && this.config?.data?.vacunaId) {
      this.vacunaId = this.config.data.vacunaId;
    }
    if (this.mascotaId === null && this.config?.data?.mascotaId) {
      this.mascotaId = this.config.data.mascotaId;
    }
    if (!this.modoVista && this.config?.data?.modoVista) {
      this.modoVista = this.config.data.modoVista;
    }

    this.modoEdicion = this.vacunaId !== null;
    this.puedeToggleActivo = this.authorizationService.canToggleActivo();

    if (!this.modoEdicion) {
      this.formGroupVacuna.get('activo')?.disable();
    }

    this.cargarCatalogos();
  }

  cargarCatalogos(): void {
    forkJoin({
      mascotas: this.mascotaService.list(),
      empleados: this.empleadoService.listVeterinarios(),
      vacunaTipos: this.vacunaService.listVacunaTipos(),
    }).subscribe({
      next: (response) => {
        this.mascotas = response.mascotas.data;
        this.veterinarios = response.empleados.data;
        this.vacunaTipos = response.vacunaTipos.data;

        // Pre-cargar mascota si viene por input
        if (this.mascotaId && !this.modoEdicion) {
          this.formGroupVacuna.patchValue({ idMascota: this.mascotaId });
        }

        if (this.modoEdicion && this.vacunaId) {
          this.cargarDatosVacuna();
        }
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  cargarDatosVacuna(): void {
    if (!this.vacunaId) return;

    this.vacunaService.get(this.vacunaId).subscribe({
      next: (response) => {
        const vacuna = response.data;

        this.formGroupVacuna.patchValue({
          fechaAplicacion: vacuna.fechaAplicacion
            ? new Date(vacuna.fechaAplicacion)
            : null,
          fechaProximaAplicacion: vacuna.fechaProximaAplicacion
            ? new Date(vacuna.fechaProximaAplicacion)
            : null,
          lote: vacuna.lote || '',
          numeroSerie: vacuna.numeroSerie || '',
          observaciones: vacuna.observaciones || '',
          activo: vacuna.activo,
          idMascota: vacuna.idMascota,
          idEmpleado: vacuna.idEmpleado,
          idVacunaTipo: vacuna.idVacunaTipo,
        });

        this.formGroupVacuna.get('idMascota')?.disable();
      },
      error: (error) => {
        this.httpErrorHandler.showErrorToast(error);
      },
    });
  }

  guardar(): void {
    this.formEnviado = true;

    // Check authorization before submitting
    if (this.modoEdicion && !this.authorizationService.canEditVacuna()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para editar vacunas',
      );
      this.cancelar();
      return;
    }

    if (!this.modoEdicion && !this.authorizationService.canCreateVacuna()) {
      this.toastNotificationService.showError(
        'No autorizado',
        'No tiene permisos para crear vacunas',
      );
      this.cancelar();
      return;
    }

    if (this.formGroupVacuna.invalid) {
      this.toastNotificationService.showError(
        'Complete todos los campos requeridos',
      );
      return;
    }

    const formValue = this.formGroupVacuna.getRawValue();

    const fechaAplicacion = formValue.fechaAplicacion
      ? new Date(formValue.fechaAplicacion).toISOString()
      : null;

    const fechaProximaAplicacion = formValue.fechaProximaAplicacion
      ? new Date(formValue.fechaProximaAplicacion).toISOString()
      : null;

    if (this.modoEdicion && this.vacunaId) {
      const updateRequest: UpdateVacunaRequest = {
        fechaAplicacion: fechaAplicacion || undefined,
        fechaProximaAplicacion: fechaProximaAplicacion,
        lote: formValue.lote || null,
        numeroSerie: formValue.numeroSerie || null,
        observaciones: formValue.observaciones || null,
        activo: formValue.activo,
        idEmpleado: formValue.idEmpleado,
        idVacunaTipo: formValue.idVacunaTipo,
      };

      this.vacunaService.update(this.vacunaId, updateRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Vacuna actualizada exitosamente',
          );

          if (this.modoEmbebido) {
            this.vacunaGuardada.emit(response);
          }

          if (this.refDialog) {
            this.refDialog.close(response);
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    } else {
      if (!fechaAplicacion) {
        this.toastNotificationService.showError(
          'La fecha de aplicación es requerida',
        );
        return;
      }

      const createRequest: CreateVacunaRequest = {
        fechaAplicacion: fechaAplicacion,
        fechaProximaAplicacion: fechaProximaAplicacion,
        lote: formValue.lote || null,
        numeroSerie: formValue.numeroSerie || null,
        observaciones: formValue.observaciones || null,
        idMascota: formValue.idMascota,
        idEmpleado: formValue.idEmpleado,
        idVacunaTipo: formValue.idVacunaTipo,
      };

      this.vacunaService.create(createRequest).subscribe({
        next: (response) => {
          this.toastNotificationService.showSuccess(
            'Vacuna registrada exitosamente',
          );

          if (this.modoEmbebido) {
            this.vacunaGuardada.emit(response);
          }

          if (this.refDialog) {
            this.refDialog.close(response);
          }
        },
        error: (error) => {
          this.httpErrorHandler.showErrorToast(error);
        },
      });
    }
  }

  cancelar(): void {
    if (this.modoEmbebido) {
      this.formularioCancelado.emit();
    }

    if (this.refDialog) {
      this.refDialog.close();
    }
  }

  getVeterinarioLabel(empleado: Empleado): string {
    const persona = empleado.usuario?.persona;
    if (!persona) {
      return `ID: ${empleado.id}`;
    }
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  agregarMesesProximaAplicacion(meses: number): void {
    const fechaBase = new Date();
    fechaBase.setMonth(fechaBase.getMonth() + meses);
    this.formGroupVacuna.patchValue({
      fechaProximaAplicacion: fechaBase,
    });
  }
}
