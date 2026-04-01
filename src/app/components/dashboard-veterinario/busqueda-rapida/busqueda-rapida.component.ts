import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { MascotaService } from '../../../services/mascota.service';
import { Mascota, PersonaMascota } from '../../../models/mascota.interfaces';
import { MascotaFichaCompletaComponent } from '../../mascota/ficha-completa/mascota-ficha-completa.component';

@Component({
  selector: 'app-busqueda-rapida',
  imports: [CommonModule, AutoCompleteModule, FormsModule],
  providers: [DialogService],
  templateUrl: './busqueda-rapida.component.html',
  styleUrl: './busqueda-rapida.component.css',
})
export class BusquedaRapidaComponent implements OnDestroy {
  @Input() idVeterinario: number | null = null;
  @Output() mascotaSeleccionada = new EventEmitter<number>();

  mascotasBuscadas: Mascota[] = [];
  mascotaSeleccionadaObj: Mascota | null = null;
  cargandoBusqueda = false;

  private refDialog?: DynamicDialogRef;

  constructor(
    private readonly dialogService: DialogService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly mascotaService: MascotaService,
  ) {}

  ngOnDestroy(): void {
    this.refDialog?.close();
  }

  buscarMascotas(event: { query: string }): void {
    const termino = event.query.trim();

    if (termino.length < 2) {
      this.mascotasBuscadas = [];
      return;
    }

    this.cargandoBusqueda = true;

    this.mascotaService.list(termino).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.mascotasBuscadas = response.data;
        } else {
          this.mascotasBuscadas = [];
        }
        this.cargandoBusqueda = false;
      },
      error: () => {
        this.toastNotificationService.showError('Error al buscar mascotas');
        this.mascotasBuscadas = [];
        this.cargandoBusqueda = false;
      },
    });
  }

  onMascotaSeleccionadaAutocomplete(event: { value: Mascota }): void {
    if (event.value && event.value.id) {
      this.abrirFichaMascota(event.value.id);
      this.mascotaSeleccionadaObj = null;
    }
  }

  getDuenoNombre(persona?: PersonaMascota): string {
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  abrirFichaMascota(mascotaId: number): void {
    this.refDialog = this.dialogService.open(MascotaFichaCompletaComponent, {
      header: 'Ficha de Mascota',
      width: '70vw',
      modal: true,
      position: 'top',
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
      data: { mascotaId },
    });

    this.refDialog.onClose.subscribe((result) => {
      if (result) {
        this.mascotaSeleccionada.emit(mascotaId);
      }
    });
  }
}
