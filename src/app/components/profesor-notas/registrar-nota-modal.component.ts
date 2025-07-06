// src/app/components/profesor/profesor-notas/registrar-nota-modal/registrar-nota-modal.component.ts
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
import { MatSliderModule } from '@angular/material/slider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface RegistrarNotaData {
    estudiante: {
        id: number;
        nombres: string;
        apellidos: string;
        email: string;
        avatar?: string;
    };
    asignatura: {
        id: number;
        nombre: string;
        codigo: string;
    };
    evaluacion?: {
        id: number;
        nombre: string;
        tipo: string;
        peso: number;
        fechaEvaluacion: Date;
    };
    evaluacionesDisponibles: string[];
}

@Component({
    selector: 'app-registrar-nota-modal',
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
        MatSliderModule,
        ReactiveFormsModule
    ],
    template: `
    <div class="modal-header">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <mat-icon class="text-purple-600">grade</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ data.evaluacion ? 'Registrar Nota' : 'Nueva Evaluación' }}
            </h2>
            <p class="text-gray-600 text-sm mt-1">
              {{ data.estudiante.nombres }} {{ data.estudiante.apellidos }} - {{ data.asignatura.nombre }}
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <div class="modal-content p-6">
      
      <!-- Información del estudiante -->
      <div class="student-info bg-gray-50 rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3">
          <img [src]="data.estudiante.avatar || getDefaultAvatar()" 
               [alt]="data.estudiante.nombres"
               class="w-12 h-12 rounded-full border-2 border-gray-200">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">
              {{ data.estudiante.nombres }} {{ data.estudiante.apellidos }}
            </h3>
            <p class="text-sm text-gray-600">{{ data.estudiante.email }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">{{ data.asignatura.nombre }}</p>
            <p class="text-xs text-gray-500">{{ data.asignatura.codigo }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <form [formGroup]="notaForm" (ngSubmit)="onSubmit()">
        
        <!-- Evaluación existente o nueva -->
        <div *ngIf="!data.evaluacion" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Información de la Evaluación</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nombre de la evaluación -->
            <mat-form-field appearance="outline" class="col-span-1 md:col-span-2">
              <mat-label>Nombre de la Evaluación</mat-label>
              <input matInput 
                     formControlName="nombreEvaluacion" 
                     placeholder="Ej: Examen Parcial, Proyecto Final">
              <mat-error *ngIf="notaForm.get('nombreEvaluacion')?.hasError('required')">
                El nombre de la evaluación es requerido
              </mat-error>
            </mat-form-field>

            <!-- Tipo de evaluación -->
            <mat-form-field appearance="outline">
              <mat-label>Tipo de Evaluación</mat-label>
              <mat-select formControlName="tipoEvaluacion">
                <mat-option value="examen">Examen</mat-option>
                <mat-option value="practica">Práctica</mat-option>
                <mat-option value="tarea">Tarea</mat-option>
                <mat-option value="proyecto">Proyecto</mat-option>
                <mat-option value="participacion">Participación</mat-option>
              </mat-select>
              <mat-error *ngIf="notaForm.get('tipoEvaluacion')?.hasError('required')">
                Seleccione el tipo de evaluación
              </mat-error>
            </mat-form-field>

            <!-- Fecha de evaluación -->
            <mat-form-field appearance="outline">
              <mat-label>Fecha de Evaluación</mat-label>
              <input matInput 
                     [matDatepicker]="picker" 
                     formControlName="fechaEvaluacion">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="notaForm.get('fechaEvaluacion')?.hasError('required')">
                La fecha es requerida
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Peso de la evaluación -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Peso de la Evaluación: {{ notaForm.get('peso')?.value }}%
            </label>
            <mat-slider 
              min="5" 
              max="50" 
              step="5" 
              showTickMarks 
              discrete
              [displayWith]="formatLabel">
              <input matSliderThumb formControlName="peso">
            </mat-slider>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        <!-- Información de evaluación existente -->
        <div *ngIf="data.evaluacion" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Información de la Evaluación</h4>
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-blue-900">Nombre:</span>
                <span class="text-blue-700 ml-2">{{ data.evaluacion.nombre }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-900">Tipo:</span>
                <span class="text-blue-700 ml-2 capitalize">{{ data.evaluacion.tipo }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-900">Peso:</span>
                <span class="text-blue-700 ml-2">{{ data.evaluacion.peso }}%</span>
              </div>
              <div>
                <span class="font-medium text-blue-900">Fecha:</span>
                <span class="text-blue-700 ml-2">{{ data.evaluacion.fechaEvaluacion | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Calificación -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Calificación</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nota numérica -->
            <mat-form-field appearance="outline">
              <mat-label>Nota (0-20)</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="nota" 
                     min="0" 
                     max="20" 
                     step="0.1"
                     placeholder="0.0">
              <mat-hint>Escala de 0 a 20</mat-hint>
              <mat-error *ngIf="notaForm.get('nota')?.hasError('required')">
                La nota es requerida
              </mat-error>
              <mat-error *ngIf="notaForm.get('nota')?.hasError('min')">
                La nota mínima es 0
              </mat-error>
              <mat-error *ngIf="notaForm.get('nota')?.hasError('max')">
                La nota máxima es 20
              </mat-error>
            </mat-form-field>

            <!-- Visualización del estado -->
            <div class="flex items-center justify-center">
              <div class="text-center">
                <div [class]="getNotaStatusClass(notaForm.get('nota')?.value)" 
                     class="w-20 h-20 rounded-full flex items-center justify-center mb-2">
                  <span class="text-2xl font-bold">
                    {{ notaForm.get('nota')?.value || '0' }}
                  </span>
                </div>
                <p [class]="getNotaStatusTextClass(notaForm.get('nota')?.value)" 
                   class="text-sm font-medium">
                  {{ getNotaStatusText(notaForm.get('nota')?.value) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Observaciones -->
        <div class="mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Observaciones (Opcional)</mat-label>
            <textarea matInput 
                      formControlName="observaciones" 
                      rows="3"
                      placeholder="Comentarios adicionales sobre la evaluación..."></textarea>
            <mat-hint>Máximo 500 caracteres</mat-hint>
          </mat-form-field>
        </div>

      </form>
    </div>

    <!-- Modal Footer -->
    <div class="modal-footer flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
      <button mat-button (click)="cerrar()" class="text-gray-600">
        Cancelar
      </button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()"
              [disabled]="notaForm.invalid || isLoading"
              class="min-w-32">
        <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
        <mat-icon *ngIf="!isLoading" class="mr-2">save</mat-icon>
        {{ isLoading ? 'Guardando...' : 'Guardar Nota' }}
      </button>
    </div>
  `,
    styles: [`
    .modal-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .modal-content {
      max-height: 60vh;
      overflow-y: auto;
    }

    .student-info {
      border-left: 4px solid #7c3aed;
    }

    /* Nota Status Classes */
    .nota-excelente {
      background-color: #dcfce7;
      color: #166534;
      border: 2px solid #16a34a;
    }

    .nota-buena {
      background-color: #dbeafe;
      color: #1d4ed8;
      border: 2px solid #2563eb;
    }

    .nota-regular {
      background-color: #fef3c7;
      color: #d97706;
      border: 2px solid #f59e0b;
    }

    .nota-mala {
      background-color: #fef2f2;
      color: #dc2626;
      border: 2px solid #ef4444;
    }

    .nota-sin-valor {
      background-color: #f3f4f6;
      color: #6b7280;
      border: 2px solid #d1d5db;
    }

    /* Text classes */
    .text-excelente { color: #166534; }
    .text-buena { color: #1d4ed8; }
    .text-regular { color: #d97706; }
    .text-mala { color: #dc2626; }
    .text-sin-valor { color: #6b7280; }

    /* Animation */
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        max-height: 50vh;
      }
      
      .grid.grid-cols-1.md\\:grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegistrarNotaModalComponent implements OnInit {
    notaForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<RegistrarNotaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RegistrarNotaData
    ) {
        this.notaForm = this.fb.group({
            nota: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
            observaciones: ['', Validators.maxLength(500)]
        });

        // Si no hay evaluación existente, agregar campos para nueva evaluación
        if (!data.evaluacion) {
            this.notaForm.addControl('nombreEvaluacion', this.fb.control('', Validators.required));
            this.notaForm.addControl('tipoEvaluacion', this.fb.control('', Validators.required));
            this.notaForm.addControl('fechaEvaluacion', this.fb.control('', Validators.required));
            this.notaForm.addControl('peso', this.fb.control(20, [Validators.required, Validators.min(5), Validators.max(50)]));
        }
    }

    ngOnInit(): void {
        // Si hay una evaluación existente, prellenar algunos datos
        if (this.data.evaluacion) {
            // Aquí podrías prellenar con datos existentes si es una edición
        }
    }

    onSubmit(): void {
        if (this.notaForm.valid) {
            this.isLoading = true;

            // Simular llamada al servicio
            setTimeout(() => {
                const formData = this.notaForm.value;

                const resultado = {
                    ...formData,
                    estudianteId: this.data.estudiante.id,
                    asignaturaId: this.data.asignatura.id,
                    evaluacionId: this.data.evaluacion?.id || null,
                    fechaRegistro: new Date()
                };

                this.isLoading = false;
                this.dialogRef.close(resultado);
            }, 1500);
        }
    }

    cerrar(): void {
        this.dialogRef.close();
    }

    getDefaultAvatar(): string {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.data.estudiante.nombres)}`;
    }

    formatLabel(value: number): string {
        return `${value}%`;
    }

    getNotaStatusClass(nota: number | null): string {
        if (!nota && nota !== 0) return 'nota-sin-valor';
        if (nota >= 17) return 'nota-excelente';
        if (nota >= 14) return 'nota-buena';
        if (nota >= 11) return 'nota-regular';
        return 'nota-mala';
    }

    getNotaStatusTextClass(nota: number | null): string {
        if (!nota && nota !== 0) return 'text-sin-valor';
        if (nota >= 17) return 'text-excelente';
        if (nota >= 14) return 'text-buena';
        if (nota >= 11) return 'text-regular';
        return 'text-mala';
    }

    getNotaStatusText(nota: number | null): string {
        if (!nota && nota !== 0) return 'Sin calificar';
        if (nota >= 17) return 'Excelente';
        if (nota >= 14) return 'Bueno';
        if (nota >= 11) return 'Regular';
        return 'Desaprobado';
    }
}