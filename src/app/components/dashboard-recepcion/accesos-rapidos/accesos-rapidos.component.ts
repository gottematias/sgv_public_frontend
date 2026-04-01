import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { AuthorizationService } from '../../../services/authorization.service';

import { PersonaFormComponent } from '../../persona/formulario/persona-form.component';
import { MascotaFormComponent } from '../../mascota/formulario/mascota-form.component';
import { TurnoFormComponent } from '../../turno/formulario/turno-form.component';
import { VentaFormComponent } from '../../venta/formulario/venta-form.component';

@Component({
  selector: 'app-accesos-rapidos',
  imports: [CommonModule, ButtonModule, TooltipModule],
  providers: [DialogService],
  templateUrl: './accesos-rapidos.component.html',
  styleUrls: ['./accesos-rapidos.component.css'],
})
export class AccesosRapidosComponent {
  @Output() turnoCreado = new EventEmitter<void>();
  @Output() ventaCreada = new EventEmitter<void>();
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

  get puedeRegistrarVenta(): boolean {
    return this.authorizationService.canAccessVenta();
  }

  abrirCrearPersona(): void {
    this.refDialog = this.dialogService.open(PersonaFormComponent, {
      header: 'Crear Nueva Persona',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { personaId: null },
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
      data: { mascotaId: null },
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
    this.refDialog = this.dialogService.open(TurnoFormComponent, {
      header: 'Crear Nuevo Turno',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { turnoId: null },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess('Turno creado exitosamente');
        this.turnoCreado.emit();
      }
    });
  }

  abrirCrearVenta(): void {
    this.refDialog = this.dialogService.open(VentaFormComponent, {
      header: 'Registrar Nueva Venta',
      width: '90vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Venta registrada exitosamente',
        );
        this.ventaCreada.emit();
      }
    });
  }
}
