// src/app/components/profesor/profesor-estudiantes/profesor-estudiantes.component.ts
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
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDivider } from '@angular/material/divider';

interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  ciclo: number;
  carrera: string;
  promedio: number;
  creditos: number;
  estado: 'activo' | 'inactivo' | 'suspendido';
  fechaIngreso: Date;
  telefono?: string;
  avatar?: string;
  asignaturas: string[];
}

@Component({
  selector: 'app-profesor-estudiantes',
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
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatDivider
  ],
  templateUrl: './profesor-estudiantes.component.html',
  styleUrls: ['./profesor-estudiantes.component.css']
})
export class ProfesorEstudiantesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['estudiante', 'carrera', 'promedio', 'creditos', 'estado', 'asignaturas', 'acciones'];
  dataSource = new MatTableDataSource<Estudiante>();
  filterForm: FormGroup;

  // Stats
  totalEstudiantes = 0;
  estudiantesActivos = 0;
  promedioGeneral = 0;
  nuevosEsteMes = 0;

  // Filter options
  carreras: string[] = ['Ingeniería de Sistemas', 'Ingeniería Industrial', 'Administración', 'Contabilidad', 'Marketing'];
  ciclos: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      carrera: [''],
      ciclo: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.calculateStats();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = this.createFilter();
  }

  loadEstudiantes(): void {
    // Aquí conectarías con tu servicio real
    const estudiantes: Estudiante[] = [
      {
        id: 1,
        nombres: 'Juan Carlos',
        apellidos: 'Pérez García',
        email: 'juan.perez@estudiante.edu',
        ciclo: 5,
        carrera: 'Ingeniería de Sistemas',
        promedio: 16.8,
        creditos: 145,
        estado: 'activo',
        fechaIngreso: new Date('2022-03-15'),
        telefono: '+51 999 888 777',
        asignaturas: ['Programación Web', 'Base de Datos', 'Redes', 'Algoritmos'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
      },
      {
        id: 2,
        nombres: 'María Elena',
        apellidos: 'Rodriguez López',
        email: 'maria.rodriguez@estudiante.edu',
        ciclo: 3,
        carrera: 'Administración',
        promedio: 14.2,
        creditos: 98,
        estado: 'activo',
        fechaIngreso: new Date('2023-08-20'),
        telefono: '+51 988 777 666',
        asignaturas: ['Marketing Digital', 'Contabilidad', 'Gestión'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
      },
      {
        id: 3,
        nombres: 'Carlos Antonio',
        apellidos: 'Mendoza Silva',
        email: 'carlos.mendoza@estudiante.edu',
        ciclo: 7,
        carrera: 'Ingeniería Industrial',
        promedio: 15.6,
        creditos: 178,
        estado: 'activo',
        fechaIngreso: new Date('2021-08-15'),
        telefono: '+51 977 666 555',
        asignaturas: ['Investigación de Operaciones', 'Calidad Total', 'Logística'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
      },
      {
        id: 4,
        nombres: 'Ana Sofía',
        apellidos: 'Torres Vega',
        email: 'ana.torres@estudiante.edu',
        ciclo: 2,
        carrera: 'Marketing',
        promedio: 13.8,
        creditos: 45,
        estado: 'activo',
        fechaIngreso: new Date('2024-03-10'),
        telefono: '+51 966 555 444',
        asignaturas: ['Fundamentos de Marketing', 'Comunicación', 'Estadística'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
      },
      {
        id: 5,
        nombres: 'Diego Fernando',
        apellidos: 'Quispe Mamani',
        email: 'diego.quispe@estudiante.edu',
        ciclo: 6,
        carrera: 'Contabilidad',
        promedio: 12.1,
        creditos: 156,
        estado: 'inactivo',
        fechaIngreso: new Date('2022-03-15'),
        telefono: '+51 955 444 333',
        asignaturas: ['Auditoria', 'Tributación', 'Costos'],
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego'
      }
    ];

    this.dataSource.data = estudiantes;
  }

  calculateStats(): void {
    const estudiantes = this.dataSource.data;
    this.totalEstudiantes = estudiantes.length;
    this.estudiantesActivos = estudiantes.filter(e => e.estado === 'activo').length;

    if (estudiantes.length > 0) {
      this.promedioGeneral = estudiantes.reduce((sum, e) => sum + e.promedio, 0) / estudiantes.length;
    }

    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    this.nuevosEsteMes = estudiantes.filter(e => e.fechaIngreso >= inicioMes).length;
  }

  createFilter(): (data: Estudiante, filter: string) => boolean {
    return (data: Estudiante, filter: string): boolean => {
      if (!filter) return true;

      const filters = JSON.parse(filter);
      const searchTerm = filters.search?.toLowerCase() || '';
      const carreraFilter = filters.carrera || '';
      const cicloFilter = filters.ciclo || '';
      const estadoFilter = filters.estado || '';

      const matchesSearch = !searchTerm ||
        data.nombres.toLowerCase().includes(searchTerm) ||
        data.apellidos.toLowerCase().includes(searchTerm) ||
        data.email.toLowerCase().includes(searchTerm) ||
        data.carrera.toLowerCase().includes(searchTerm);

      const matchesCarrera = !carreraFilter || data.carrera === carreraFilter;
      const matchesCiclo = !cicloFilter || data.ciclo === parseInt(cicloFilter);
      const matchesEstado = !estadoFilter || data.estado === estadoFilter;

      return matchesSearch && matchesCarrera && matchesCiclo && matchesEstado;
    };
  }

  applyFilter(): void {
    const filters = this.filterForm.value;
    this.dataSource.filter = JSON.stringify(filters);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  refreshData(): void {
    this.loadEstudiantes();
    this.calculateStats();
    this.snackBar.open('Datos actualizados correctamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  exportData(): void {
    // Implementar exportación
    this.snackBar.open('Funcionalidad de exportación en desarrollo', 'Cerrar', {
      duration: 3000
    });
  }

  // Utility methods
  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
  }

  getPromedioClass(promedio: number): string {
    if (promedio >= 17) return 'promedio-excelente';
    if (promedio >= 14) return 'promedio-bueno';
    if (promedio >= 11) return 'promedio-regular';
    return 'promedio-malo';
  }

  getEstadoColor(estado: string): 'primary' | 'accent' | 'warn' | undefined {
    switch (estado) {
      case 'activo': return 'primary';
      case 'inactivo': return 'accent';
      case 'suspendido': return 'warn';
      default: return undefined;
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'suspendido': return 'Suspendido';
      default: return estado;
    }
  }

  getTooltipAsignaturas(asignaturas: string[]): string {
    return asignaturas.join(', ');
  }

  // Action methods
  verDetalle(estudiante: Estudiante): void {

    // Implementar modal o navegación a detalle
    this.snackBar.open(`Ver detalle de ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  editarEstudiante(estudiante: Estudiante): void {

    // Implementar modal de edición
    this.snackBar.open(`Editar ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  verNotas(estudiante: Estudiante): void {

    // Navegar a vista de notas del estudiante
    this.snackBar.open(`Ver notas de ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  enviarMensaje(estudiante: Estudiante): void {

    // Implementar modal de mensaje
    this.snackBar.open(`Enviar mensaje a ${estudiante.nombres}`, 'Cerrar', {
      duration: 2000
    });
  }

  cambiarEstado(estudiante: Estudiante): void {

    // Implementar confirmación y cambio de estado
    const nuevoEstado = estudiante.estado === 'activo' ? 'suspendido' : 'activo';
    this.snackBar.open(`${estudiante.nombres} ${nuevoEstado}`, 'Cerrar', {
      duration: 3000
    });
  }

  nuevoEstudiante(): void {

    // Implementar modal de nuevo estudiante
    this.snackBar.open('Nuevo estudiante', 'Cerrar', {
      duration: 2000
    });
  }
}