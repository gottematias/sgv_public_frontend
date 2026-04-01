import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthorizationService } from '../../services/authorization.service';
import { Subscription } from 'rxjs';
import { AuthEstado } from '../../models/auth.model';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';

@Component({
  selector: 'app-menubar',
  imports: [
    CommonModule,
    MenubarModule,
    RippleModule,
    AvatarModule,
    Menu,
    ButtonModule,
    TooltipModule,
  ],
  providers: [DialogService],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css'],
})
export class MenubarComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') userMenu!: Menu;

  items: MenuItem[] | undefined;
  userMenuItems: MenuItem[] = [];
  private authSubscription?: Subscription;
  usuarioNombreCompleto = '';
  usuarioNombre = 'Usuario';
  usuarioIniciales = 'U';
  isAuthenticated = false;
  refDialog?: DynamicDialogRef;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly authorizationService: AuthorizationService,
    private readonly dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.authEstado$.subscribe(
      (authEstado) => {
        this.updateUserData(authEstado);
      },
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private updateUserData(authEstado: AuthEstado): void {
    this.isAuthenticated = authEstado.autenticado;

    if (authEstado.autenticado) {
      this.usuarioNombre = authEstado.usuario_nombre ?? 'Usuario';

      if (authEstado.persona_apellidos && authEstado.persona_nombres) {
        this.usuarioNombreCompleto = `${authEstado.persona_apellidos} ${authEstado.persona_nombres}`;
      } else if (authEstado.usuario_nombre) {
        this.usuarioNombreCompleto = authEstado.usuario_nombre;
      } else {
        this.usuarioNombreCompleto = 'Usuario';
      }

      this.usuarioIniciales = this.usuarioNombre.charAt(0).toUpperCase();

      this.items = this.buildMenuItems();
      this.userMenuItems = this.buildUserMenuItems();
    } else {
      this.usuarioNombre = 'Usuario';
      this.usuarioNombreCompleto = '';
      this.usuarioIniciales = 'U';
      this.items = [];
      this.userMenuItems = [];
    }
  }

  private buildMenuItems(): MenuItem[] {
    const items: MenuItem[] = [];

    const dashboardItems: MenuItem[] = [];
    if (this.authorizationService.canAccessDashboardRecepcion()) {
      dashboardItems.push({
        label: 'Recepción',
        icon: 'pi pi-desktop',
        command: () => this.router.navigate(['/dashboard-recepcion']),
      });
    }
    if (this.authorizationService.canAccessDashboardVeterinario()) {
      dashboardItems.push({
        label: 'Veterinario',
        icon: 'pi pi-user-plus',
        command: () => this.router.navigate(['/dashboard-veterinario']),
      });
    }
    if (dashboardItems.length > 0) {
      items.push({
        label: 'Dashboard',
        icon: 'pi pi-home',
        items: dashboardItems,
      });
    }

    const personasItems: MenuItem[] = [];
    if (this.authorizationService.canAccessPersona()) {
      personasItems.push({
        label: 'Personas',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/persona/lista']),
      });
    }
    if (this.authorizationService.canAccessUsuario()) {
      personasItems.push({
        label: 'Usuarios',
        icon: 'pi pi-id-card',
        command: () => this.router.navigate(['/usuario/lista']),
      });
    }
    if (this.authorizationService.canAccessEmpleado()) {
      personasItems.push({
        label: 'Empleados',
        icon: 'pi pi-briefcase',
        command: () => this.router.navigate(['/empleado/lista']),
      });
    }
    if (personasItems.length > 0) {
      items.push({
        label: 'Gestión de Personas',
        icon: 'pi pi-users',
        items: personasItems,
      });
    }

    const clinicaItems: MenuItem[] = [];
    if (this.authorizationService.canAccessMascota()) {
      clinicaItems.push({
        label: 'Mascotas',
        icon: 'pi pi-github',
        command: () => this.router.navigate(['/mascota/lista']),
      });
    }
    if (this.authorizationService.canAccessClinica()) {
      clinicaItems.push({
        label: 'Clínicas',
        icon: 'pi pi-building',
        command: () => this.router.navigate(['/clinica/lista']),
      });
    }
    if (this.authorizationService.canAccessVacuna()) {
      clinicaItems.push({
        label: 'Vacunas',
        icon: 'pi pi-shield',
        command: () => this.router.navigate(['/vacuna/lista']),
      });
    }
    if (this.authorizationService.canAccessTurno()) {
      clinicaItems.push({
        label: 'Turnos',
        icon: 'pi pi-calendar',
        command: () => this.router.navigate(['/turno/lista']),
      });
    }
    if (clinicaItems.length > 0) {
      items.push({
        label: 'Gestión Clínica',
        icon: 'pi pi-heart',
        items: clinicaItems,
      });
    }

    const stockItems: MenuItem[] = [];
    if (this.authorizationService.canAccessProducto()) {
      stockItems.push({
        label: 'Productos',
        icon: 'pi pi-shopping-bag',
        command: () => this.router.navigate(['/stock/producto/lista']),
      });
    }
    if (this.authorizationService.canAccessServicio()) {
      stockItems.push({
        label: 'Servicios',
        icon: 'pi pi-wrench',
        command: () => this.router.navigate(['/stock/servicio/lista']),
      });
    }
    if (stockItems.length > 0) {
      items.push({ label: 'Stock', icon: 'pi pi-box', items: stockItems });
    }

    if (this.authorizationService.canAccessVenta()) {
      items.push({
        label: 'Ventas',
        icon: 'pi pi-shopping-cart',
        items: [
          {
            label: 'Ventas',
            icon: 'pi pi-dollar',
            command: () => this.router.navigate(['/venta/lista']),
          },
        ],
      });
    }

    if (this.authorizationService.canAccessReporte()) {
      items.push({
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        items: [
          {
            label: 'Reportes',
            icon: 'pi pi-file-pdf',
            command: () => this.router.navigate(['/reporte/lista']),
          },
        ],
      });
    }

    if (this.authorizationService.canAccessBackup()) {
      items.push({
        label: 'Sistema',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Backup',
            icon: 'pi pi-download',
            command: () => this.router.navigate(['/backup']),
          },
        ],
      });
    }

    items.push({
      label: 'Ayuda',
      icon: 'pi pi-question-circle',
      command: () => this.router.navigate(['/ayuda']),
    });

    return items;
  }

  private buildUserMenuItems(): MenuItem[] {
    return [
      {
        label: 'Cambiar Contraseña',
        icon: 'pi pi-lock',
        command: () => this.abrirCambiarContrasena(),
      },
      {
        label: 'Cerrar Sesión',
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout(),
      },
    ];
  }

  abrirCambiarContrasena(): void {
    this.refDialog = this.dialogService.open(CambiarContrasenaComponent, {
      header: 'Cambiar Contraseña',
      width: '400px',
      modal: true,
      closeOnEscape: true,
      dismissableMask: false,
      focusOnShow: false,
    });
  }

  toggleUserMenu(event: Event): void {
    this.userMenu.toggle(event);
  }
}
