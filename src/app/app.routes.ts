import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Rol } from './constants/rol.enum';
import { PersonaListaComponent } from './components/persona/lista/persona-lista.component';
import { UsuarioListaComponent } from './components/usuario/lista/usuario-lista.component';
import { EmpleadoListaComponent } from './components/empleado/lista/empleado-lista.component';
import { MascotaListaComponent } from './components/mascota/lista/mascota-lista.component';
import { ClinicaListaComponent } from './components/clinica/lista/clinica-lista.component';
import { VacunaListaComponent } from './components/vacuna/lista/vacuna-lista.component';
import { TurnoListaComponent } from './components/turno/lista/turno-lista.component';
import { DashboardRecepcionComponent } from './components/dashboard-recepcion/dashboard-recepcion.component';
import { DashboardVeterinarioComponent } from './components/dashboard-veterinario/dashboard-veterinario.component';
import { ProductoListaComponent } from './components/stock/producto/lista/producto-lista.component';
import { ServicioListaComponent } from './components/stock/servicio/lista/servicio-lista.component';
import { VentaListaComponent } from './components/venta/lista/venta-lista.component';
import { ReporteListaComponent } from './components/reporte/lista/reporte-lista.component';
import { BackupComponent } from './components/backup/backup.component';
import { AyudaComponent } from './components/ayuda/ayuda.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard-recepcion',
    component: DashboardRecepcionComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.RECEPCIONISTA, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'dashboard-veterinario',
    component: DashboardVeterinarioComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.VETERINARIO, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'persona/lista',
    component: PersonaListaComponent,
    canActivate: [
      authGuard,
      roleGuard([
        Rol.VETERINARIO,
        Rol.RECEPCIONISTA,
        Rol.ADMINISTRADOR_SISTEMA,
      ]),
    ],
  },
  {
    path: 'usuario/lista',
    component: UsuarioListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.ADMINISTRADOR, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'empleado/lista',
    component: EmpleadoListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.ADMINISTRADOR, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'mascota/lista',
    component: MascotaListaComponent,
    canActivate: [
      authGuard,
      roleGuard([
        Rol.VETERINARIO,
        Rol.RECEPCIONISTA,
        Rol.ADMINISTRADOR_SISTEMA,
      ]),
    ],
  },
  {
    path: 'clinica/lista',
    component: ClinicaListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.VETERINARIO, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'vacuna/lista',
    component: VacunaListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.VETERINARIO, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'turno/lista',
    component: TurnoListaComponent,
    canActivate: [
      authGuard,
      roleGuard([
        Rol.VETERINARIO,
        Rol.RECEPCIONISTA,
        Rol.ADMINISTRADOR_SISTEMA,
      ]),
    ],
  },
  {
    path: 'stock/producto/lista',
    component: ProductoListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.GESTOR_INVENTARIO, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'stock/servicio/lista',
    component: ServicioListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.GESTOR_INVENTARIO, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'venta/lista',
    component: VentaListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.CAJERO, Rol.ADMINISTRADOR, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'reporte/lista',
    component: ReporteListaComponent,
    canActivate: [
      authGuard,
      roleGuard([Rol.ADMINISTRADOR, Rol.ADMINISTRADOR_SISTEMA]),
    ],
  },
  {
    path: 'backup',
    component: BackupComponent,
    canActivate: [authGuard, roleGuard([Rol.ADMINISTRADOR_SISTEMA])],
  },
  {
    path: 'ayuda',
    component: AyudaComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
