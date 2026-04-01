import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Rol } from '../../constants/rol.enum';

@Component({
  selector: 'app-home',
  imports: [],
  providers: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.authService.hasAnyRole([Rol.VETERINARIO])) {
      this.router.navigate(['/dashboard-veterinario']);
    } else if (this.authService.hasAnyRole([Rol.CAJERO])) {
      this.router.navigate(['/venta/lista']);
    } else if (this.authService.hasAnyRole([Rol.GESTOR_INVENTARIO])) {
      this.router.navigate(['/stock/producto/lista']);
    } else if (this.authService.hasAnyRole([Rol.ADMINISTRADOR])) {
      this.router.navigate(['/reporte/lista']);
    } else {
      this.router.navigate(['/dashboard-recepcion']);
    }
  }
}
