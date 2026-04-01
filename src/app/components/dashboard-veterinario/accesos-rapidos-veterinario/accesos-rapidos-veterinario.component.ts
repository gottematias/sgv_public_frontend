import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';
import { PersonaFormComponent } from '../../persona/formulario/persona-form.component';
import { MascotaFormComponent } from '../../mascota/formulario/mascota-form.component';
import { TurnoFormComponent } from '../../turno/formulario/turno-form.component';
import { VacunaFormComponent } from '../../vacuna/formulario/vacuna-form.component';
import { ClinicaFormComponent } from '../../clinica/formulario/clinica-form.component';

@Component({
  selector: 'app-accesos-rapidos-veterinario',
  imports: [CommonModule, ButtonModule, TooltipModule],
  providers: [DialogService],
  templateUrl: './accesos-rapidos-veterinario.component.html',
  styleUrl: './accesos-rapidos-veterinario.component.css',
})
export class AccesosRapidosVeterinarioComponent implements OnDestroy {
  @Input() idVeterinario: number | null = null;
  @Output() turnoCreado = new EventEmitter<void>();

  private refDialog?: DynamicDialogRef;

  constructor(
    private readonly dialogService: DialogService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  get puedeCrearPersona(): boolean {
    return this.authorizationService.canAccessPersona();
  }

  get puedeCrearMascota(): boolean {
    return this.authorizationService.canAccessMascota();
  }

  get puedeCrearTurno(): boolean {
    return this.authorizationService.canAccessTurno();
  }

  get puedeCrearVacuna(): boolean {
    return this.authorizationService.canAccessVacuna();
  }

  get puedeCrearClinica(): boolean {
    return this.authorizationService.canAccessClinica();
  }

  ngOnDestroy(): void {
    this.refDialog?.close();
  }

  abrirCrearPersona(): void {
    this.refDialog = this.dialogService.open(PersonaFormComponent, {
      header: 'Crear Nueva Persona',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        personaId: null,
      },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Persona creada exitosamente',
        );
      }
    });
  }

  abrirCrearMascota(): void {
    this.refDialog = this.dialogService.open(MascotaFormComponent, {
      header: 'Crear Nueva Mascota',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        mascotaId: null,
      },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Mascota creada exitosamente',
        );
      }
    });
  }

  abrirCrearTurno(): void {
    if (!this.idVeterinario) {
      this.toastNotificationService.showError(
        'No se pudo identificar al veterinario',
      );
      return;
    }

    this.refDialog = this.dialogService.open(TurnoFormComponent, {
      header: 'Crear Nuevo Turno',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        turnoId: null,
        idEmpleadoAsignado: this.idVeterinario,
      },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess('Turno creado exitosamente');
        this.turnoCreado.emit();
      }
    });
  }

  abrirCrearVacuna(): void {
    this.refDialog = this.dialogService.open(VacunaFormComponent, {
      header: 'Registrar Nueva Vacuna',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        vacunaId: null,
      },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Vacuna registrada exitosamente',
        );
      }
    });
  }

  abrirCrearHistorialClinico(): void {
    this.refDialog = this.dialogService.open(ClinicaFormComponent, {
      header: 'Crear Nuevo Historial Clínico',
      width: '90vw',
      modal: true,
      maximizable: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: {
        historialId: null,
      },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Historial clínico creado exitosamente',
        );
      }
    });
  }
}
