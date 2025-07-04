import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
export interface Tarea {
  idTarea?: number;
  titulo: string;
  descripcion: string;
  fechaLimite: Date;
  prioridad: string;
  id_estudiante: number;
  id_horario: number;
  estado: boolean;
}

export interface Horario {
  idHorario: number;
  nombreAsignatura: string;
  profesor: string;
  aula: string;
}

@Component({
  selector: 'app-tarea-registrar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './tarea-registrar.component.html',
  styleUrl: './tarea-registrar.component.css'
})
export class TareaRegistrarComponent implements OnInit {

  tareaForm: FormGroup;
  isLoading = false;
  horarios: Horario[] = [];

  // Opciones de prioridad
  prioridades = [
    { value: 'alta', label: 'Alta', color: 'text-red-600', icon: 'priority_high' },
    { value: 'media', label: 'Media', color: 'text-yellow-600', icon: 'remove' },
    { value: 'baja', label: 'Baja', color: 'text-green-600', icon: 'keyboard_arrow_down' }
  ];

  // Datos de ejemplo para horarios (reemplazar con servicio real)
  private horariosEjemplo: Horario[] = [
    { idHorario: 1, nombreAsignatura: 'Matemáticas Avanzadas', profesor: 'Dr. García', aula: 'A-101' },
    { idHorario: 2, nombreAsignatura: 'Física Cuántica', profesor: 'Dra. López', aula: 'B-205' },
    { idHorario: 3, nombreAsignatura: 'Historia Mundial', profesor: 'Prof. Martínez', aula: 'C-301' },
    { idHorario: 4, nombreAsignatura: 'Química Orgánica', profesor: 'Dr. Rodríguez', aula: 'D-102' },
    { idHorario: 5, nombreAsignatura: 'Programación Web', profesor: 'Ing. Sánchez', aula: 'E-404' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.tareaForm = this.createForm();
  }

  ngOnInit() {
    this.cargarHorarios();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      fechaLimite: ['', [Validators.required, this.fechaFuturaValidator]],
      prioridad: ['media', [Validators.required]],
      id_horario: ['', [Validators.required]]
    });
  }

  // Validador personalizado para fechas futuras
  fechaFuturaValidator(control: any) {
    if (!control.value) return null;

    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fechaSeleccionada >= hoy ? null : { fechaPasada: true };
  }

  cargarHorarios() {
    // Aquí normalmente harías una llamada a tu servicio
    this.horarios = this.horariosEjemplo;
  }

  onSubmit() {
    if (this.tareaForm.valid) {
      this.isLoading = true;

      const nuevaTarea: Tarea = {
        titulo: this.tareaForm.value.titulo,
        descripcion: this.tareaForm.value.descripcion,
        fechaLimite: this.tareaForm.value.fechaLimite,
        prioridad: this.tareaForm.value.prioridad,
        id_estudiante: 1, // Obtener del servicio de autenticación
        id_horario: this.tareaForm.value.id_horario,
        estado: false
      };

      // Simular llamada al backend
      setTimeout(() => {
        this.guardarTarea(nuevaTarea);
      }, 1500);
    } else {
      this.marcarCamposComoTocados();
    }
  }

  private guardarTarea(tarea: Tarea) {
    // Aquí harías la llamada real a tu servicio
    console.log('Guardando tarea:', tarea);

    this.isLoading = false;
    this.snackBar.open('Tarea creada exitosamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });

    // Navegar de vuelta a la lista
    this.router.navigate(['/dashboard-estudiante/tareas']);
  }

  private marcarCamposComoTocados() {
    Object.keys(this.tareaForm.controls).forEach(key => {
      this.tareaForm.get(key)?.markAsTouched();
    });
  }

  // Getters para facilitar el acceso a los controles del formulario
  get titulo() { return this.tareaForm.get('titulo'); }
  get descripcion() { return this.tareaForm.get('descripcion'); }
  get fechaLimite() { return this.tareaForm.get('fechaLimite'); }
  get prioridad() { return this.tareaForm.get('prioridad'); }
  get id_horario() { return this.tareaForm.get('id_horario'); }

  // Métodos para obtener mensajes de error
  getTituloError(): string {
    if (this.titulo?.hasError('required')) return 'El título es requerido';
    if (this.titulo?.hasError('minlength')) return 'El título debe tener al menos 3 caracteres';
    if (this.titulo?.hasError('maxlength')) return 'El título no puede exceder 100 caracteres';
    return '';
  }

  getDescripcionError(): string {
    if (this.descripcion?.hasError('required')) return 'La descripción es requerida';
    if (this.descripcion?.hasError('minlength')) return 'La descripción debe tener al menos 10 caracteres';
    if (this.descripcion?.hasError('maxlength')) return 'La descripción no puede exceder 500 caracteres';
    return '';
  }

  getFechaLimiteError(): string {
    if (this.fechaLimite?.hasError('required')) return 'La fecha límite es requerida';
    if (this.fechaLimite?.hasError('fechaPasada')) return 'La fecha límite debe ser posterior a hoy';
    return '';
  }

  getPrioridadError(): string {
    if (this.prioridad?.hasError('required')) return 'La prioridad es requerida';
    return '';
  }

  getHorarioError(): string {
    if (this.id_horario?.hasError('required')) return 'Debe seleccionar una asignatura';
    return '';
  }

  onCancel() {
    this.router.navigate(['/dashboard-estudiante/tareas']);
  }

  limpiarFormulario() {
    this.tareaForm.reset();
    this.tareaForm.patchValue({
      prioridad: 'media' // Valor por defecto
    });
  }

  // Método para obtener el nombre de la asignatura seleccionada
  getNombreAsignatura(idHorario: number): string {
    const horario = this.horarios.find(h => h.idHorario === idHorario);
    return horario ? horario.nombreAsignatura : '';
  }

  // Método para previsualizar la tarea
  previsualizarTarea(): any {
    if (this.tareaForm.valid) {
      return {
        ...this.tareaForm.value,
        asignatura: this.getNombreAsignatura(this.tareaForm.value.id_horario)
      };
    }
    return null;
  }
}