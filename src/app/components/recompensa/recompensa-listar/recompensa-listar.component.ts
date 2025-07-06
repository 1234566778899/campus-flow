import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
export interface Recompensa {
  IDRecompensa?: number;
  Plataforma: string;
  URL: string;
  id_EstudianteEstadistica: number;
  Estado: boolean;
}

@Component({
  selector: 'app-recompensa-listar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatSnackBarModule,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './recompensa-listar.component.html',
  styleUrl: './recompensa-listar.component.css'
})
export class RecompensaListarComponent implements OnInit {

  recompensas: Recompensa[] = [];
  recompensasFiltradas: Recompensa[] = [];
  filtroActivo: string = 'todas';

  // Datos de ejemplo (reemplazar con servicio real)
  private recompensasEjemplo: Recompensa[] = [
    {
      IDRecompensa: 1,
      Plataforma: 'Steam',
      URL: 'https://store.steampowered.com/app/123456/game',
      id_EstudianteEstadistica: 1,
      Estado: true
    },
    {
      IDRecompensa: 2,
      Plataforma: 'Netflix',
      URL: 'https://netflix.com/watch/12345',
      id_EstudianteEstadistica: 1,
      Estado: false
    },
    {
      IDRecompensa: 3,
      Plataforma: 'Spotify',
      URL: 'https://open.spotify.com/playlist/abc123',
      id_EstudianteEstadistica: 1,
      Estado: true
    },
    {
      IDRecompensa: 4,
      Plataforma: 'YouTube Premium',
      URL: 'https://youtube.com/premium',
      id_EstudianteEstadistica: 1,
      Estado: false
    },
    {
      IDRecompensa: 5,
      Plataforma: 'Amazon Prime',
      URL: 'https://amazon.com/prime/video',
      id_EstudianteEstadistica: 1,
      Estado: true
    },
    {
      IDRecompensa: 6,
      Plataforma: 'Discord Nitro',
      URL: 'https://discord.com/nitro',
      id_EstudianteEstadistica: 1,
      Estado: false
    }
  ];

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.cargarRecompensas();
  }

  cargarRecompensas() {
    // Aquí normalmente harías una llamada a tu servicio
    this.recompensas = this.recompensasEjemplo;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    switch (this.filtroActivo) {
      case 'disponibles':
        this.recompensasFiltradas = this.recompensas.filter(r => r.Estado);
        break;
      case 'canjeadas':
        this.recompensasFiltradas = this.recompensas.filter(r => !r.Estado);
        break;
      default:
        this.recompensasFiltradas = [...this.recompensas];
    }
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.aplicarFiltro();
  }

  canjearRecompensa(recompensa: Recompensa) {
    if (!recompensa.Estado) {
      this.snackBar.open('Esta recompensa ya ha sido canjeada', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      return;
    }

    // Actualizar estado
    recompensa.Estado = false;

    // Abrir URL en nueva pestaña
    window.open(recompensa.URL, '_blank');

    this.snackBar.open('¡Recompensa canjeada exitosamente!', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  eliminarRecompensa(idRecompensa: number) {
    this.recompensas = this.recompensas.filter(r => r.IDRecompensa !== idRecompensa);
    this.aplicarFiltro();

    this.snackBar.open('Recompensa eliminada', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

  }

  getPlatformaIcon(plataforma: string): string {
    const icons: { [key: string]: string } = {
      'steam': '🎮',
      'netflix': '📺',
      'spotify': '🎵',
      'youtube': '📹',
      'youtube premium': '📹',
      'amazon': '📦',
      'amazon prime': '📦',
      'discord': '💬',
      'discord nitro': '💬',
      'twitch': '🎥',
      'epic games': '🎮',
      'playstation': '🎮',
      'xbox': '🎮',
      'nintendo': '🎮'
    };

    const key = plataforma.toLowerCase();
    return icons[key] || '🎁';
  }

  getPlatformaColor(plataforma: string): string {
    const colors: { [key: string]: string } = {
      'steam': 'bg-blue-100 text-blue-800',
      'netflix': 'bg-red-100 text-red-800',
      'spotify': 'bg-green-100 text-green-800',
      'youtube': 'bg-red-100 text-red-800',
      'youtube premium': 'bg-red-100 text-red-800',
      'amazon': 'bg-orange-100 text-orange-800',
      'amazon prime': 'bg-orange-100 text-orange-800',
      'discord': 'bg-indigo-100 text-indigo-800',
      'discord nitro': 'bg-indigo-100 text-indigo-800',
      'twitch': 'bg-purple-100 text-purple-800',
      'epic games': 'bg-gray-100 text-gray-800',
      'playstation': 'bg-blue-100 text-blue-800',
      'xbox': 'bg-green-100 text-green-800',
      'nintendo': 'bg-red-100 text-red-800'
    };

    const key = plataforma.toLowerCase();
    return colors[key] || 'bg-gray-100 text-gray-800';
  }

  abrirURL(url: string) {
    window.open(url, '_blank');
  }

  getEstadoTexto(estado: boolean): string {
    return estado ? 'Disponible' : 'Canjeada';
  }

  getEstadoColor(estado: boolean): string {
    return estado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600';
  }

  getRecompensasDisponibles(): number {
    return this.recompensas.filter(r => r.Estado).length;
  }

  getRecompensasCanjeadas(): number {
    return this.recompensas.filter(r => !r.Estado).length;
  }
}