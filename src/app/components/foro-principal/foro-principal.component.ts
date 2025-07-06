// src/app/components/shared/foro-principal/foro-principal.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';


interface ForoAsignatura {
  id: number;
  asignatura: {
    id: number;
    nombre: string;
    codigo: string;
    profesor: string;
    semestre: string;
  };
  estadisticas: {
    totalPublicaciones: number;
    publicacionesHoy: number;
    totalParticipantes: number;
    ultimaActividad: Date;
    recursosCompartidos: number;
  };
  ultimasPublicaciones: PublicacionResumen[];
  miParticipacion: {
    misPublicaciones: number;
    misRespuestas: number;
    ultimaVisita: Date;
  };
}

interface PublicacionResumen {
  id: number;
  titulo: string;
  autor: {
    nombre: string;
    tipo: 'estudiante' | 'profesor';
    avatar?: string;
  };
  fechaCreacion: Date;
  respuestas: number;
  recursos: number;
}

@Component({
  selector: 'app-foro-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './foro-principal.component.html',
  styleUrls: ['./foro-principal.component.css']
})
export class ForoPrincipalComponent implements OnInit {
  foros: ForoAsignatura[] = [];
  forosFiltrados: ForoAsignatura[] = [];
  filtroForm: FormGroup;
  userRole: string | null = null;

  // Estadísticas generales
  estadisticasGenerales = {
    totalForos: 0,
    forosActivos: 0,
    misPublicaciones: 0,
    publicacionesHoy: 0
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.filtroForm = this.fb.group({
      search: [''],
      semestre: [''],
      ordenar: ['ultima_actividad']
    });
  }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadForos();
    this.setupFiltros();
  }

  loadForos(): void {
    // Datos de ejemplo - conectar con tu servicio real
    const forosEjemplo: ForoAsignatura[] = [
      {
        id: 1,
        asignatura: {
          id: 1,
          nombre: 'Programación Web',
          codigo: 'CS-301',
          profesor: 'Prof. García López',
          semestre: '2024-II'
        },
        estadisticas: {
          totalPublicaciones: 45,
          publicacionesHoy: 3,
          totalParticipantes: 28,
          ultimaActividad: new Date('2024-12-10T14:30:00'),
          recursosCompartidos: 12
        },
        ultimasPublicaciones: [
          {
            id: 1,
            titulo: 'Ayuda con React Hooks',
            autor: {
              nombre: 'Juan Pérez',
              tipo: 'estudiante',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan'
            },
            fechaCreacion: new Date('2024-12-10T14:30:00'),
            respuestas: 5,
            recursos: 2
          },
          {
            id: 2,
            titulo: 'Recursos adicionales sobre JavaScript ES6',
            autor: {
              nombre: 'Prof. García',
              tipo: 'profesor',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Garcia'
            },
            fechaCreacion: new Date('2024-12-10T10:15:00'),
            respuestas: 8,
            recursos: 4
          }
        ],
        miParticipacion: {
          misPublicaciones: 3,
          misRespuestas: 8,
          ultimaVisita: new Date('2024-12-09T16:20:00')
        }
      },
      {
        id: 2,
        asignatura: {
          id: 2,
          nombre: 'Base de Datos',
          codigo: 'CS-302',
          profesor: 'Prof. Martínez Silva',
          semestre: '2024-II'
        },
        estadisticas: {
          totalPublicaciones: 32,
          publicacionesHoy: 1,
          totalParticipantes: 25,
          ultimaActividad: new Date('2024-12-10T11:45:00'),
          recursosCompartidos: 8
        },
        ultimasPublicaciones: [
          {
            id: 3,
            titulo: 'Normalización de bases de datos - Ejercicios',
            autor: {
              nombre: 'María Rodriguez',
              tipo: 'estudiante',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria'
            },
            fechaCreacion: new Date('2024-12-10T11:45:00'),
            respuestas: 3,
            recursos: 1
          },
          {
            id: 4,
            titulo: 'Consultas SQL avanzadas - Ejemplos prácticos',
            autor: {
              nombre: 'Prof. Martínez',
              tipo: 'profesor',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Martinez'
            },
            fechaCreacion: new Date('2024-12-09T15:30:00'),
            respuestas: 12,
            recursos: 3
          }
        ],
        miParticipacion: {
          misPublicaciones: 2,
          misRespuestas: 5,
          ultimaVisita: new Date('2024-12-08T14:10:00')
        }
      },
      {
        id: 3,
        asignatura: {
          id: 3,
          nombre: 'Redes de Computadoras',
          codigo: 'CS-303',
          profesor: 'Prof. Torres Vega',
          semestre: '2024-II'
        },
        estadisticas: {
          totalPublicaciones: 28,
          publicacionesHoy: 0,
          totalParticipantes: 22,
          ultimaActividad: new Date('2024-12-09T16:20:00'),
          recursosCompartidos: 6
        },
        ultimasPublicaciones: [
          {
            id: 5,
            titulo: 'Configuración de routers Cisco',
            autor: {
              nombre: 'Carlos Mendoza',
              tipo: 'estudiante',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
            },
            fechaCreacion: new Date('2024-12-09T16:20:00'),
            respuestas: 4,
            recursos: 2
          }
        ],
        miParticipacion: {
          misPublicaciones: 1,
          misRespuestas: 3,
          ultimaVisita: new Date('2024-12-07T13:15:00')
        }
      }
    ];

    this.foros = forosEjemplo;
    this.forosFiltrados = [...forosEjemplo];
    this.calcularEstadisticasGenerales();
  }

  setupFiltros(): void {
    this.filtroForm.valueChanges.subscribe(() => {
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const { search, semestre, ordenar } = this.filtroForm.value;
    let filtrados = [...this.foros];

    // Filtro por búsqueda
    if (search) {
      const searchTerm = search.toLowerCase();
      filtrados = filtrados.filter(foro =>
        foro.asignatura.nombre.toLowerCase().includes(searchTerm) ||
        foro.asignatura.codigo.toLowerCase().includes(searchTerm) ||
        foro.asignatura.profesor.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por semestre
    if (semestre) {
      filtrados = filtrados.filter(foro => foro.asignatura.semestre === semestre);
    }

    // Ordenamiento
    switch (ordenar) {
      case 'ultima_actividad':
        filtrados.sort((a, b) => b.estadisticas.ultimaActividad.getTime() - a.estadisticas.ultimaActividad.getTime());
        break;
      case 'mas_publicaciones':
        filtrados.sort((a, b) => b.estadisticas.totalPublicaciones - a.estadisticas.totalPublicaciones);
        break;
      case 'mas_participantes':
        filtrados.sort((a, b) => b.estadisticas.totalParticipantes - a.estadisticas.totalParticipantes);
        break;
      case 'alfabetico':
        filtrados.sort((a, b) => a.asignatura.nombre.localeCompare(b.asignatura.nombre));
        break;
    }

    this.forosFiltrados = filtrados;
  }

  calcularEstadisticasGenerales(): void {
    this.estadisticasGenerales.totalForos = this.foros.length;
    this.estadisticasGenerales.forosActivos = this.foros.filter(f =>
      this.esActivoHoy(f.estadisticas.ultimaActividad)
    ).length;
    this.estadisticasGenerales.misPublicaciones = this.foros.reduce((sum, f) =>
      sum + f.miParticipacion.misPublicaciones, 0
    );
    this.estadisticasGenerales.publicacionesHoy = this.foros.reduce((sum, f) =>
      sum + f.estadisticas.publicacionesHoy, 0
    );
  }

  // Navegación
  irAForo(foro: ForoAsignatura): void {
    const ruta = this.userRole === 'ROLE_ESTUDIANTE'
      ? `/dashboard-estudiante/foro/${foro.asignatura.id}`
      : `/dashboard-profesor/foro/${foro.asignatura.id}`;

    this.router.navigate([ruta]);
  }

  // Métodos de utilidad
  esActivoHoy(fecha: Date): boolean {
    const hoy = new Date();
    const fechaActividad = new Date(fecha);
    return fechaActividad.toDateString() === hoy.toDateString();
  }

  esNuevaActividad(fecha: Date): boolean {
    const ahora = new Date();
    const diferencia = ahora.getTime() - new Date(fecha).getTime();
    const horas = diferencia / (1000 * 60 * 60);
    return horas <= 2; // Actividad en las últimas 2 horas
  }

  formatearTiempoRelativo(fecha: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - new Date(fecha).getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (minutos < 60) {
      return `Hace ${minutos} min`;
    } else if (horas < 24) {
      return `Hace ${horas}h`;
    } else if (dias < 7) {
      return `Hace ${dias}d`;
    } else {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  }

  getDefaultAvatar(nombre: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nombre)}`;
  }

  getActividadClass(fecha: Date): string {
    if (this.esActivoHoy(fecha)) {
      return 'actividad-hoy';
    } else if (this.esNuevaActividad(fecha)) {
      return 'actividad-reciente';
    }
    return 'actividad-normal';
  }

  getSemestresDisponibles(): string[] {
    const semestres = [...new Set(this.foros.map(f => f.asignatura.semestre))];
    return semestres.sort().reverse();
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      search: '',
      semestre: '',
      ordenar: 'ultima_actividad'
    });
  }

  // Acciones rápidas
  crearPublicacionRapida(foro: ForoAsignatura): void {
    this.snackBar.open(`Crear publicación en ${foro.asignatura.nombre}`, 'Cerrar', {
      duration: 2000
    });
    // Navegar al foro con modal abierto
    this.irAForo(foro);
  }

  marcarComoVisitado(foro: ForoAsignatura): void {
    foro.miParticipacion.ultimaVisita = new Date();
  }
}