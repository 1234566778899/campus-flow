import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dasboard-error',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './dasboard-error.component.html',
  styleUrl: './dasboard-error.component.css'
})
export class ErrorDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Puedes añadir lógica aquí si necesitas hacer algo cuando se carga el error dashboard,
    // como limpiar datos de sesión o registrar el error.
    console.error('ErrorDashboardComponent: Se ha accedido a la página de error de carga.');
  }
}