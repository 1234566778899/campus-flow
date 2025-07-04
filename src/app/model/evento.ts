export interface Evento {
  IdEvento?: number;
  Nombre: string;
  FechaInicio: string; // Usar string para LocalDate de Java (formato ISO 8601)
  FechaFin: string;    // Usar string para LocalDate de Java (formato ISO 8601)
  Descripcion: string;
  PuntajeRecompensa: number;
  idProfesor: number; // ID del profesor asociado
  Estado: boolean;
}