import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { EmpleadoService } from '../../services/empleado.service';
import { ToastNotificationService } from '../../services/toast-notification.service';
import { Keys } from '../../constants/keys.enum';
import { AccesosRapidosVeterinarioComponent } from './accesos-rapidos-veterinario/accesos-rapidos-veterinario.component';
import { BusquedaRapidaComponent } from './busqueda-rapida/busqueda-rapida.component';
import { TurnosVeterinarioComponent } from './turnos-veterinario/turnos-veterinario.component';
import { VacunasVeterinarioComponent } from './vacunas-veterinario/vacunas-veterinario.component';

@Component({
  selector: 'app-dashboard-veterinario',
  imports: [
    CommonModule,
    DividerModule,
    AccesosRapidosVeterinarioComponent,
    BusquedaRapidaComponent,
    TurnosVeterinarioComponent,
    VacunasVeterinarioComponent,
  ],
  templateUrl: './dashboard-veterinario.component.html',
  styleUrls: ['./dashboard-veterinario.component.css'],
})
export class DashboardVeterinarioComponent implements OnInit {
  idEmpleado: number | null = null;
  cargandoDatos = true;

  @ViewChild(TurnosVeterinarioComponent)
  turnosComponent!: TurnosVeterinarioComponent;

  @ViewChild(BusquedaRapidaComponent)
  busquedaComponent?: BusquedaRapidaComponent;

  @ViewChild(VacunasVeterinarioComponent)
  vacunasComponent?: VacunasVeterinarioComponent;

  constructor(
    private readonly empleadoService: EmpleadoService,
    private readonly toastNotificationService: ToastNotificationService,
  ) {}

  ngOnInit(): void {
    this.cargarDatosVeterinario();
  }

  cargarDatosVeterinario(): void {
    const usuarioIdStr = localStorage.getItem(Keys.USUARIO_ID);

    if (!usuarioIdStr) {
      this.toastNotificationService.showError(
        'No se pudo identificar al usuario',
      );
      this.cargandoDatos = false;
      return;
    }

    const usuarioId = parseInt(usuarioIdStr, 10);

    this.empleadoService.getEmpleado(usuarioId).subscribe({
      next: (response) => {
        if (response.code === 0 && response.data) {
          this.idEmpleado = response.data.id;
          this.cargandoDatos = false;
        } else {
          this.toastNotificationService.showError(
            'No se encontraron datos del empleado',
          );
          this.cargandoDatos = false;
        }
      },
      error: () => {
        this.toastNotificationService.showError(
          'Error al cargar datos del veterinario',
        );
        this.cargandoDatos = false;
      },
    });
  }

  onTurnoCreado(): void {
    // Recargar lista de turnos
    this.turnosComponent?.refrescarTurnos();
  }
}
