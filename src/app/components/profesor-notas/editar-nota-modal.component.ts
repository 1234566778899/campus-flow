// src/app/components/profesor/profesor-notas/editar-nota-modal/editar-nota-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface EditarNotaData {
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
    evaluacion: {
        id: number;
        nombre: string;
        tipo: string;
        peso: number;
        nota: number;
        fechaEvaluacion: Date;
        fechaRegistro?: Date;
        observaciones?: string;
    };
}

@Component({
    selector: 'app-editar-nota-modal',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    template: `
    <div class="modal-header">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <mat-icon class="text-blue-600">edit</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Editar Nota</h2>
            <p class="text-gray-600 text-sm mt-1">
              {{ data.estudiante.nombres }} {{ data.estudiante.apellidos }}
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <div class="modal-content p-6">
      
      <!-- Información de la evaluación -->
      <div class="evaluation-info bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
        <h3 class="font-semibold text-blue-900 mb-3">{{ data.evaluacion.nombre }}</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium text-blue-800">Tipo:</span>
            <span class="text-blue-700 ml-2 capitalize">{{ data.evaluacion.tipo }}</span>
          </div>
          <div>
            <span class="font-medium text-blue-800">Peso:</span>
            <span class="text-blue-700 ml-2">{{ data.evaluacion.peso }}%</span>
          </div>
          <div>
            <span class="font-medium text-blue-800">Fecha de Evaluación:</span>
            <span class="text-blue-700 ml-2">{{ data.evaluacion.fechaEvaluacion | date:'dd/MM/yyyy' }}</span>
          </div>
          <div *ngIf="data.evaluacion.fechaRegistro">
            <span class="font-medium text-blue-800">Registrada:</span>
            <span class="text-blue-700 ml-2">{{ data.evaluacion.fechaRegistro | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
      </div>

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

      <!-- Comparación de notas -->
      <div class="comparison-section mb-6">
        <h4 class="text-lg font-semibold text-gray-900 mb-4">Modificación de Calificación</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Nota actual -->
          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nota Actual</label>
            <div [class]="getNotaStatusClass(data.evaluacion.nota)" 
                 class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl font-bold">{{ data.evaluacion.nota.toFixed(1) }}</span>
            </div>
            <p [class]="getNotaStatusTextClass(data.evaluacion.nota)" class="text-sm font-medium">
              {{ getNotaStatusText(data.evaluacion.nota) }}
            </p>
          </div>

          <!-- Flecha -->
          <div class="flex items-center justify-center">
            <mat-icon class="text-gray-400 text-4xl">arrow_forward</mat-icon>
          </div>

          <!-- Nueva nota -->
          <div class="text-center">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nueva Nota</label>
            <div [class]="getNotaStatusClass(notaForm.get('nota')?.value)" 
                 class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl font-bold">
                {{ notaForm.get('nota')?.value || '0' }}
              </span>
            </div>
            <p [class]="getNotaStatusTextClass(notaForm.get('nota')?.value)" class="text-sm font-medium">
              {{ getNotaStatusText(notaForm.get('nota')?.value) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Formulario de edición -->
      <form [formGroup]="notaForm" (ngSubmit)="onSubmit()">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Nueva nota -->
          <mat-form-field appearance="outline">
            <mat-label>Nueva Nota (0-20)</mat-label>
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

          <!-- Diferencia -->
          <div class="flex items-center justify-center">
            <div class="text-center">
              <label class="block text-sm font-medium text-gray-700 mb-2">Diferencia</label>
              <div [class]="getDiferenciaClass()" 
                   class="px-4 py-2 rounded-lg">
                <span class="text-lg font-bold">
                  {{ getDiferencia() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Motivo de la modificación -->
        <mat-form-field appearance="outline" class="w-full mb-6">
          <mat-label>Motivo de la Modificación</mat-label>
          <textarea matInput 
                    formControlName="motivo" 
                    rows="3"
                    placeholder="Explique el motivo del cambio de calificación..."></textarea>
          <mat-hint>Campo requerido para cambios de nota</mat-hint>
          <mat-error *ngIf="notaForm.get('motivo')?.hasError('required')">
            El motivo es requerido
          </mat-error>
        </mat-form-field>

        <!-- Observaciones adicionales -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Observaciones (Opcional)</mat-label>
          <textarea matInput 
                    formControlName="observaciones" 
                    rows="2"
                    placeholder="Comentarios adicionales..."></textarea>
        </mat-form-field>

      </form>

      <!-- Historial de cambios (si existe) -->
      <div *ngIf="tieneHistorial" class="mt-6">
        <h4 class="text-sm font-semibold text-gray-900 mb-2">Historial de Modificaciones</h4>
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-center gap-2 text-yellow-800">
            <mat-icon class="text-sm">history</mat-icon>
            <span class="text-xs">Esta nota ha sido modificada anteriormente</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal Footer -->
    <div class="modal-footer flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
      <button mat-button (click)="cerrar()" class="text-gray-600">
        Cancelar
      </button>
      <button mat-raised-button 
              color="primary" 
              (click)="onSubmit()"
              [disabled]="notaForm.invalid || isLoading || !hayCambios()"
              class="min-w-32">
        <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
        <mat-icon *ngIf="!isLoading" class="mr-2">save</mat-icon>
        {{ isLoading ? 'Guardando...' : 'Actualizar Nota' }}
      </button>
    </div>
  `,
    styles: [`
    .modal-header {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .modal-content {
      max-height: 65vh;
      overflow-y: auto;
    }

    .evaluation-info {
      border-left: 4px solid #3b82f6;
    }

    .student-info {
      border-left: 4px solid #6b7280;
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

    /* Diferencia classes */
    .diferencia-positiva {
      background-color: #dcfce7;
      color: #166534;
    }

    .diferencia-negativa {
      background-color: #fef2f2;
      color: #dc2626;
    }

    .diferencia-neutra {
      background-color: #f3f4f6;
      color: #6b7280;
    }

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
        max-height: 55vh;
      }
      
      .grid.grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: 1fr;
      }
      
      .grid.grid-cols-1.md\\:grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EditarNotaModalComponent implements OnInit {
    notaForm: FormGroup;
    isLoading = false;
    tieneHistorial = false; // Simular si tiene historial

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditarNotaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EditarNotaData
    ) {
        this.notaForm = this.fb.group({
            nota: [data.evaluacion.nota, [Validators.required, Validators.min(0), Validators.max(20)]],
            motivo: ['', Validators.required],
            observaciones: [data.evaluacion.observaciones || '']
        });
    }

    ngOnInit(): void {
        // Simular si tiene historial de modificaciones
        this.tieneHistorial = Math.random() > 0.7;
    }

    onSubmit(): void {
        if (this.notaForm.valid && this.hayCambios()) {
            this.isLoading = true;

            // Simular llamada al servicio
            setTimeout(() => {
                const formData = this.notaForm.value;

                const resultado = {
                    ...formData,
                    notaAnterior: this.data.evaluacion.nota,
                    estudianteId: this.data.estudiante.id,
                    asignaturaId: this.data.asignatura.id,
                    evaluacionId: this.data.evaluacion.id,
                    fechaModificacion: new Date()
                };

                this.isLoading = false;
                this.dialogRef.close(resultado);
            }, 1500);
        }
    }

    cerrar(): void {
        this.dialogRef.close();
    }

    hayCambios(): boolean {
        const notaActual = this.notaForm.get('nota')?.value;
        return notaActual !== this.data.evaluacion.nota;
    }

    getDiferencia(): string {
        const notaNueva = this.notaForm.get('nota')?.value || 0;
        const diferencia = notaNueva - this.data.evaluacion.nota;

        if (diferencia > 0) {
            return `+${diferencia.toFixed(1)}`;
        } else if (diferencia < 0) {
            return diferencia.toFixed(1);
        } else {
            return '0.0';
        }
    }

    getDiferenciaClass(): string {
        const notaNueva = this.notaForm.get('nota')?.value || 0;
        const diferencia = notaNueva - this.data.evaluacion.nota;

        if (diferencia > 0) {
            return 'diferencia-positiva';
        } else if (diferencia < 0) {
            return 'diferencia-negativa';
        } else {
            return 'diferencia-neutra';
        }
    }

    getDefaultAvatar(): string {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.data.estudiante.nombres)}`;
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