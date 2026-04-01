import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { PersonaService } from '../../../services/persona.service';
import { MascotaService } from '../../../services/mascota.service';
import { Persona } from '../../../models/persona.interfaces';
import { Mascota, PersonaMascota } from '../../../models/mascota.interfaces';
import { PersonaFormComponent } from '../../persona/formulario/persona-form.component';
import { MascotaFormComponent } from '../../mascota/formulario/mascota-form.component';

@Component({
  selector: 'app-busqueda-rapida-recepcion',
  imports: [CommonModule, AutoCompleteModule, FormsModule],
  providers: [DialogService],
  templateUrl: './busqueda-rapida-recepcion.component.html',
  styleUrl: './busqueda-rapida-recepcion.component.css',
})
export class BusquedaRapidaRecepcionComponent implements OnDestroy {
  personasBuscadas: Persona[] = [];
  personaSeleccionadaObj: Persona | null = null;
  cargandoBusquedaPersona = false;

  mascotasBuscadas: Mascota[] = [];
  mascotaSeleccionadaObj: Mascota | null = null;
  cargandoBusquedaMascota = false;

  private refDialog?: DynamicDialogRef;

  constructor(
    private readonly dialogService: DialogService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly personaService: PersonaService,
    private readonly mascotaService: MascotaService,
  ) {}

  ngOnDestroy(): void {
    this.refDialog?.close();
  }

  buscarPersonas(event: { query: string }): void {
    const termino = event.query.trim();
    if (termino.length < 2) {
      this.personasBuscadas = [];
      return;
    }

    this.cargandoBusquedaPersona = true;
    this.personaService.list(termino).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.personasBuscadas = response.data;
        } else {
          this.personasBuscadas = [];
        }
        this.cargandoBusquedaPersona = false;
      },
      error: () => {
        this.toastNotificationService.showError('Error al buscar personas');
        this.personasBuscadas = [];
        this.cargandoBusquedaPersona = false;
      },
    });
  }

  onPersonaSeleccionadaAutocomplete(event: { value: Persona }): void {
    if (event.value && event.value.id) {
      this.abrirEditarPersona(event.value.id);
      this.personaSeleccionadaObj = null;
    }
  }

  buscarMascotas(event: { query: string }): void {
    const termino = event.query.trim();
    if (termino.length < 2) {
      this.mascotasBuscadas = [];
      return;
    }

    this.cargandoBusquedaMascota = true;
    this.mascotaService.list(termino).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.mascotasBuscadas = response.data;
        } else {
          this.mascotasBuscadas = [];
        }
        this.cargandoBusquedaMascota = false;
      },
      error: () => {
        this.toastNotificationService.showError('Error al buscar mascotas');
        this.mascotasBuscadas = [];
        this.cargandoBusquedaMascota = false;
      },
    });
  }

  onMascotaSeleccionadaAutocomplete(event: { value: Mascota }): void {
    if (event.value && event.value.id) {
      this.abrirEditarMascota(event.value.id);
      this.mascotaSeleccionadaObj = null;
    }
  }

  getDuenoNombre(persona?: PersonaMascota): string {
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  abrirEditarPersona(personaId: number): void {
    this.refDialog = this.dialogService.open(PersonaFormComponent, {
      header: 'Editar Persona',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { personaId },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Persona actualizada exitosamente',
        );
      }
    });
  }

  abrirEditarMascota(mascotaId: number): void {
    this.refDialog = this.dialogService.open(MascotaFormComponent, {
      header: 'Editar Mascota',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      data: { mascotaId },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.toastNotificationService.showSuccess(
          'Mascota actualizada exitosamente',
        );
      }
    });
  }
}
