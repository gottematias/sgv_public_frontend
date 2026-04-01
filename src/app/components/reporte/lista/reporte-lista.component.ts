import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ReporteTurnosComponent } from './reporte-turnos/reporte-turnos.component';
import { ReporteHistorialesComponent } from './reporte-historiales/reporte-historiales.component';
import { ReporteProductosComponent } from './reporte-productos/reporte-productos.component';
import { ReporteGananciasComponent } from './reporte-ganancias/reporte-ganancias.component';
import { ReporteStockBajoComponent } from './reporte-stock-bajo/reporte-stock-bajo.component';

@Component({
  selector: 'app-reporte-lista',
  imports: [
    TabsModule,
    ReporteTurnosComponent,
    ReporteHistorialesComponent,
    ReporteProductosComponent,
    ReporteGananciasComponent,
    ReporteStockBajoComponent,
  ],
  templateUrl: './reporte-lista.component.html',
  styleUrls: ['./reporte-lista.component.css'],
})
export class ReporteListaComponent {
  activeTab = 0;
}
