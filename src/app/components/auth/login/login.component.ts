import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/auth.model';
import { ToastNotificationService } from '../../../services/toast-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    IconField,
    InputIcon,
  ],
  providers: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formGroupSesion: FormGroup;
  disabledButton: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly toastNotificationService: ToastNotificationService,
    private readonly router: Router,
  ) {
    this.formGroupSesion = new FormGroup({
      usuario: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      contrasena: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });

    this.disabledButton = true;
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }

    this.formGroupSesion.valueChanges.subscribe(() => {
      if (this.formGroupSesion.valid) {
        this.disabledButton = false;
      } else {
        this.disabledButton = true;
      }
    });
  }

  iniciarSesion() {
    if (!this.formGroupSesion.valid) {
      return;
    }

    this.disabledButton = true;

    const credenciales: LoginRequest = {
      usuario: this.formGroupSesion.get('usuario')?.value,
      contrasena: this.formGroupSesion.get('contrasena')?.value,
    };

    this.authService.login(credenciales).subscribe({
      next: (response) => {
        if (response.code === 0) {
          this.router.navigate(['/home']);
        } else {
          this.toastNotificationService.showError(
            response.error || 'Error al iniciar sesión',
          );
          console.error('Error al iniciar sesión:', response.error);
          this.disabledButton = false;
        }
      },
      error: (error) => {
        this.toastNotificationService.showError(
          error.message ?? 'Error al iniciar sesión',
        );
        console.error('Error al iniciar sesión:', error);
        this.disabledButton = false;
      },
    });
  }
}
