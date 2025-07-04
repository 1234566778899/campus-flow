import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface TipoUsuario {
  id: string;
  titulo: string;
  descripcion: string;
  caracteristicas: string[];
  ruta: string;
  icono: string;
  gradiente: string;
  gradienteHover: string;
  colorBadge: string;
  textoBadge: string;
  colorCheck: string;
}

@Component({
  selector: 'app-registro-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './registro-selector.component.html',
  styleUrl: './registro-selector.component.css'
})
export class RegistroSelectorComponent {

  tiposUsuario: TipoUsuario[] = [
    {
      id: 'estudiante',
      titulo: 'Estudiante',
      descripcion: 'Accede a tu dashboard personalizado, gestiona tus tareas, revisa tus calificaciones y mantente conectado con tus profesores.',
      caracteristicas: [
        'Dashboard personalizado',
        'Gestión de tareas y horarios',
        'Seguimiento de calificaciones',
        'Sistema de recompensas'
      ],
      ruta: '/registrar-estudiante',
      icono: 'school',
      gradiente: 'from-green-500 to-blue-500',
      gradienteHover: 'from-green-600 to-blue-600',
      colorBadge: 'bg-green-100 text-green-800',
      textoBadge: 'Más popular',
      colorCheck: 'text-green-600'
    },
    {
      id: 'profesor',
      titulo: 'Profesor',
      descripcion: 'Gestiona tus clases, asigna tareas, evalúa estudiantes y mantén un seguimiento completo del progreso académico.',
      caracteristicas: [
        'Panel de control avanzado',
        'Gestión de clases y estudiantes',
        'Sistema de evaluación',
        'Reportes y estadísticas'
      ],
      ruta: '/registrar-profesor',
      icono: 'person',
      gradiente: 'from-purple-500 to-indigo-500',
      gradienteHover: 'from-purple-600 to-indigo-600',
      colorBadge: 'bg-purple-100 text-purple-800',
      textoBadge: 'Profesional',
      colorCheck: 'text-purple-600'
    }
  ];

  constructor(private router: Router) { }

  // Método para navegar a registro específico
  navegarARegistro(tipo: 'estudiante' | 'profesor'): void {
    const tipoSeleccionado = this.tiposUsuario.find(t => t.id === tipo);
    if (tipoSeleccionado) {
      this.router.navigate([tipoSeleccionado.ruta]);
    }
  }

  // Método para navegar al login
  navegarALogin(): void {
    this.router.navigate(['/login']);
  }

  // Métodos para navegación de ayuda
  mostrarAyuda(): void {
    // Implementar modal de ayuda o navegación
    console.log('Mostrar ayuda');
  }

  mostrarInformacion(): void {
    // Implementar modal de información sobre CampusFlow
    console.log('Mostrar información sobre CampusFlow');
  }

  contactarSoporte(): void {
    // Implementar contacto con soporte
    console.log('Contactar soporte');
  }

  // Método para obtener estadísticas (opcional)
  getEstadisticasRegistro() {
    return {
      totalUsuarios: '10,000+',
      estudiantes: '8,500+',
      profesores: '1,500+',
      instituciones: '150+'
    };
  }
}