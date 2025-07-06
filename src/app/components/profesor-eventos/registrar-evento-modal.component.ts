// src/app/components/profesor/profesor-eventos/registrar-evento-modal/registrar-evento-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatChip } from '@angular/material/chips';

import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { EventoService } from '../../services/evento.service';

interface RegistrarEventoData {
  evento?: any;
  asignaturas: any[];
  tiposEvento: any[];
  esEdicion?: boolean;
  idProfesor: number; // Añadido para enviar el ID del profesor
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatChip
  ],
  templateUrl: './registrar-evento-modal.component.html',
  styleUrls: ['./registrar-evento-modal.component.scss']
})
export class RegistrarEventoModalComponent implements OnInit {
  informacionForm: FormGroup;
  fechaHoraForm: FormGroup;
  ubicacionForm: FormGroup;
  configuracionForm: FormGroup;

  isLoading = false;
  fechaMinima = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistrarEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrarEventoData,
    private eventoService: EventoService,
    private snackBar: MatSnackBar
  ) {
    // Formulario de información básica
    this.informacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', Validators.required],
      asignatura: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      puntajeRecompensa: [0, [Validators.min(0), Validators.max(100)]]
    });

    // Formulario de fecha y hora
    this.fechaHoraForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
    });

    // Formulario de ubicación (simplificado según modelo backend)
    this.ubicacionForm = this.fb.group({
      modalidad: ['presencial', Validators.required],
      ubicacion: ['']
    });

    // Formulario de configuración (ajustado según modelo backend)
    this.configuracionForm = this.fb.group({
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
    const evento = this.data.evento;

    this.informacionForm.patchValue({
      nombre: evento.nombre,
      tipo: evento.tipo,
      asignatura: evento.asignatura?.id,
      descripcion: evento.descripcion,
      puntajeRecompensa: evento.puntajeRecompensa || 0
    });

    this.fechaHoraForm.patchValue({
      fechaInicio: new Date(evento.fechaInicio),
      fechaFin: evento.fechaFin ? new Date(evento.fechaFin) : null
    });

    this.ubicacionForm.patchValue({
      modalidad: evento.modalidad || 'presencial',
      ubicacion: evento.ubicacion || ''
    });

    this.configuracionForm.patchValue({
      estado: evento.estado !== false // Por defecto true si no está definido
    });
  }

  setupValidacionesDinamicas(): void {
    this.ubicacionForm.get('modalidad')?.valueChanges.subscribe(modalidad => {
      const ubicacionControl = this.ubicacionForm.get('ubicacion');
      if (modalidad === 'virtual') {
        ubicacionControl?.clearValidators();
      } else {
        ubicacionControl?.setValidators([Validators.required]);
      }
      ubicacionControl?.updateValueAndValidity();
    });

    this.fechaHoraForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
      if (!fechaInicio) return;
      const fechaFin = this.fechaHoraForm.get('fechaFin');
      if (!fechaFin?.value || fechaFin.value < fechaInicio) {
        fechaFin?.patchValue(fechaInicio);
      }
    });
  }

  onSubmit(): void {
    if (this.sonFormulariosValidos()) {
      this.isLoading = true;
      const eventoData = this.construirEventoData();

      const operacion = this.eventoService.createEvento(eventoData);

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

  sonFormulariosValidos(): boolean {
    return this.informacionForm.valid &&
      this.fechaHoraForm.valid &&
      this.ubicacionForm.valid &&
      this.configuracionForm.valid;
  }

  construirEventoData(): any {
    const fechaInicio = this.fechaHoraForm.get('fechaInicio')?.value;
    const fechaFin = this.fechaHoraForm.get('fechaFin')?.value || fechaInicio;

    return {
      idEvento: 0,
      nombre: this.informacionForm.get('nombre')?.value,
      descripcion: this.informacionForm.get('descripcion')?.value,
      fechaInicio: fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      fechaFin: fechaFin.toISOString().split('T')[0],
      puntajeRecompensa: this.informacionForm.get('puntajeRecompensa')?.value,
      modalidad: this.ubicacionForm.get('modalidad')?.value,
      ubicacion: this.ubicacionForm.get('ubicacion')?.value,
      estado: this.configuracionForm.get('estado')?.value,
      idProfesor: 1,
      // Campos adicionales si es edición
      ...(this.data.esEdicion && { idEvento: this.data.evento.id })
    };
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  // Métodos de utilidad (se mantienen iguales)
  getPlaceholderUbicacion(): string {
    const modalidad = this.ubicacionForm.get('modalidad')?.value;
    switch (modalidad) {
      case 'virtual': return 'https://meet.google.com/abc-defg-hij';
      case 'presencial': return 'Ej: Aula 201, Laboratorio de Cómputo';
      case 'hibrida': return 'Aula principal + enlace virtual';
      default: return 'Especifica la ubicación';
    }
  }

  getHintUbicacion(): string {
    const modalidad = this.ubicacionForm.get('modalidad')?.value;
    switch (modalidad) {
      case 'virtual': return 'Enlace de Google Meet, Zoom, Teams, etc.';
      case 'presencial': return 'Aula, laboratorio, auditorio, etc.';
      case 'hibrida': return 'Ubicación física + enlace virtual';
      default: return '';
    }
  }

  getIconoUbicacion(): string {
    const modalidad = this.ubicacionForm.get('modalidad')?.value;
    switch (modalidad) {
      case 'virtual': return 'link';
      case 'presencial': return 'place';
      case 'hibrida': return 'hub';
      default: return 'place';
    }
  }

  getTipoLabel(tipoValue: string): string {
    const tipo = this.data.tiposEvento.find(t => t.value === tipoValue);
    return tipo ? tipo.label : tipoValue;
  }

  getAsignaturaLabel(asignaturaId: number): string {
    const asignatura = this.data.asignaturas.find(a => a.id === asignaturaId);
    return asignatura ? `${asignatura.nombre} (${asignatura.codigo})` : '';
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