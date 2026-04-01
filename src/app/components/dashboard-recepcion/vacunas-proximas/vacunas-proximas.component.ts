import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { VacunaService } from '../../../services/vacuna.service';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { Vacuna } from '../../../models/vacuna.interfaces';
import { Persona } from '../../../models/persona.interfaces';
import { PersonaMascota } from '../../../models/mascota.interfaces';

@Component({
  selector: 'app-vacunas-proximas',
  imports: [CommonModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './vacunas-proximas.component.html',
  styleUrls: ['./vacunas-proximas.component.css'],
})
export class VacunasProximasComponent implements OnInit, OnDestroy {
  vacunasProximas: Vacuna[] = [];
  cargandoVacunas = false;
  private refreshSubscription?: Subscription;
  private readonly REFRESH_INTERVAL_MS = 300000;

  constructor(
    private readonly vacunaService: VacunaService,
    private readonly toastNotificationService: ToastNotificationService,
  ) {}

  ngOnInit(): void {
    this.cargarVacunasProximas();

    this.refreshSubscription = interval(this.REFRESH_INTERVAL_MS).subscribe(
      () => {
        this.cargarVacunasProximas();
      },
    );
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  cargarVacunasProximas(): void {
    this.cargandoVacunas = true;

    const fechaDesde = new Date();
    fechaDesde.setHours(0, 0, 0, 0);

    const fechaHasta = new Date();
    fechaHasta.setDate(fechaHasta.getDate() + 30);
    fechaHasta.setHours(23, 59, 59, 999);

    const params = {
      fechaDesdeProximaAplicacion: fechaDesde.toISOString(),
      fechaHastaProximaAplicacion: fechaHasta.toISOString(),
      activo: true,
    };

    this.vacunaService.list(params).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          // Ordenar por fecha próxima de aplicación (más próximas primero)
          const vacunasOrdenadas = response.data.sort((a, b) => {
            const fechaA = new Date(a.fechaProximaAplicacion!).getTime();
            const fechaB = new Date(b.fechaProximaAplicacion!).getTime();
            return fechaA - fechaB;
          });

          if (this.haVacunasChanged(vacunasOrdenadas)) {
            this.vacunasProximas = vacunasOrdenadas;
          }
        }
        this.cargandoVacunas = false;
      },
      error: (error) => {
        this.toastNotificationService.showError(
          'Error al cargar vacunas próximas',
        );
        this.cargandoVacunas = false;
        console.error(error);
      },
    });
  }

  refrescarVacunas(): void {
    this.cargarVacunasProximas();
  }

  private haVacunasChanged(nuevasVacunas: Vacuna[]): boolean {
    if (this.vacunasProximas.length !== nuevasVacunas.length) {
      return true;
    }

    const vacunasActualesMap = new Map(
      this.vacunasProximas.map((vacuna) => [vacuna.id, vacuna]),
    );

    for (const vacunaNueva of nuevasVacunas) {
      const vacunaActual = vacunasActualesMap.get(vacunaNueva.id);

      if (!vacunaActual) {
        return true;
      }

      if (
        vacunaActual.fechaProximaAplicacion !==
          vacunaNueva.fechaProximaAplicacion ||
        vacunaActual.idVacunaTipo !== vacunaNueva.idVacunaTipo ||
        vacunaActual.idMascota !== vacunaNueva.idMascota
      ) {
        return true;
      }
    }

    return false;
  }

  formatFecha(fechaHora: string): string {
    if (!fechaHora) return '-';
    const date = new Date(fechaHora);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getDuenoNombre(persona?: Persona | PersonaMascota): string {
    if (!persona) return '-';
    return `${persona.apellidos}, ${persona.nombres}`;
  }

  getDiasRestantes(fechaProxima: string): number {
    if (!fechaProxima) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(fechaProxima);
    fecha.setHours(0, 0, 0, 0);
    const diffTime = fecha.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getDiasRestantesSeverity(dias: number): string {
    if (dias <= 7) return 'danger';
    if (dias <= 15) return 'warn';
    return 'success';
  }

  getDiasRestantesTexto(dias: number): string {
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Mañana';
    if (dias < 0) return `Vencida hace ${Math.abs(dias)} días`;
    return `En ${dias} días`;
  }
}
