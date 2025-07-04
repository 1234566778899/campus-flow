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
import { HttpClientModule } from '@angular/common/http';

// Importaciones de servicios y modelos
import { Carrera } from '../../../model/carrera';
import { CarreraService } from '../../../services/carrera.service';
import { RegisterEstudiantePayload } from '../../../model/RegisterEstudiantePayload';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-registro-estudiante',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    HttpClientModule,
  ],
  templateUrl: './registro-estudiante.component.html',
  styleUrl: './registro-estudiante.component.css',
})
export class RegistroEstudianteComponent implements OnInit {
  formulario!: FormGroup;
  id?: number;
  carreras: Carrera[] = [];
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private carreraService: CarreraService,
    private estudianteService: EstudianteService,
    private snackBar: MatSnackBar,
    private ruta: ActivatedRoute,
    private router: Router
  ) {
    this.formulario = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          ],
        ],
        apellido: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9_]+$/),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        ciclo: [
          null,
          [Validators.required, Validators.min(1), Validators.max(12)],
        ],
        idCarrera: [null, [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit() {
    this.id = +this.ruta.snapshot.paramMap.get('id')!;
    if (this.id) {
      console.log('Modo edición detectado para ID:', this.id);
      this.snackBar.open(
        'Este formulario es de REGISTRO, no de edición.',
        'Info',
        {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }
      );
    }
    this.cargarCarreras();
  }

  // Getters para facilitar el acceso a los controles
  get nombre() { return this.formulario.get('nombre'); }
  get apellido() { return this.formulario.get('apellido'); }
  get email() { return this.formulario.get('email'); }
  get username() { return this.formulario.get('username'); }
  get password() { return this.formulario.get('password'); }
  get confirmPassword() { return this.formulario.get('confirmPassword'); }
  get ciclo() { return this.formulario.get('ciclo'); }
  get idCarrera() { return this.formulario.get('idCarrera'); }

  // Métodos para obtener mensajes de error personalizados
  getNombreError(): string {
    if (this.nombre?.hasError('required')) return 'El nombre es obligatorio';
    if (this.nombre?.hasError('minlength') || this.nombre?.hasError('maxlength')) {
      return 'Debe tener entre 2 y 50 caracteres';
    }
    if (this.nombre?.hasError('pattern')) return 'Solo se permiten letras y espacios';
    return '';
  }

  getApellidoError(): string {
    if (this.apellido?.hasError('required')) return 'El apellido es obligatorio';
    if (this.apellido?.hasError('minlength') || this.apellido?.hasError('maxlength')) {
      return 'Debe tener entre 2 y 50 caracteres';
    }
    if (this.apellido?.hasError('pattern')) return 'Solo se permiten letras y espacios';
    return '';
  }

  getEmailError(): string {
    if (this.email?.hasError('required')) return 'El email es obligatorio';
    if (this.email?.hasError('email')) return 'Debe ser un email válido';
    return '';
  }

  getUsernameError(): string {
    if (this.username?.hasError('required')) return 'El nombre de usuario es obligatorio';
    if (this.username?.hasError('minlength') || this.username?.hasError('maxlength')) {
      return 'Debe tener entre 4 y 20 caracteres';
    }
    if (this.username?.hasError('pattern')) return 'Solo letras, números y guión bajo';
    return '';
  }

  getPasswordError(): string {
    if (this.password?.hasError('required')) return 'La contraseña es obligatoria';
    if (this.password?.hasError('minlength')) return 'Debe tener al menos 6 caracteres';
    if (this.password?.hasError('pattern')) {
      return 'Debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial';
    }
    return '';
  }

  getCicloError(): string {
    if (this.ciclo?.hasError('required')) return 'El ciclo es obligatorio';
    if (this.ciclo?.hasError('min')) return 'El ciclo debe ser al menos 1';
    if (this.ciclo?.hasError('max')) return 'El ciclo no debe exceder de 12';
    return '';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  cargarCarreras(): void {
    this.carreraService.getAllCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        console.log('Carreras cargadas exitosamente:', this.carreras);
        if (this.carreras.length === 0) {
          console.warn('La lista de carreras está vacía. Asegúrate de que el backend esté devolviendo datos.');
          this.snackBar.open(
            'No se pudieron cargar las carreras. Contacta al administrador.',
            'Cerrar',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        }
      },
      error: (err) => {
        console.error('Error al cargar carreras:', err);
        this.snackBar.open(
          'Error al cargar las carreras. Inténtelo de nuevo más tarde.',
          'Cerrar',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      },
    });
  }

  registrar(): void {
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      this.snackBar.open(
        'Por favor, complete todos los campos requeridos correctamente.',
        'Cerrar',
        {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    if (this.formulario.errors?.['passwordMismatch']) {
      this.snackBar.open('Las contraseñas no coinciden.', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading = true;

    const payload: RegisterEstudiantePayload = {
      nombre: this.formulario.value.nombre,
      apellido: this.formulario.value.apellido,
      email: this.formulario.value.email,
      username: this.formulario.value.username,
      password: this.formulario.value.password,
      ciclo: this.formulario.value.ciclo,
      idCarrera: this.formulario.value.idCarrera,
    };

    console.log('Iniciando registro con payload:', payload);

    this.estudianteService.registerEstudiante(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registro exitoso:', response);
        this.snackBar.open('¡Registro de estudiante exitoso! Bienvenido a CampusFlow', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el registro de estudiante:', err);
        this.snackBar.open(
          err.message || 'Error en el registro. Inténtelo de nuevo.',
          'Cerrar',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
  }

  // Métodos adicionales para la UI
  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  contactSupport(): void {
    this.snackBar.open('Redirigiendo a soporte...', 'Cerrar', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}