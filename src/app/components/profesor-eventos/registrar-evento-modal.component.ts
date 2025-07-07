import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../model/evento';

interface RegistrarEventoData {
  evento?: Evento;
  esEdicion?: boolean;
  idProfesor: number;
}

@Component({
  selector: 'app-registrar-evento-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './registrar-evento-modal.component.html',
  styleUrls: ['./registrar-evento-modal.component.scss']
})
export class RegistrarEventoModalComponent implements OnInit {
  eventoForm: FormGroup;
  isLoading = false;
  fechaMinima = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistrarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrarEventoData,
    private eventoService: EventoService,
    private snackBar: MatSnackBar
  ) {
    this.eventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      puntajeRecompensa: [0, [Validators.min(0), Validators.max(100)]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    if (this.data.esEdicion && this.data.evento) {
      this.cargarDatosEvento();
    }
    this.setupValidacionesDinamicas();
  }

  cargarDatosEvento(): void {
    const evento = this.data.evento!;

    this.eventoForm.patchValue({
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      fechaInicio: new Date(evento.fechaInicio),
      fechaFin: evento.fechaFin ? new Date(evento.fechaFin) : null,
      puntajeRecompensa: evento.puntajeRecompensa || 0,
      estado: evento.estado !== false
    });
  }

  setupValidacionesDinamicas(): void {
    this.eventoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
      if (!fechaInicio) return;
      const fechaFinControl = this.eventoForm.get('fechaFin');
      if (!fechaFinControl?.value || fechaFinControl.value < fechaInicio) {
        fechaFinControl?.patchValue(fechaInicio);
      }
    });
  }

  onSubmit(): void {
    if (this.eventoForm.valid) {
      this.isLoading = true;
      const eventoData = this.construirEventoData();

      const operacion = this.data.esEdicion
        ? this.eventoService.updateEvento(this.data.evento!.idEvento, eventoData)
        : this.eventoService.createEvento(eventoData);

      operacion.pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (response) => {
          this.mostrarMensajeExito();
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.mostrarError(error);
        }
      });
    }
  }

  mostrarMensajeExito(): void {
    this.snackBar.open(
      `Evento ${this.data.esEdicion ? 'actualizado' : 'creado'} correctamente`,
      'Cerrar',
      { duration: 3000, panelClass: ['snackbar-success'] }
    );
  }

  mostrarError(error: any): void {
    const mensaje = error.error?.message || 'Error al procesar la solicitud';
    this.snackBar.open(
      mensaje,
      'Cerrar',
      { duration: 5000, panelClass: ['snackbar-error'] }
    );
  }

  construirEventoData(): Evento {
    const fechaInicio = this.eventoForm.get('fechaInicio')?.value;
    const fechaFin = this.eventoForm.get('fechaFin')?.value || fechaInicio;

    return {
      // Para nuevos eventos, enviar null; para edición, usar el ID existente
      idEvento: this.data.esEdicion ? this.data.evento!.idEvento : null as any,
      nombre: this.eventoForm.get('nombre')?.value,
      descripcion: this.eventoForm.get('descripcion')?.value,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      puntajeRecompensa: this.eventoForm.get('puntajeRecompensa')?.value || 0,
      estado: this.eventoForm.get('estado')?.value,
      idProfesor: this.data.idProfesor
    };
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}