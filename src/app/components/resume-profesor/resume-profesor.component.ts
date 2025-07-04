import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-profesor',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './resume-profesor.component.html',
  styleUrl: './resume-profesor.component.css'
})
export class ResumeProfesorComponent implements OnInit {
  fechaActual: Date = new Date();
  diasDelCalendario: any[] = [];

  // Propiedades para eventos del profesor (ej. eventos que imparte)
  proximosEventosImpartidos: any[] = []; // Placeholder para eventos del profesor

  // Propiedades para publicaciones del foro
  ultimasPublicacionesForo: any[] = []; // Placeholder para publicaciones del foro

  constructor() { }

  ngOnInit(): void {
    this.generarDiasDelCalendario();
    this.loadProfesorSpecificData(); // Cargar datos específicos del profesor
  }

  generarDiasDelCalendario(): void {
    const hoy = this.fechaActual;
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    const inicioSemana = primerDiaMes.getDay();

    let diaInicioOffset = inicioSemana === 0 ? 6 : inicioSemana - 1;

    this.diasDelCalendario = [];
    for (let i = 0; i < diaInicioOffset; i++) {
      this.diasDelCalendario.push({ dia: '', esHoy: false });
    }

    for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
      const esHoy = (i === hoy.getDate() && hoy.getMonth() === this.fechaActual.getMonth() && hoy.getFullYear() === this.fechaActual.getFullYear());
      this.diasDelCalendario.push({ dia: i, esHoy: esHoy });
    }
  }

  loadProfesorSpecificData(): void {
    // Simulación de carga de datos para el profesor
    // En una aplicación real, harías llamadas a servicios aquí (ej. EventoService, PublicacionService)
    this.proximosEventosImpartidos = [
      { id: 1, Nombre: 'Clase de Programación Avanzada', FechaInicio: new Date(2025, 7, 5, 9, 0), FechaFin: new Date(2025, 7, 5, 11, 0), Descripcion: 'Preparación para el examen final.' },
      { id: 2, Nombre: 'Reunión de Departamento', FechaInicio: new Date(2025, 7, 8, 14, 0), FechaFin: new Date(2025, 7, 8, 15, 0), Descripcion: 'Discusión de planes de estudio.' },
      { id: 3, Nombre: 'Taller de Investigación', FechaInicio: new Date(2025, 7, 12, 10, 0), FechaFin: new Date(2025, 7, 12, 12, 0), Descripcion: 'Sesión práctica sobre metodologías.' },
      { id: 4, Nombre: 'Asesoría Individual', FechaInicio: new Date(2025, 7, 15, 16, 0), FechaFin: new Date(2025, 7, 15, 17, 0), Descripcion: 'Revisión de proyectos de grado.' },
    ];

    this.ultimasPublicacionesForo = [
      { id: 1, Titulo: 'Duda sobre Algoritmos', Autor: 'Estudiante A', Fecha: new Date(2025, 6, 30), Contenido: 'Necesito ayuda con el algoritmo de Dijkstra.' },
      { id: 2, Titulo: 'Recursos para Base de Datos', Autor: 'Estudiante B', Fecha: new Date(2025, 6, 29), Contenido: 'Recomendaciones de libros sobre SQL.' },
      { id: 3, Titulo: 'Feedback Tarea 1', Autor: 'Estudiante C', Fecha: new Date(2025, 6, 28), Contenido: 'Preguntas sobre la calificación de la tarea.' },
    ];
  }
}
