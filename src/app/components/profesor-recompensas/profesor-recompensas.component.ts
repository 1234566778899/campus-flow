// src/app/components/profesor/profesor-recompensas/profesor-recompensas.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RegistrarRecompensaModalComponent } from './registrar-recompensa-modal.component';
import { AsignarRecompensaModalComponent } from './asignar-recompensa-modal.component';


interface Recompensa {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'puntos' | 'insignia' | 'certificado' | 'privilegio' | 'descuento' | 'material';
  categoria: 'participacion' | 'excelencia' | 'mejora' | 'liderazgo' | 'creatividad' | 'puntualidad';
  valor: number; // Puntos o valor numérico
  icono: string;
  color: string;
  criterios: CriterioRecompensa[];
  eventoAsociado?: {
    id: number;
    nombre: string;
    tipo: string;
  };
  asignatura: {
    id: number;
    nombre: string;
    codigo: string;
  };
  estado: 'activa' | 'inactiva' | 'agotada';
  cantidadDisponible?: number;
  cantidadUsada: number;
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  createdBy: string;
}

interface CriterioRecompensa {
  id: number;
  tipo: 'asistencia' | 'nota_minima' | 'participacion' | 'entrega_temprana' | 'trabajo_grupal';
  descripcion: string;
  valor: number; // Valor requerido (ej: 90% asistencia, nota >= 16)
  obligatorio: boolean;
}

interface EstudianteRecompensa {
  id: number;
  estudiante: {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    avatar?: string;
  };
  recompensa: Recompensa;
  evento?: {
    id: number;
    nombre: string;
  };
  fechaOtorgada: Date;
  motivo: string;
  estado: 'otorgada' | 'canjeada' | 'expirada';
  valorObtenido?: number; // Para tracking de criterios
}

interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  estudiantesMatriculados: number;
}

@Component({
  selector: 'app-profesor-recompensas',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './profesor-recompensas.component.html',
  styleUrls: ['./profesor-recompensas.component.css']
})
export class ProfesorRecompensasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Datos
  recompensas: Recompensa[] = [];
  asignaciones: EstudianteRecompensa[] = [];
  asignaturas: Asignatura[] = [];
  eventos: any[] = [];

  // Data sources para las tablas
  recompensasDataSource = new MatTableDataSource<Recompensa>();
  asignacionesDataSource = new MatTableDataSource<EstudianteRecompensa>();

  // Formularios
  filtroRecompensasForm: FormGroup;
  filtroAsignacionesForm: FormGroup;

  // Configuración de tablas
  recompensasColumns: string[] = ['recompensa', 'tipo', 'criterios', 'evento', 'estadisticas', 'estado', 'acciones'];
  asignacionesColumns: string[] = ['estudiante', 'recompensa', 'evento', 'fecha', 'estado', 'acciones'];

  // Estadísticas
  estadisticas = {
    totalRecompensas: 0,
    recompensasActivas: 0,
    totalAsignaciones: 0,
    estudiantesRecompensados: 0,
    recompensasMasUsadas: [] as any[]
  };

  // Opciones de filtro
  tiposRecompensa = [
    { value: 'puntos', label: 'Puntos', icon: 'stars', color: '#f59e0b' },
    { value: 'insignia', label: 'Insignia', icon: 'military_tech', color: '#8b5cf6' },
    { value: 'certificado', label: 'Certificado', icon: 'workspace_premium', color: '#10b981' },
    { value: 'privilegio', label: 'Privilegio', icon: 'verified_user', color: '#3b82f6' },
    { value: 'descuento', label: 'Descuento', icon: 'local_offer', color: '#ef4444' },
    { value: 'material', label: 'Material', icon: 'redeem', color: '#f97316' }
  ];

  categoriasRecompensa = [
    { value: 'participacion', label: 'Participación', icon: 'forum' },
    { value: 'excelencia', label: 'Excelencia', icon: 'grade' },
    { value: 'mejora', label: 'Mejora', icon: 'trending_up' },
    { value: 'liderazgo', label: 'Liderazgo', icon: 'groups' },
    { value: 'creatividad', label: 'Creatividad', icon: 'lightbulb' },
    { value: 'puntualidad', label: 'Puntualidad', icon: 'schedule' }
  ];

  estadosRecompensa = [
    { value: 'activa', label: 'Activa', color: 'primary' },
    { value: 'inactiva', label: 'Inactiva', color: 'accent' },
    { value: 'agotada', label: 'Agotada', color: 'warn' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filtroRecompensasForm = this.fb.group({
      search: [''],
      asignatura: [''],
      tipo: [''],
      categoria: [''],
      estado: ['']
    });

    this.filtroAsignacionesForm = this.fb.group({
      searchEstudiante: [''],
      recompensa: [''],
      evento: [''],
      fechaDesde: [''],
      fechaHasta: ['']
    });
  }

  ngOnInit(): void {
    this.loadAsignaturas();
    this.loadEventos();
    this.loadRecompensas();
    this.loadAsignaciones();
    this.setupFormSubscriptions();
  }

  ngAfterViewInit(): void {
    this.recompensasDataSource.paginator = this.paginator;
    this.recompensasDataSource.sort = this.sort;
    this.setupFilters();
  }

  loadAsignaturas(): void {
    // Datos de ejemplo - conectar con tu servicio real
    this.asignaturas = [
      {
        id: 1,
        nombre: 'Programación Web',
        codigo: 'CS-301',
        estudiantesMatriculados: 28
      },
      {
        id: 2,
        nombre: 'Base de Datos',
        codigo: 'CS-302',
        estudiantesMatriculados: 25
      },
      {
        id: 3,
        nombre: 'Redes de Computadoras',
        codigo: 'CS-303',
        estudiantesMatriculados: 22
      }
    ];
  }

  loadEventos(): void {
    // Datos de ejemplo de eventos disponibles
    this.eventos = [
      { id: 1, nombre: 'Examen Parcial - Programación Web', tipo: 'examen' },
      { id: 2, nombre: 'Proyecto Final - Base de Datos', tipo: 'proyecto' },
      { id: 3, nombre: 'Taller de Redes', tipo: 'actividad' }
    ];
  }

  loadRecompensas(): void {
    // Datos de ejemplo - conectar con tu servicio real
    const recompensasEjemplo: Recompensa[] = [
      {
        id: 1,
        nombre: 'Estrella de Participación',
        descripcion: 'Otorgada por participación activa en clase y eventos',
        tipo: 'insignia',
        categoria: 'participacion',
        valor: 100,
        icono: 'star',
        color: '#f59e0b',
        criterios: [
          {
            id: 1,
            tipo: 'participacion',
            descripcion: 'Participar en al menos 3 discusiones',
            valor: 3,
            obligatorio: true
          },
          {
            id: 2,
            tipo: 'asistencia',
            descripcion: 'Asistencia mínima del 80%',
            valor: 80,
            obligatorio: true
          }
        ],
        eventoAsociado: {
          id: 1,
          nombre: 'Examen Parcial - Programación Web',
          tipo: 'examen'
        },
        asignatura: {
          id: 1,
          nombre: 'Programación Web',
          codigo: 'CS-301'
        },
        estado: 'activa',
        cantidadDisponible: 50,
        cantidadUsada: 12,
        fechaCreacion: new Date('2024-11-01'),
        fechaVencimiento: new Date('2024-12-31'),
        createdBy: 'Prof. García'
      },
      {
        id: 2,
        nombre: 'Certificado de Excelencia',
        descripcion: 'Para estudiantes con calificaciones sobresalientes',
        tipo: 'certificado',
        categoria: 'excelencia',
        valor: 500,
        icono: 'workspace_premium',
        color: '#10b981',
        criterios: [
          {
            id: 3,
            tipo: 'nota_minima',
            descripcion: 'Nota mínima de 18 puntos',
            valor: 18,
            obligatorio: true
          },
          {
            id: 4,
            tipo: 'entrega_temprana',
            descripcion: 'Entrega antes de la fecha límite',
            valor: 1,
            obligatorio: false
          }
        ],
        eventoAsociado: {
          id: 2,
          nombre: 'Proyecto Final - Base de Datos',
          tipo: 'proyecto'
        },
        asignatura: {
          id: 2,
          nombre: 'Base de Datos',
          codigo: 'CS-302'
        },
        estado: 'activa',
        cantidadDisponible: 10,
        cantidadUsada: 3,
        fechaCreacion: new Date('2024-10-15'),
        fechaVencimiento: new Date('2024-12-30'),
        createdBy: 'Prof. García'
      },
      {
        id: 3,
        nombre: 'Puntos de Mejora',
        descripcion: 'Recompensa por mostrar mejora significativa',
        tipo: 'puntos',
        categoria: 'mejora',
        valor: 200,
        icono: 'trending_up',
        color: '#3b82f6',
        criterios: [
          {
            id: 5,
            tipo: 'nota_minima',
            descripcion: 'Mejora de al menos 3 puntos respecto al anterior',
            valor: 3,
            obligatorio: true
          }
        ],
        asignatura: {
          id: 1,
          nombre: 'Programación Web',
          codigo: 'CS-301'
        },
        estado: 'activa',
        cantidadUsada: 8,
        fechaCreacion: new Date('2024-11-10'),
        createdBy: 'Prof. García'
      }
    ];

    this.recompensas = recompensasEjemplo;
    this.recompensasDataSource.data = recompensasEjemplo;
    this.calcularEstadisticas();
  }

  loadAsignaciones(): void {
    // Datos de ejemplo de asignaciones
    const asignacionesEjemplo: EstudianteRecompensa[] = [
      {
        id: 1,
        estudiante: {
          id: 1,
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
          email: 'juan.perez@estudiante.edu',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
        },
        recompensa: this.recompensas[0],
        evento: {
          id: 1,
          nombre: 'Examen Parcial - Programación Web'
        },
        fechaOtorgada: new Date('2024-12-01'),
        motivo: 'Excelente participación durante todo el semestre',
        estado: 'otorgada',
        valorObtenido: 95
      },
      {
        id: 2,
        estudiante: {
          id: 2,
          nombres: 'María Elena',
          apellidos: 'Rodriguez López',
          email: 'maria.rodriguez@estudiante.edu',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
        },
        recompensa: this.recompensas[1],
        evento: {
          id: 2,
          nombre: 'Proyecto Final - Base de Datos'
        },
        fechaOtorgada: new Date('2024-11-28'),
        motivo: 'Proyecto excepcional con calificación de 19',
        estado: 'otorgada',
        valorObtenido: 19
      },
      {
        id: 3,
        estudiante: {
          id: 3,
          nombres: 'Carlos Antonio',
          apellidos: 'Mendoza Silva',
          email: 'carlos.mendoza@estudiante.edu',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
        },
        recompensa: this.recompensas[2],
        fechaOtorgada: new Date('2024-12-02'),
        motivo: 'Mejora significativa en las últimas evaluaciones',
        estado: 'canjeada',
        valorObtenido: 4
      }
    ];

    this.asignaciones = asignacionesEjemplo;
    this.asignacionesDataSource.data = asignacionesEjemplo;
  }

  setupFormSubscriptions(): void {
    this.filtroRecompensasForm.valueChanges.subscribe(() => {
      this.applyRecompensasFilter();
    });

    this.filtroAsignacionesForm.valueChanges.subscribe(() => {
      this.applyAsignacionesFilter();
    });
  }

  setupFilters(): void {
    // Filtro para recompensas
    this.recompensasDataSource.filterPredicate = (data: Recompensa, filter: string) => {
      if (!filter) return true;

      const filters = JSON.parse(filter);
      const searchTerm = filters.search?.toLowerCase() || '';
      const asignaturaFilter = filters.asignatura || '';
      const tipoFilter = filters.tipo || '';
      const categoriaFilter = filters.categoria || '';
      const estadoFilter = filters.estado || '';

      const matchesSearch = !searchTerm ||
        data.nombre.toLowerCase().includes(searchTerm) ||
        data.descripcion.toLowerCase().includes(searchTerm);

      const matchesAsignatura = !asignaturaFilter || data.asignatura.id === asignaturaFilter;
      const matchesTipo = !tipoFilter || data.tipo === tipoFilter;
      const matchesCategoria = !categoriaFilter || data.categoria === categoriaFilter;
      const matchesEstado = !estadoFilter || data.estado === estadoFilter;

      return matchesSearch && matchesAsignatura && matchesTipo && matchesCategoria && matchesEstado;
    };

    // Filtro para asignaciones
    this.asignacionesDataSource.filterPredicate = (data: EstudianteRecompensa, filter: string) => {
      if (!filter) return true;

      const filters = JSON.parse(filter);
      const searchTerm = filters.searchEstudiante?.toLowerCase() || '';
      const recompensaFilter = filters.recompensa || '';
      const eventoFilter = filters.evento || '';

      const matchesSearch = !searchTerm ||
        data.estudiante.nombres.toLowerCase().includes(searchTerm) ||
        data.estudiante.apellidos.toLowerCase().includes(searchTerm) ||
        data.estudiante.email.toLowerCase().includes(searchTerm);

      const matchesRecompensa = !recompensaFilter || data.recompensa.id === recompensaFilter;
      const matchesEvento = !eventoFilter || data.evento?.id === eventoFilter;

      return matchesSearch && matchesRecompensa && matchesEvento;
    };
  }

  applyRecompensasFilter(): void {
    const filters = this.filtroRecompensasForm.value;
    this.recompensasDataSource.filter = JSON.stringify(filters);
  }

  applyAsignacionesFilter(): void {
    const filters = this.filtroAsignacionesForm.value;
    this.asignacionesDataSource.filter = JSON.stringify(filters);
  }

  clearRecompensasFilters(): void {
    this.filtroRecompensasForm.reset();
    this.recompensasDataSource.filter = '';
  }

  clearAsignacionesFilters(): void {
    this.filtroAsignacionesForm.reset();
    this.asignacionesDataSource.filter = '';
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalRecompensas = this.recompensas.length;
    this.estadisticas.recompensasActivas = this.recompensas.filter(r => r.estado === 'activa').length;
    this.estadisticas.totalAsignaciones = this.asignaciones.length;

    const estudiantesUnicos = new Set(this.asignaciones.map(a => a.estudiante.id));
    this.estadisticas.estudiantesRecompensados = estudiantesUnicos.size;

    // Recompensas más usadas
    const conteoRecompensas = this.recompensas.map(r => ({
      nombre: r.nombre,
      cantidadUsada: r.cantidadUsada,
      tipo: r.tipo
    })).sort((a, b) => b.cantidadUsada - a.cantidadUsada).slice(0, 5);

    this.estadisticas.recompensasMasUsadas = conteoRecompensas;
  }

  // Métodos de acciones
  nuevaRecompensa(): void {
    const dialogRef = this.dialog.open(RegistrarRecompensaModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: {
        asignaturas: this.asignaturas,
        eventos: this.eventos,
        tiposRecompensa: this.tiposRecompensa,
        categoriasRecompensa: this.categoriasRecompensa
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Recompensa creada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadRecompensas(); // Recargar datos
      }
    });
  }

  editarRecompensa(recompensa: Recompensa): void {
    const dialogRef = this.dialog.open(RegistrarRecompensaModalComponent, {
      width: '900px',
      maxHeight: '90vh',
      data: {
        recompensa: recompensa,
        asignaturas: this.asignaturas,
        eventos: this.eventos,
        tiposRecompensa: this.tiposRecompensa,
        categoriasRecompensa: this.categoriasRecompensa,
        esEdicion: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Recompensa actualizada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadRecompensas(); // Recargar datos
      }
    });
  }

  asignarRecompensa(recompensa?: Recompensa): void {
    const dialogRef = this.dialog.open(AsignarRecompensaModalComponent, {
      width: '800px',
      maxHeight: '90vh',
      data: {
        recompensa: recompensa,
        recompensas: this.recompensas.filter(r => r.estado === 'activa'),
        eventos: this.eventos,
        asignaturas: this.asignaturas
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Recompensa asignada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.loadAsignaciones(); // Recargar datos
      }
    });
  }

  cambiarEstadoRecompensa(recompensa: Recompensa, nuevoEstado: string): void {
    this.snackBar.open(`Estado cambiado a: ${nuevoEstado}`, 'Cerrar', {
      duration: 3000
    });
    // Aquí implementarías la llamada al servicio
  }

  duplicarRecompensa(recompensa: Recompensa): void {
    const recompensaDuplicada = {
      ...recompensa,
      id: 0,
      nombre: `${recompensa.nombre} (Copia)`,
      cantidadUsada: 0
    };
    this.editarRecompensa(recompensaDuplicada);
  }

  eliminarRecompensa(recompensa: Recompensa): void {
    // Implementar confirmación
    this.snackBar.open(`Recompensa "${recompensa.nombre}" eliminada`, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  verEstadisticasRecompensa(recompensa: Recompensa): void {
    this.snackBar.open(`Ver estadísticas de: ${recompensa.nombre}`, 'Cerrar', {
      duration: 2000
    });
  }

  revocarRecompensa(asignacion: EstudianteRecompensa): void {
    this.snackBar.open(`Recompensa revocada para ${asignacion.estudiante.nombres}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  // Métodos de utilidad
  getTipoInfo(tipo: string): any {
    return this.tiposRecompensa.find(t => t.value === tipo) || { label: tipo, icon: 'help', color: '#6b7280' };
  }

  getCategoriaInfo(categoria: string): any {
    return this.categoriasRecompensa.find(c => c.value === categoria) || { label: categoria, icon: 'help' };
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
    const estadoInfo = this.estadosRecompensa.find(e => e.value === estado);
    return estadoInfo ? estadoInfo.color as any : undefined;
  }

  getEstadoLabel(estado: string): string {
    const estadoInfo = this.estadosRecompensa.find(e => e.value === estado);
    return estadoInfo ? estadoInfo.label : estado;
  }

  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getProgresoCriterios(recompensa: Recompensa): number {
    // Simulación de progreso basado en criterios
    return Math.min(100, (recompensa.cantidadUsada / (recompensa.cantidadDisponible || 1)) * 100);
  }

  getCriteriosTexto(criterios: CriterioRecompensa[]): string {
    return criterios.map(c => c.descripcion).join(', ');
  }
}