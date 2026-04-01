import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

import { AccesosRapidosComponent } from './accesos-rapidos/accesos-rapidos.component';
import { BusquedaRapidaRecepcionComponent } from './busqueda-rapida-recepcion/busqueda-rapida-recepcion.component';
import { TurnosDiaComponent } from './turnos-dia/turnos-dia.component';
import { VacunasProximasComponent } from './vacunas-proximas/vacunas-proximas.component';

@Component({
  selector: 'app-dashboard-recepcion',
  imports: [
    CommonModule,
    DividerModule,
    AccesosRapidosComponent,
    BusquedaRapidaRecepcionComponent,
    TurnosDiaComponent,
    VacunasProximasComponent,
  ],
  templateUrl: './dashboard-recepcion.component.html',
  styleUrls: ['./dashboard-recepcion.component.css'],
})
export class DashboardRecepcionComponent {
  cargandoDatos = false;

  @ViewChild(TurnosDiaComponent) turnosDiaComponent!: TurnosDiaComponent;

  onTurnoCreado(): void {
    this.turnosDiaComponent?.cargarTurnosPorFecha();
  }

  onVentaCreada(): void {
    // No action needed; event acknowledged
  }
}
