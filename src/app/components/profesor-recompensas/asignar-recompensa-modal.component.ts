// src/app/components/profesor/profesor-recompensas/asignar-recompensa-modal/asignar-recompensa-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';

interface AsignarRecompensaData {
  recompensa?: any;
  recompensas: any[];
  eventos: any[];
  asignaturas: any[];
}

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  avatar?: string;
  promedio: number;
  asignatura: string;
}

@Component({
  selector: 'app-asignar-recompensa-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="modal-header">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <mat-icon class="text-purple-600">card_giftcard</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Asignar Recompensa</h2>
            <p class="text-gray-600 text-sm mt-1">
              Otorga recompensas a estudiantes por su desempeño
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <div class="modal-content p-6">
      
      <!-- Recompensa Seleccionada (si viene predefinida) -->
      <div *ngIf="data.recompensa" class="recompensa-selected mb-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
        <h4 class="text-lg font-semibold text-purple-900 mb-2">Recompensa Seleccionada</h4>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center"
               [style.background-color]="getTipoColor(data.recompensa.tipo) + '20'"
               [style.border]="'2px solid ' + getTipoColor(data.recompensa.tipo)">
            <mat-icon [style.color]="getTipoColor(data.recompensa.tipo)">
              {{ data.recompensa.icono || 'emoji_events' }}
            </mat-icon>
          </div>
          <div>
            <div class="font-medium text-purple-900">{{ data.recompensa.nombre }}</div>
            <div class="text-sm text-purple-700">{{ data.recompensa.valor }} puntos</div>
          </div>
        </div>
      </div>

      <form [formGroup]="asignacionForm" (ngSubmit)="onSubmit()">
        
        <!-- Selección de Recompensa (si no viene predefinida) -->
        <div *ngIf="!data.recompensa" class="mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Seleccionar Recompensa *</mat-label>
            <mat-select formControlName="recompensa" (selectionChange)="onRecompensaChange($event)">
              <mat-option *ngFor="let recompensa of data.recompensas" [value]="recompensa.id">
                <div class="flex items-center gap-3 py-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                       [style.background-color]="getTipoColor(recompensa.tipo) + '20'"
                       [style.border]="'1px solid ' + getTipoColor(recompensa.tipo)">
                    <mat-icon class="text-sm" [style.color]="getTipoColor(recompensa.tipo)">
                      {{ recompensa.icono || 'emoji_events' }}
                    </mat-icon>
                  </div>
                  <div class="flex-1">
                    <div class="font-medium">{{ recompensa.nombre }}</div>
                    <div class="text-xs text-gray-600">{{ recompensa.valor }} puntos • {{ recompensa.asignatura.nombre }}</div>
                  </div>
                </div>
              </mat-option>
            </mat-select>
            <mat-error *ngIf="asignacionForm.get('recompensa')?.hasError('required')">
              Seleccione una recompensa
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Filtros para Estudiantes -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-4">Filtrar Estudiantes</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Asignatura -->
            <mat-form-field appearance="outline">
              <mat-label>Asignatura</mat-label>
              <mat-select [formControl]="filtroAsignatura" (selectionChange)="filtrarEstudiantes()">
                <mat-option value="">Todas</mat-option>
                <mat-option *ngFor="let asignatura of data.asignaturas" [value]="asignatura.id">
                  {{ asignatura.nombre }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Evento -->
            <mat-form-field appearance="outline">
              <mat-label>Evento</mat-label>
              <mat-select [formControl]="filtroEvento" (selectionChange)="filtrarEstudiantes()">
                <mat-option value="">Todos</mat-option>
                <mat-option *ngFor="let evento of data.eventos" [value]="evento.id">
                  {{ evento.nombre }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Búsqueda -->
            <mat-form-field appearance="outline">
              <mat-label>Buscar estudiante</mat-label>
              <input matInput 
                     [formControl]="busquedaEstudiante"
                     placeholder="Nombre o email...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

          </div>
        </div>

        <!-- Lista de Estudiantes -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900">Seleccionar Estudiantes</h4>
            <div class="flex gap-2">
              <button mat-button 
                      type="button" 
                      (click)="seleccionarTodos()"
                      class="text-sm">
                Seleccionar Todos
              </button>
              <button mat-button 
                      type="button" 
                      (click)="limpiarSeleccion()"
                      class="text-sm">
                Limpiar Selección
              </button>
            </div>
          </div>

          <!-- Lista de estudiantes -->
          <div class="estudiantes-list max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
            <div *ngFor="let estudiante of estudiantesFiltrados" 
                 class="estudiante-item flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                 (click)="toggleEstudiante(estudiante)">
              
              <mat-checkbox [checked]="isEstudianteSeleccionado(estudiante.id)"
                            (change)="onEstudianteCheckChange(estudiante, $event)"
                            (click)="$event.stopPropagation()">
              </mat-checkbox>

              <img [src]="estudiante.avatar || getDefaultAvatar(estudiante.nombres)" 
                   [alt]="estudiante.nombres"
                   class="w-10 h-10 rounded-full border-2 border-gray-200">

              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ estudiante.nombres }} {{ estudiante.apellidos }}
                    </div>
                    <div class="text-sm text-gray-500">{{ estudiante.email }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">
                      Promedio: {{ estudiante.promedio.toFixed(1) }}
                    </div>
                    <div class="text-xs text-gray-500">{{ estudiante.asignatura }}</div>
                  </div>
                </div>
              </div>

              <!-- Indicador de criterios cumplidos -->
              <div class="flex items-center gap-1">
                <mat-icon class="text-green-500 text-lg" 
                          *ngIf="cumpleCriterios(estudiante)"
                          matTooltip="Cumple con los criterios">
                  check_circle
                </mat-icon>
                <mat-icon class="text-orange-500 text-lg" 
                          *ngIf="!cumpleCriterios(estudiante)"
                          matTooltip="No cumple todos los criterios">
                  warning
                </mat-icon>
              </div>

            </div>
          </div>

          <!-- Estado vacío -->
          <div *ngIf="estudiantesFiltrados.length === 0" 
               class="text-center py-8 text-gray-500">
            <mat-icon class="text-4xl mb-2">people_outline</mat-icon>
            <p>No se encontraron estudiantes</p>
          </div>
        </div>

        <!-- Estudiantes Seleccionados -->
        <div *ngIf="estudiantesSeleccionados.length > 0" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-900 mb-3">
            Estudiantes Seleccionados ({{ estudiantesSeleccionados.length }})
          </h4>
          <div class="flex flex-wrap gap-2">
            <mat-chip *ngFor="let estudiante of estudiantesSeleccionados" 
                      [removable]="true"
                      (removed)="removerEstudiante(estudiante.id)">
              {{ estudiante.nombres }} {{ estudiante.apellidos }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </div>
        </div>

        <!-- Evento Asociado (Opcional) -->
        <div class="mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Evento Asociado (Opcional)</mat-label>
            <mat-select formControlName="evento">
              <mat-option value="">Sin evento específico</mat-option>
              <mat-option *ngFor="let evento of data.eventos" [value]="evento.id">
                {{ evento.nombre }}
              </mat-option>
            </mat-select>
            <mat-hint>Asocia la asignación a un evento específico</mat-hint>
          </mat-form-field>
        </div>

        <!-- Motivo -->
        <div class="mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Motivo de la Recompensa *</mat-label>
            <textarea matInput 
                      formControlName="motivo" 
                      rows="3"
                      placeholder="Explica por qué estos estudiantes merecen esta recompensa..."></textarea>
            <mat-error *ngIf="asignacionForm.get('motivo')?.hasError('required')">
              El motivo es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Enviar notificación -->
        <div class="mb-6">
          <mat-checkbox formControlName="enviarNotificacion" color="primary">
            Enviar notificación por email a los estudiantes
          </mat-checkbox>
        </div>

      </form>
    </div>

    <!-- Modal Footer -->
    <div class="modal-footer flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
      <div class="text-sm text-gray-600">
        {{ estudiantesSeleccionados.length }} estudiante(s) seleccionado(s)
      </div>
      <div class="flex gap-3">
        <button mat-button (click)="cerrar()" class="text-gray-600">
          Cancelar
        </button>
        <button mat-raised-button 
                color="primary" 
                (click)="onSubmit()"
                [disabled]="asignacionForm.invalid || estudiantesSeleccionados.length === 0 || isLoading">
          <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
          <mat-icon *ngIf="!isLoading" class="mr-2">card_giftcard</mat-icon>
          {{ isLoading ? 'Asignando...' : 'Asignar Recompensa' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    }

    .modal-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    .recompensa-selected {
      border-left-width: 4px;
    }

    .estudiantes-list {
      background: white;
    }

    .estudiante-item {
      transition: background-color 0.2s ease;
    }

    .estudiante-item:hover {
      background-color: #f9fafb;
    }

    .estudiante-item:last-child {
      border-bottom: none;
    }

    /* Checkbox customization */
    ::ng-deep .mat-mdc-checkbox .mdc-checkbox {
      border-radius: 4px;
    }

    /* Chip customization */
    .mat-mdc-chip {
      margin: 2px;
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
      .grid.grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        max-height: 60vh;
      }
      
      .estudiantes-list {
        max-height: 200px;
      }
    }
  `]
})
export class AsignarRecompensaModalComponent implements OnInit {
  asignacionForm: FormGroup;
  filtroAsignatura: any;
  filtroEvento: any;
  busquedaEstudiante: any;

  isLoading = false;

  // Estudiantes
  estudiantes: Estudiante[] = [];
  estudiantesFiltrados: Estudiante[] = [];
  estudiantesSeleccionados: Estudiante[] = [];

  // Recompensa seleccionada
  recompensaSeleccionada: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AsignarRecompensaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AsignarRecompensaData
  ) {
    this.asignacionForm = this.fb.group({
      recompensa: [data.recompensa?.id || '', Validators.required],
      evento: [''],
      motivo: ['', [Validators.required, Validators.minLength(10)]],
      enviarNotificacion: [true]
    });
  }

  ngOnInit(): void {
    this.recompensaSeleccionada = this.data.recompensa;
    this.loadEstudiantes();
    this.setupBusqueda();

    this.filtroAsignatura = this.fb.control('');
    this.filtroEvento = this.fb.control('');
    this.busquedaEstudiante = this.fb.control('');
  }

  loadEstudiantes(): void {
    // Datos de ejemplo - conectar con tu servicio real
    this.estudiantes = [
      {
        id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        email: 'juan.perez@estudiante.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
        promedio: 16.8,
        asignatura: 'Programación Web'
      },
      {
        id: 2,
        nombres: 'María Elena',
        apellidos: 'Rodriguez López',
        email: 'maria.rodriguez@estudiante.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        promedio: 15.2,
        asignatura: 'Base de Datos'
      },
      {
        id: 3,
        nombres: 'Carlos Antonio',
        apellidos: 'Mendoza Silva',
        email: 'carlos.mendoza@estudiante.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        promedio: 14.1,
        asignatura: 'Redes de Computadoras'
      },
      {
        id: 4,
        nombres: 'Ana Sofía',
        apellidos: 'Torres Vega',
        email: 'ana.torres@estudiante.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        promedio: 17.5,
        asignatura: 'Programación Web'
      },
      {
        id: 5,
        nombres: 'Diego Fernando',
        apellidos: 'Quispe Mamani',
        email: 'diego.quispe@estudiante.edu',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
        promedio: 13.8,
        asignatura: 'Base de Datos'
      }
    ];

    this.estudiantesFiltrados = [...this.estudiantes];
  }

  setupBusqueda(): void {
    this.busquedaEstudiante.valueChanges.subscribe(() => {
      this.filtrarEstudiantes();
    });
  }

  filtrarEstudiantes(): void {
    let filtrados = [...this.estudiantes];

    // Filtro por asignatura
    const asignaturaId = this.filtroAsignatura.value;
    if (asignaturaId) {
      const asignatura = this.data.asignaturas.find(a => a.id === asignaturaId);
      if (asignatura) {
        filtrados = filtrados.filter(e => e.asignatura === asignatura.nombre);
      }
    }

    // Filtro por búsqueda
    const busqueda = this.busquedaEstudiante.value?.toLowerCase() || '';
    if (busqueda) {
      filtrados = filtrados.filter(e =>
        e.nombres.toLowerCase().includes(busqueda) ||
        e.apellidos.toLowerCase().includes(busqueda) ||
        e.email.toLowerCase().includes(busqueda)
      );
    }

    this.estudiantesFiltrados = filtrados;
  }

  onRecompensaChange(event: any): void {
    this.recompensaSeleccionada = this.data.recompensas.find(r => r.id === event.value);
  }

  toggleEstudiante(estudiante: Estudiante): void {
    const index = this.estudiantesSeleccionados.findIndex(e => e.id === estudiante.id);
    if (index >= 0) {
      this.estudiantesSeleccionados.splice(index, 1);
    } else {
      this.estudiantesSeleccionados.push(estudiante);
    }
  }

  onEstudianteCheckChange(estudiante: Estudiante, event: any): void {
    if (event.checked) {
      if (!this.isEstudianteSeleccionado(estudiante.id)) {
        this.estudiantesSeleccionados.push(estudiante);
      }
    } else {
      this.removerEstudiante(estudiante.id);
    }
  }

  isEstudianteSeleccionado(estudianteId: number): boolean {
    return this.estudiantesSeleccionados.some(e => e.id === estudianteId);
  }

  seleccionarTodos(): void {
    this.estudiantesSeleccionados = [...this.estudiantesFiltrados];
  }

  limpiarSeleccion(): void {
    this.estudiantesSeleccionados = [];
  }

  removerEstudiante(estudianteId: number): void {
    const index = this.estudiantesSeleccionados.findIndex(e => e.id === estudianteId);
    if (index >= 0) {
      this.estudiantesSeleccionados.splice(index, 1);
    }
  }

  cumpleCriterios(estudiante: Estudiante): boolean {
    // Lógica para verificar si el estudiante cumple con los criterios
    // de la recompensa seleccionada
    if (!this.recompensaSeleccionada) return true;

    // Ejemplo: verificar promedio mínimo
    return estudiante.promedio >= 14;
  }

  onSubmit(): void {
    if (this.asignacionForm.valid && this.estudiantesSeleccionados.length > 0) {
      this.isLoading = true;

      // Simular llamada al servicio
      setTimeout(() => {
        const asignacionData = {
          recompensaId: this.asignacionForm.value.recompensa || this.data.recompensa?.id,
          eventoId: this.asignacionForm.value.evento,
          motivo: this.asignacionForm.value.motivo,
          enviarNotificacion: this.asignacionForm.value.enviarNotificacion,
          estudiantes: this.estudiantesSeleccionados.map(e => e.id)
        };

        this.isLoading = false;
        this.dialogRef.close(asignacionData);
      }, 2000);
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  // Métodos de utilidad
  getTipoColor(tipo: string): string {
    const colores: { [key: string]: string } = {
      'puntos': '#f59e0b',
      'insignia': '#8b5cf6',
      'certificado': '#10b981',
      'privilegio': '#3b82f6',
      'descuento': '#ef4444',
      'material': '#f97316'
    };
    return colores[tipo] || '#6b7280';
  }

  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
  }
}