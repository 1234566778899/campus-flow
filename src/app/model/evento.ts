export interface Evento {
  idEvento: number;
  nombre: string;
  fechaInicio: string; // LocalDate del backend se serializa como string ISO (YYYY-MM-DD)
  fechaFin: string;
  descripcion: string;
  puntajeRecompensa: number;
  idProfesor: number;
  estado: boolean;
}