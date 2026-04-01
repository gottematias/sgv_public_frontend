import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './services/auth.service';
import { MenubarComponent } from './shared/menu/menubar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, MenubarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'sistema-gestion-veterinaria';

  constructor(readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.iniciarRefrescoTokenSiEstaAutenticado();
  }
}
