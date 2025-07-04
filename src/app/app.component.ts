import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent // Importa tu componente de navbar
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CampusFlow';

  constructor() {} // Ya no necesitamos el Router aquí

  ngOnInit(): void {
    // La lógica de ocultar/mostrar la navbar global se ha eliminado
  }
}