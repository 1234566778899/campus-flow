import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Importar RouterModule para routerLink
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule para mat-button
import { MatIconModule } from '@angular/material/icon'; // Importar MatIconModule si usas <mat-icon>

@Component({
  selector: 'app-index',
  standalone: true, // Asegúrate de que tu componente sea standalone si lo estás usando así
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule // Solo si usas <mat-icon> en tu HTML
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  title = 'CampusFlow';

  constructor(private router: Router) { }

  // Datos de ejemplo para estadísticas
  stats = {
    students: '10K+',
    institutions: '500+',
    satisfaction: '98%'
  };

  // Método para navegación a descarga
  navigateToDownload(store: 'google' | 'apple') {
    if (store === 'google') {
      window.open('https://play.google.com/store', '_blank');
    } else {
      window.open('https://www.apple.com/app-store/', '_blank');
    }
  }
  startFree() {
    // Navegación programática como alternativa
    this.router.navigate(['/registro-selector']);
  }

  mostrarMasInfo() {
    // Implementar modal o navegación a página de información
    console.log('Mostrando más información...');
    // Opcional: navegar a página de información
    // this.router.navigate(['/nosotros']);
  }

  // Método para verificar si la ruta existe (debugging)
  debugRoute() {
    console.log('Rutas disponibles:', this.router.config);
  }
}
