import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';
import { AuthRequest } from '../../../model/Auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formulario!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private ruta: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para facilitar el acceso a los controles
  get username() { return this.formulario.get('username'); }
  get password() { return this.formulario.get('password'); }

  // Métodos para obtener mensajes de error personalizados
  getUsernameError(): string {
    if (this.username?.hasError('required')) {
      return 'El nombre de usuario es requerido';
    }
    if (this.username?.hasError('minlength')) {
      return 'El usuario debe tener al menos 4 caracteres';
    }
    if (this.username?.hasError('maxlength')) {
      return 'El usuario no puede exceder 50 caracteres';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.password?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.password?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  acceder(): void {
    if (this.formulario.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Por favor, completa todos los campos correctamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.isLoading = true;

    const request: AuthRequest = {
      username: this.formulario.value.username,
      password: this.formulario.value.password,
    };

    this.authService.login(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open('¡Bienvenido! Iniciando sesión...', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });

        // Aquí puedes redirigir según el rol del usuario
        // Por ejemplo, si el response incluye información del rol:
        // if (response.role === 'ESTUDIANTE') {
        //   this.router.navigate(['/dashboard-estudiante']);
        // } else if (response.role === 'PROFESOR') {
        //   this.router.navigate(['/dashboard-profesor']);
        // }

        // Por ahora, redirección genérica:
        this.router.navigate(['/dashboard-estudiante']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        console.error('Login component error:', err);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.formulario.controls).forEach(key => {
      this.formulario.get(key)?.markAsTouched();
    });
  }

  // Métodos adicionales para funcionalidades de la UI mejorada
  forgotPassword(): void {
    this.snackBar.open('Funcionalidad de recuperación en desarrollo', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  contactSupport(): void {
    this.snackBar.open('Redirigiendo a soporte...', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/registro-selector']);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}