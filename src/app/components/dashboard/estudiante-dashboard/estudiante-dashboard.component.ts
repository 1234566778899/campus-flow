// src/app/components/estudiante-dashboard/estudiante-dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { DashboardNavbarComponent } from '../dashboard-navbar/dashboard-navbar.component';

@Component({
  selector: 'app-estudiante-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    DashboardNavbarComponent,
  ],
  templateUrl: './estudiante-dashboard.component.html',
  styleUrl: './estudiante-dashboard.component.css'
})
export class EstudianteDashboardComponent implements OnInit {
  fechaActual = new Date();
  diasDelCalendario: { dia: number | null, esHoy: boolean }[] = [];
  private hoy = new Date();

  constructor() { }

  ngOnInit(): void {
    this.generarCalendario();
  }

  private generarCalendario(): void {
    const anio = this.fechaActual.getFullYear();
    const mes = this.fechaActual.getMonth();

    // El primer día del mes (0=Domingo, 1=Lunes, ..., 6=Sábado)
    // Lo ajustamos para que la semana empiece en Lunes (0=Lunes, ..., 6=Domingo)
    let primerDiaDelMes = new Date(anio, mes, 1).getDay();
    primerDiaDelMes = (primerDiaDelMes === 0) ? 6 : primerDiaDelMes - 1;

    // El último día del mes
    const ultimoDiaDelMes = new Date(anio, mes + 1, 0).getDate();

    this.diasDelCalendario = [];

    // Añadir los días de relleno al principio para alinear con el Lunes
    for (let i = 0; i < primerDiaDelMes; i++) {
      this.diasDelCalendario.push({ dia: null, esHoy: false });
    }

    // Añadir los días reales del mes
    for (let dia = 1; dia <= ultimoDiaDelMes; dia++) {
      const esHoy = dia === this.hoy.getDate() && mes === this.hoy.getMonth() && anio === this.hoy.getFullYear();
      this.diasDelCalendario.push({ dia: dia, esHoy: esHoy });
    }
  }
}