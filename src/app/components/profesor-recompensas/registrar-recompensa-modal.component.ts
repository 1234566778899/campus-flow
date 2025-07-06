// src/app/components/profesor/profesor-recompensas/registrar-recompensa-modal/registrar-recompensa-modal.component.ts
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
import { MatSliderModule } from '@angular/material/slider';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatChip } from '@angular/material/chips';

interface RegistrarRecompensaData {
  recompensa?: any;
  asignaturas: any[];
  eventos: any[];
  tiposRecompensa: any[];
  categoriasRecompensa: any[];
  esEdicion?: boolean;
}

@Component({
  selector: 'app-registrar-recompensa-modal',
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
    MatSliderModule,
    ReactiveFormsModule,
    MatChip
  ],
  template: `
    <div class="modal-header">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <mat-icon class="text-yellow-600">{{ data.esEdicion ? 'edit' : 'emoji_events' }}</mat-icon>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ data.esEdicion ? 'Editar Recompensa' : 'Nueva Recompensa' }}
            </h2>
            <p class="text-gray-600 text-sm mt-1">
              {{ data.esEdicion ? 'Modifica los datos de la recompensa' : 'Crea una recompensa para motivar a tus estudiantes' }}
            </p>
          </div>
        </div>
        <button mat-icon-button (click)="cerrar()" class="text-gray-400 hover:text-gray-600">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <div class="modal-content p-6 max-h-96 overflow-y-auto">
      
      <!-- Stepper -->
      <mat-stepper [linear]="true" #stepper>
        
        <!-- Paso 1: Información Básica -->
        <mat-step [stepControl]="informacionForm" label="Información Básica">
          <form [formGroup]="informacionForm">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <!-- Nombre -->
              <mat-form-field appearance="outline" class="col-span-1 md:col-span-2">
                <mat-label>Nombre de la Recompensa *</mat-label>
                <input matInput 
                       formControlName="nombre" 
                       placeholder="Ej: Estrella de Participación">
                <mat-error *ngIf="informacionForm.get('nombre')?.hasError('required')">
                  El nombre es requerido
                </mat-error>
              </mat-form-field>

              <!-- Tipo -->
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Recompensa *</mat-label>
                <mat-select formControlName="tipo" (selectionChange)="onTipoChange($event)">
                  <mat-option *ngFor="let tipo of data.tiposRecompensa" [value]="tipo.value">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-sm" [style.color]="tipo.color">{{ tipo.icon }}</mat-icon>
                      <span>{{ tipo.label }}</span>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="informacionForm.get('tipo')?.hasError('required')">
                  Seleccione el tipo de recompensa
                </mat-error>
              </mat-form-field>

              <!-- Categoría -->
              <mat-form-field appearance="outline">
                <mat-label>Categoría *</mat-label>
                <mat-select formControlName="categoria">
                  <mat-option *ngFor="let categoria of data.categoriasRecompensa" [value]="categoria.value">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-sm">{{ categoria.icon }}</mat-icon>
                      <span>{{ categoria.label }}</span>
                    </div>
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="informacionForm.get('categoria')?.hasError('required')">
                  Seleccione la categoría
                </mat-error>
              </mat-form-field>

              <!-- Valor/Puntos -->
              <mat-form-field appearance="outline">
                <mat-label>{{ getValorLabel() }} *</mat-label>
                <input matInput 
                       type="number" 
                       formControlName="valor" 
                       [placeholder]="getValorPlaceholder()"
                       min="1">
                <mat-error *ngIf="informacionForm.get('valor')?.hasError('required')">
                  El valor es requerido
                </mat-error>
                <mat-error *ngIf="informacionForm.get('valor')?.hasError('min')">
                  El valor debe ser mayor a 0
                </mat-error>
              </mat-form-field>

              <!-- Asignatura -->
              <mat-form-field appearance="outline">
                <mat-label>Asignatura *</mat-label>
                <mat-select formControlName="asignatura" (selectionChange)="onAsignaturaChange($event)">
                  <mat-option *ngFor="let asignatura of data.asignaturas" [value]="asignatura.id">
                    {{ asignatura.nombre }} ({{ asignatura.codigo }})
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="informacionForm.get('asignatura')?.hasError('required')">
                  Seleccione la asignatura
                </mat-error>
              </mat-form-field>

            </div>

            <!-- Descripción -->
            <mat-form-field appearance="outline" class="w-full mb-6">
              <mat-label>Descripción *</mat-label>
              <textarea matInput 
                        formControlName="descripcion" 
                        rows="3"
                        placeholder="Describe cuándo y por qué se otorga esta recompensa..."></textarea>
              <mat-hint>Explica claramente los criterios para obtener esta recompensa</mat-hint>
              <mat-error *ngIf="informacionForm.get('descripcion')?.hasError('required')">
                La descripción es requerida
              </mat-error>
            </mat-form-field>

            <!-- Evento Asociado (Opcional) -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Evento Asociado (Opcional)</mat-label>
              <mat-select formControlName="eventoAsociado">
                <mat-option value="">Sin evento específico</mat-option>
                <mat-option *ngFor="let evento of eventosDisponibles" [value]="evento.id">
                  {{ evento.nombre }}
                </mat-option>
              </mat-select>
              <mat-hint>Asocia la recompensa a un evento específico</mat-hint>
            </mat-form-field>

            <div class="flex justify-end mt-6">
              <button mat-raised-button color="primary" matStepperNext [disabled]="informacionForm.invalid">
                Siguiente
                <mat-icon class="ml-2">navigate_next</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 2: Criterios -->
        <mat-step [stepControl]="criteriosForm" label="Criterios">
          <form [formGroup]="criteriosForm">
            
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Criterios para Obtener la Recompensa</h4>
              <p class="text-gray-600 text-sm mb-4">
                Define los requisitos que deben cumplir los estudiantes para recibir esta recompensa.
              </p>
              
              <div formArrayName="criterios" class="space-y-4">
                <div *ngFor="let criterio of criterios.controls; let i = index" 
                     [formGroupName]="i" 
                     class="criterion-item p-4 border border-gray-200 rounded-lg">
                  
                  <div class="flex items-center justify-between mb-3">
                    <h5 class="font-medium text-gray-900">Criterio {{ i + 1 }}</h5>
                    <div class="flex items-center gap-2">
                      <mat-slide-toggle formControlName="obligatorio" color="primary" size="small">
                        <span class="text-sm">Obligatorio</span>
                      </mat-slide-toggle>
                      <button mat-icon-button 
                              type="button" 
                              (click)="eliminarCriterio(i)"
                              [disabled]="criterios.length <= 1"
                              class="text-red-500">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <!-- Tipo de Criterio -->
                    <mat-form-field appearance="outline">
                      <mat-label>Tipo de Criterio</mat-label>
                      <mat-select formControlName="tipo">
                        <mat-option value="asistencia">Asistencia (%)</mat-option>
                        <mat-option value="nota_minima">Nota Mínima</mat-option>
                        <mat-option value="participacion">Participaciones</mat-option>
                        <mat-option value="entrega_temprana">Entrega Temprana</mat-option>
                        <mat-option value="trabajo_grupal">Trabajo en Grupo</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <!-- Valor -->
                    <mat-form-field appearance="outline">
                      <mat-label>Valor Requerido</mat-label>
                      <input matInput 
                             type="number" 
                             formControlName="valor"
                             [placeholder]="getPlaceholderCriterio(criterio.get('tipo')?.value)">
                    </mat-form-field>

                    <!-- Descripción del Criterio -->
                    <mat-form-field appearance="outline">
                      <mat-label>Descripción</mat-label>
                      <input matInput 
                             formControlName="descripcion"
                             placeholder="Describe el criterio...">
                    </mat-form-field>

                  </div>
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <button mat-stroked-button 
                        type="button" 
                        (click)="agregarCriterio()"
                        class="flex items-center gap-2">
                  <mat-icon>add</mat-icon>
                  Agregar Criterio
                </button>
              </div>
            </div>

            <div class="flex justify-between">
              <button mat-button matStepperPrevious>
                <mat-icon class="mr-2">navigate_before</mat-icon>
                Anterior
              </button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="criteriosForm.invalid">
                Siguiente
                <mat-icon class="ml-2">navigate_next</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 3: Configuración -->
        <mat-step [stepControl]="configuracionForm" label="Configuración">
          <form [formGroup]="configuracionForm">
            
            <!-- Disponibilidad -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Disponibilidad</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Cantidad Disponible -->
                <mat-form-field appearance="outline">
                  <mat-label>Cantidad Disponible</mat-label>
                  <input matInput 
                         type="number" 
                         formControlName="cantidadDisponible"
                         placeholder="Ej: 50"
                         min="1">
                  <mat-hint>Deja vacío para cantidad ilimitada</mat-hint>
                </mat-form-field>

                <!-- Fecha de Vencimiento -->
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Vencimiento</mat-label>
                  <input matInput 
                         [matDatepicker]="pickerVencimiento" 
                         formControlName="fechaVencimiento"
                         [min]="fechaMinima">
                  <mat-datepicker-toggle matSuffix [for]="pickerVencimiento"></mat-datepicker-toggle>
                  <mat-datepicker #pickerVencimiento></mat-datepicker>
                  <mat-hint>Opcional - fecha límite para otorgar la recompensa</mat-hint>
                </mat-form-field>

              </div>
            </div>

            <!-- Personalización Visual -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Personalización Visual</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <!-- Icono -->
                <mat-form-field appearance="outline">
                  <mat-label>Icono</mat-label>
                  <mat-select formControlName="icono">
                    <mat-option value="star">⭐ Estrella</mat-option>
                    <mat-option value="trophy">🏆 Trofeo</mat-option>
                    <mat-option value="medal">🏅 Medalla</mat-option>
                    <mat-option value="crown">👑 Corona</mat-option>
                    <mat-option value="diamond">💎 Diamante</mat-option>
                    <mat-option value="fire">🔥 Fuego</mat-option>
                    <mat-option value="lightning">⚡ Rayo</mat-option>
                    <mat-option value="heart">❤️ Corazón</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Color -->
                <mat-form-field appearance="outline">
                  <mat-label>Color</mat-label>
                  <mat-select formControlName="color">
                    <mat-option value="#f59e0b">🟡 Amarillo</mat-option>
                    <mat-option value="#10b981">🟢 Verde</mat-option>
                    <mat-option value="#3b82f6">🔵 Azul</mat-option>
                    <mat-option value="#8b5cf6">🟣 Morado</mat-option>
                    <mat-option value="#ef4444">🔴 Rojo</mat-option>
                    <mat-option value="#f97316">🟠 Naranja</mat-option>
                  </mat-select>
                </mat-form-field>

              </div>

              <!-- Vista Previa -->
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <h5 class="text-sm font-medium text-gray-700 mb-2">Vista Previa:</h5>
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center"
                       [style.background-color]="(configuracionForm.get('color')?.value || '#f59e0b') + '20'"
                       [style.border]="'2px solid ' + (configuracionForm.get('color')?.value || '#f59e0b')">
                    <span class="text-xl">{{ getIconoPreview() }}</span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ informacionForm.get('nombre')?.value || 'Nombre de la Recompensa' }}</div>
                    <div class="text-sm text-gray-500">{{ informacionForm.get('valor')?.value || 0 }} puntos</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between">
              <button mat-button matStepperPrevious>
                <mat-icon class="mr-2">navigate_before</mat-icon>
                Anterior
              </button>
              <button mat-raised-button color="primary" matStepperNext>
                Revisar
                <mat-icon class="ml-2">navigate_next</mat-icon>
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Paso 4: Resumen -->
        <mat-step label="Resumen">
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Resumen de la Recompensa</h4>
            
            <div class="bg-gray-50 rounded-lg p-6 space-y-4">
              
              <!-- Vista previa de la recompensa -->
              <div class="flex items-center gap-4 p-4 bg-white rounded-lg border">
                <div class="w-16 h-16 rounded-full flex items-center justify-center"
                     [style.background-color]="(configuracionForm.get('color')?.value || '#f59e0b') + '20'"
                     [style.border]="'2px solid ' + (configuracionForm.get('color')?.value || '#f59e0b')">
                  <span class="text-2xl">{{ getIconoPreview() }}</span>
                </div>
                <div class="flex-1">
                  <h5 class="text-lg font-semibold text-gray-900">{{ informacionForm.get('nombre')?.value }}</h5>
                  <p class="text-gray-600 text-sm">{{ informacionForm.get('descripcion')?.value }}</p>
                  <div class="flex items-center gap-4 mt-2">
                    <span class="text-sm text-gray-500">
                      {{ getTipoLabel() }} • {{ informacionForm.get('valor')?.value }} {{ getValorUnidad() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Criterios -->
              <div>
                <h5 class="font-medium text-gray-900 mb-2">Criterios ({{ criterios.length }})</h5>
                <div class="space-y-2">
                  <div *ngFor="let criterio of criterios.controls" 
                       class="flex items-center gap-2 text-sm">
                    <mat-icon class="text-xs" [class.text-red-500]="criterio.get('obligatorio')?.value">
                      {{ criterio.get('obligatorio')?.value ? 'priority_high' : 'info' }}
                    </mat-icon>
                    <span>{{ criterio.get('descripcion')?.value || 'Criterio sin descripción' }}</span>
                    <mat-chip *ngIf="criterio.get('obligatorio')?.value" 
                              size="small" 
                              color="warn">
                      Obligatorio
                    </mat-chip>
                  </div>
                </div>
              </div>

              <!-- Configuración -->
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Cantidad disponible:</span>
                  <div class="font-medium">
                    {{ configuracionForm.get('cantidadDisponible')?.value || 'Ilimitada' }}
                  </div>
                </div>
                <div>
                  <span class="text-gray-600">Vigencia:</span>
                  <div class="font-medium">
                    {{ configuracionForm.get('fechaVencimiento')?.value ? 
                        (configuracionForm.get('fechaVencimiento')?.value | date:'dd/MM/yyyy') : 
                        'Sin vencimiento' }}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="flex justify-between">
            <button mat-button matStepperPrevious>
              <mat-icon class="mr-2">navigate_before</mat-icon>
              Anterior
            </button>
            <button mat-raised-button 
                    color="primary" 
                    (click)="onSubmit()"
                    [disabled]="isLoading">
              <mat-icon *ngIf="isLoading" class="animate-spin mr-2">refresh</mat-icon>
              <mat-icon *ngIf="!isLoading" class="mr-2">save</mat-icon>
              {{ isLoading ? 'Guardando...' : (data.esEdicion ? 'Actualizar Recompensa' : 'Crear Recompensa') }}
            </button>
          </div>
        </mat-step>

      </mat-stepper>
    </div>
  `,
  styles: [`
    .modal-header {
      background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
    }

    .modal-content {
      max-height: 80vh;
    }

    .criterion-item {
      background: #f8fafc;
      transition: all 0.2s ease;
    }

    .criterion-item:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    /* Stepper customization */
    ::ng-deep .mat-stepper-horizontal {
      margin-bottom: 24px;
    }

    ::ng-deep .mat-stepper-header {
      padding: 12px 24px;
    }

    ::ng-deep .mat-step-header .mat-step-icon {
      background-color: #eab308;
    }

    ::ng-deep .mat-step-header .mat-step-icon-selected {
      background-color: #d97706;
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
      .grid.grid-cols-1.md\\:grid-cols-2,
      .grid.grid-cols-1.md\\:grid-cols-3 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegistrarRecompensaModalComponent implements OnInit {
  informacionForm: FormGroup;
  criteriosForm: FormGroup;
  configuracionForm: FormGroup;

  isLoading = false;
  fechaMinima = new Date();
  eventosDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistrarRecompensaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RegistrarRecompensaData
  ) {
    // Formularios
    this.informacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', Validators.required],
      categoria: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(1)]],
      asignatura: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      eventoAsociado: ['']
    });

    this.criteriosForm = this.fb.group({
      criterios: this.fb.array([])
    });

    this.configuracionForm = this.fb.group({
      cantidadDisponible: [''],
      fechaVencimiento: [''],
      icono: ['star'],
      color: ['#f59e0b']
    });
  }

  ngOnInit(): void {
    // Agregar un criterio por defecto
    this.agregarCriterio();

    // Si es edición, cargar datos
    if (this.data.esEdicion && this.data.recompensa) {
      this.cargarDatosRecompensa();
    }
  }

  get criterios(): FormArray {
    return this.criteriosForm.get('criterios') as FormArray;
  }

  cargarDatosRecompensa(): void {
    const recompensa = this.data.recompensa;

    this.informacionForm.patchValue({
      nombre: recompensa.nombre,
      tipo: recompensa.tipo,
      categoria: recompensa.categoria,
      valor: recompensa.valor,
      asignatura: recompensa.asignatura.id,
      descripcion: recompensa.descripcion,
      eventoAsociado: recompensa.eventoAsociado?.id || ''
    });

    this.configuracionForm.patchValue({
      cantidadDisponible: recompensa.cantidadDisponible,
      fechaVencimiento: recompensa.fechaVencimiento ? new Date(recompensa.fechaVencimiento) : null,
      icono: recompensa.icono || 'star',
      color: recompensa.color || '#f59e0b'
    });

    // Cargar criterios
    this.criterios.clear();
    recompensa.criterios.forEach((criterio: any) => {
      this.criterios.push(this.fb.group({
        tipo: [criterio.tipo],
        valor: [criterio.valor],
        descripcion: [criterio.descripcion],
        obligatorio: [criterio.obligatorio]
      }));
    });
  }

  onTipoChange(event: any): void {
    // Lógica adicional según el tipo seleccionado
  }

  onAsignaturaChange(event: any): void {
    // Filtrar eventos por asignatura
    this.eventosDisponibles = this.data.eventos.filter(evento =>
      evento.asignaturaId === event.value
    );
  }

  agregarCriterio(): void {
    const criterio = this.fb.group({
      tipo: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0)]],
      descripcion: ['', Validators.required],
      obligatorio: [false]
    });

    this.criterios.push(criterio);
  }

  eliminarCriterio(index: number): void {
    if (this.criterios.length > 1) {
      this.criterios.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.sonFormulariosValidos()) {
      this.isLoading = true;

      setTimeout(() => {
        const recompensaData = this.construirRecompensaData();
        this.isLoading = false;
        this.dialogRef.close(recompensaData);
      }, 2000);
    }
  }

  sonFormulariosValidos(): boolean {
    return this.informacionForm.valid &&
      this.criteriosForm.valid &&
      this.configuracionForm.valid;
  }

  construirRecompensaData(): any {
    return {
      ...this.informacionForm.value,
      ...this.configuracionForm.value,
      criterios: this.criterios.value,
      id: this.data.recompensa?.id || 0
    };
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  // Métodos de utilidad
  getValorLabel(): string {
    const tipo = this.informacionForm.get('tipo')?.value;
    switch (tipo) {
      case 'puntos': return 'Puntos';
      case 'descuento': return 'Porcentaje de Descuento';
      default: return 'Valor';
    }
  }

  getValorPlaceholder(): string {
    const tipo = this.informacionForm.get('tipo')?.value;
    switch (tipo) {
      case 'puntos': return 'Ej: 100';
      case 'descuento': return 'Ej: 15';
      default: return 'Ej: 1';
    }
  }

  getValorUnidad(): string {
    const tipo = this.informacionForm.get('tipo')?.value;
    switch (tipo) {
      case 'puntos': return 'puntos';
      case 'descuento': return '% descuento';
      default: return 'unidades';
    }
  }

  getTipoLabel(): string {
    const tipo = this.informacionForm.get('tipo')?.value;
    const tipoInfo = this.data.tiposRecompensa.find(t => t.value === tipo);
    return tipoInfo ? tipoInfo.label : tipo;
  }

  getPlaceholderCriterio(tipo: string): string {
    switch (tipo) {
      case 'asistencia': return 'Ej: 85';
      case 'nota_minima': return 'Ej: 16';
      case 'participacion': return 'Ej: 3';
      case 'entrega_temprana': return 'Ej: 1';
      case 'trabajo_grupal': return 'Ej: 1';
      default: return 'Valor';
    }
  }

  getIconoPreview(): string {
    const icono = this.configuracionForm.get('icono')?.value;
    const iconMap: { [key: string]: string } = {
      'star': '⭐',
      'trophy': '🏆',
      'medal': '🏅',
      'crown': '👑',
      'diamond': '💎',
      'fire': '🔥',
      'lightning': '⚡',
      'heart': '❤️'
    };
    return iconMap[icono] || '⭐';
  }
}